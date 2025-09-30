import logging
from datetime import datetime
from azure.cosmos import CosmosClient, PartitionKey, exceptions
from azure.functions import TimerRequest
import azure.functions as func
from azure.functions import FunctionApp
from openai import OpenAI

app = FunctionApp()

COSMOS_ENDPOINT = ""
COSMOS_KEY = ""
COSMOS_DB = ""
SKILL_INFO_CONTAINER = ""
SKILL_QUESTIONS_CONTAINER = ""

OPENAI_API_KEY = "YOUR_OPENAI_KEY"   # 환경 변수로 관리 권장
client = OpenAI(api_key=OPENAI_API_KEY)


def generate_questions(skill: str) -> list[str]:
    """GPT를 호출해 해당 스킬의 평가 질문 10개를 생성"""
    prompt = f"'{skill}' 스킬에 대해 지원자의 숙련도를 평가할 수 있는 질문을 10개 만들어줘. " \
             f"답변은 질문만 번호 없이 줄바꿈으로 구분해서 출력해."

    payload = {
        "messages": [
            {"role": "system", "content": "너는 채용 평가 전문가다."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 500
    }

    try:
        response = client.chat.completions.create(model="gpt-4o-mini", **payload)
        text = response.choices[0].message.content.strip()
        questions = [q.strip() for q in text.split("\n") if q.strip()]
        return questions[:10]  # 혹시 10개 초과할 경우 자르기
    except Exception as e:
        logging.error(f"GPT 호출 실패 ({skill}): {e}")
        return []


@app.schedule(
    schedule="0 0 3 * * *",  # 매일 03:00 AM
    arg_name="myTimer",
    run_on_startup=True,
    use_monitor=False
)
def main(myTimer: TimerRequest):
    logging.info("Starting skill_questions ingestion with GPT")

    # Cosmos 연결
    try:
        cosmos = CosmosClient(COSMOS_ENDPOINT, COSMOS_KEY)
        db = cosmos.get_database_client(COSMOS_DB)
        skill_info_container = db.get_container_client(SKILL_INFO_CONTAINER)
        skill_questions_container = db.create_container_if_not_exists(
            id=SKILL_QUESTIONS_CONTAINER,
            partition_key=PartitionKey(path="/skill_id"),
            offer_throughput=400
        )
    except Exception as e:
        logging.exception("Cosmos DB 연결 실패")
        return

    # skill_info 읽기
    try:
        skills = list(skill_info_container.read_all_items())
    except Exception as e:
        logging.exception("skill_info 읽기 실패")
        return

    # 질문 생성 및 저장
    total_count = 0
    for skill_doc in skills:
        skill_id = skill_doc["skill_id"]
        skill_name = skill_doc["skill"]

        questions = generate_questions(skill_name)
        if not questions:
            continue

        for i, q in enumerate(questions, start=1):
            q_id = f"{skill_id}_q{i}"
            doc = {
                "id": q_id,
                "skill_id": skill_id,
                "skill": skill_name,
                "question": q,
                "created_at": datetime.utcnow().isoformat() + "Z",
                "source": "gpt"
            }
            try:
                skill_questions_container.upsert_item(doc)
                total_count += 1
            except exceptions.CosmosHttpResponseError as e:
                logging.warning(f"Upsert 실패: {q_id} -> {e}")

    logging.info(f"Inserted {total_count} GPT-generated questions into skill_questions")
