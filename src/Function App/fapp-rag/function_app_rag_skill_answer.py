import logging
import asyncio
from datetime import datetime, timezone, timedelta
from azure.cosmos.aio import CosmosClient
from azure.cosmos import PartitionKey
from azure.cosmos.exceptions import CosmosHttpResponseError
from azure.functions import TimerRequest, FunctionApp
import requests
import nest_asyncio

nest_asyncio.apply()
app = FunctionApp()

# -----------------------------
# Cosmos DB 설정
# -----------------------------
COSMOS_ENDPOINT = ""
COSMOS_KEY = ""
COSMOS_DB = ""
SKILL_QUESTIONS_CONTAINER = ""
SKILL_ANSWERS_CONTAINER = ""

# -----------------------------
# Azure OpenAI 설정 (REST)
# -----------------------------
AZURE_OPENAI_KEY = ""
CHATGPT_ENDPOINT = ""
EMBEDDING_ENDPOINT = ""

HEADERS = {"Content-Type": "application/json", "api-key": AZURE_OPENAI_KEY}

# -----------------------------
# 비동기 재시도 헬퍼
# -----------------------------
async def retry_async(func, retries=3, delay=2, backoff=2):
    for attempt in range(retries):
        try:
            return await func()
        except (CosmosHttpResponseError, Exception) as e:
            logging.warning(f"⚠️ 시도 {attempt+1}/{retries} 실패: {e}")
            if attempt < retries - 1:
                await asyncio.sleep(delay)
                delay *= backoff
            else:
                logging.error(f"❌ 최대 재시도 초과: {e}")
                return None

# -----------------------------
# GPT 질문 답변 생성
# -----------------------------
async def generate_answers(question: str, skill_name: str, num_answers=10):
    prompt = (
        f"'{skill_name}' 스킬에 대한 질문: \"{question}\"\n"
        f"이 질문에 대해 **스킬 숙련도가 1단계에서 10단계까지 점진적으로 높아지도록** 10개의 답변을 만들어 주세요. "
        f"각 답변은 **200~250자 내외**로 작성하고, 서로 겹치지 않도록 합니다. "
        f"답변은 해당 스킬 분야 **전문가 시점에서 상세하게** 작성하고, 단계가 올라갈수록 난이도와 숙련도가 증가하는 방식으로 작성해주세요. "
        f"출력 형식은 줄바꿈으로 구분하고 번호는 붙이지 마세요."
    )

    def sync_call():
        payload = {
            "messages": [
                {"role": "system", "content": "너는 채용 평가 전문가다."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 1200,
            "temperature": 0.8
        }
        resp = requests.post(CHATGPT_ENDPOINT, headers=HEADERS, json=payload)
        resp.raise_for_status()
        data = resp.json()
        text = data['choices'][0]['message']['content'].strip()
        answers = [a.strip() for a in text.split("\n") if a.strip()]
        return answers[:num_answers]

    return await asyncio.to_thread(sync_call)

# -----------------------------
# 임베딩 생성 (batch)
# -----------------------------
async def get_embeddings(texts: list[str]):
    def sync_call():
        payload = {"input": texts}
        resp = requests.post(EMBEDDING_ENDPOINT, headers=HEADERS, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return [d["embedding"] for d in data["data"]]
    return await asyncio.to_thread(sync_call)

# -----------------------------
# 하나의 질문 처리 (조건 체크)
# -----------------------------
async def process_question(skill_doc, question_num, question, container, existing_keys: set):
    skill_id = skill_doc["skill_id"]
    skill_name = skill_doc["skill"]

    expected_ids = [f"{skill_id}_q{question_num}_a{i}" for i in range(1, 11)]
    existing_for_question = [eid for eid in expected_ids if eid in existing_keys]

    # 조건 1: 10개 다 있으면 건너뜀
    if len(existing_for_question) == 10:
        logging.info(f"{skill_id} Q{question_num} → 이미 10개 답변 존재, 건너뜀")
        return 0

    # 조건 2: 없거나 일부만 있으면 → 1~10 전부 새로 생성 + 덮어쓰기
    answers = await retry_async(lambda: generate_answers(question, skill_name))
    if not answers:
        return 0

    embeddings = await retry_async(lambda: get_embeddings(answers))
    if not embeddings:
        return 0

    count = 0
    for i, (answer, embedding) in enumerate(zip(answers, embeddings), start=1):
        doc_id = f"{skill_id}_q{question_num}_a{i}"
        doc = {
            "id": doc_id,
            "skill_id": skill_id,
            "skill": skill_name,
            "question": question,
            "question_num": question_num,
            "answer": answer,
            "answer_num": i,
            "answer_embedding": embedding,
            "created_at": datetime.now(timezone(timedelta(hours=9))).isoformat(),
            "source": "gpt"
        }
        try:
            await container.upsert_item(doc)  # 항상 덮어쓰기
            count += 1
        except CosmosHttpResponseError as e:
            logging.warning(f"Upsert 실패: {doc_id} -> {e}")
    return count

# -----------------------------
# 스킬 단위 처리
# -----------------------------
async def process_skill(skill_doc, container, existing_keys: set):
    questions = skill_doc.get("questions", [])
    updated_count = 0
    for i, q in enumerate(questions, start=1):
        count = await process_question(skill_doc, i, q, container, existing_keys)
        updated_count += count
    return updated_count

# -----------------------------
# Timer Trigger
# -----------------------------
@app.schedule(
    schedule="0 0 3 * * *",
    arg_name="myTimer",
    run_on_startup=True,
    use_monitor=False
)
def main(myTimer: TimerRequest):
    logging.info("🚀 Skill Answers 생성 시작")
    asyncio.run(main_async())

# -----------------------------
# 메인 비동기 함수
# -----------------------------
async def main_async():
    # Cosmos DB 연결
    client = CosmosClient(COSMOS_ENDPOINT, COSMOS_KEY)
    db = client.get_database_client(COSMOS_DB)
    skill_questions_container = db.get_container_client(SKILL_QUESTIONS_CONTAINER)
    skill_answers_container = await db.create_container_if_not_exists(
        id=SKILL_ANSWERS_CONTAINER,
        partition_key=PartitionKey(path="/skill_id"),
        offer_throughput=400
    )

    # 기존 데이터 키 조회
    existing_keys = set()
    query = "SELECT c.id FROM c"
    async for item in skill_answers_container.query_items(query=query):
        existing_keys.add(item['id'])
    logging.info(f"✅ 기존 {len(existing_keys)}개 데이터 확인 완료")

    # 모든 스킬 읽기
    skills = []
    async for skill_doc in skill_questions_container.read_all_items():
        skills.append(skill_doc)
    logging.info(f"총 {len(skills)}개의 스킬 처리 시작")

    # 스킬 동시 처리
    sem = asyncio.Semaphore(10)
    async def sem_skill_task(skill_doc):
        async with sem:
            count = await process_skill(skill_doc, skill_answers_container, existing_keys)
            logging.info(f"{skill_doc['skill_id']} -> {count}개 답변 생성/업데이트 완료")
            return count

    tasks = [sem_skill_task(skill_doc) for skill_doc in skills]
    results = await asyncio.gather(*tasks)
    total_answers = sum(results)
    logging.info(f"✅ 총 {total_answers}개의 답변 생성 및 저장 완료")
