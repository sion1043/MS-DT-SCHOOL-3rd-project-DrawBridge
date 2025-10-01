import logging
import json
import random
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import requests
from azure.cosmos.aio import CosmosClient
from azure.functions import HttpRequest, HttpResponse
from azure.functions import FunctionApp
import asyncio

app = FunctionApp()

# -----------------------------
# Cosmos DB 설정
# -----------------------------
COSMOS_ENDPOINT = ""
COSMOS_KEY = ""
COSMOS_DB = ""
SKILL_ANSWERS_CONTAINER = ""

# -----------------------------
# Azure OpenAI Embedding 설정
# -----------------------------
AZURE_OPENAI_KEY = ""
EMBEDDING_ENDPOINT = ""
HEADERS = {"Content-Type": "application/json", "api-key": AZURE_OPENAI_KEY}

# -----------------------------
# 사용자 답변 임베딩 생성
# -----------------------------
async def get_embedding(text: str):
    payload = {"input": text}
    resp = requests.post(
        EMBEDDING_ENDPOINT,
        headers=HEADERS,
        json=payload
    )
    resp.raise_for_status()
    data = resp.json()
    return np.array(data["data"][0]["embedding"]).reshape(1, -1)

# -----------------------------
# 스킬 평가
# -----------------------------
async def evaluate_skill(skill_id: str, user_answer: str, question_num: int | None, container):
    # 질문 가져오기
    query = """
    SELECT DISTINCT c.question, c.question_num
    FROM c
    WHERE c.skill_id = @skill_id
    """
    params = [{"name": "@skill_id", "value": skill_id}]
    questions = []
    async for q in container.query_items(query=query, parameters=params):
        questions.append(q)

    if not questions:
        return {"error": f"{skill_id} 관련 질문 없음"}

    # 질문 선택
    if question_num:
        selected_q = next((q for q in questions if q["question_num"] == question_num), None)
        if not selected_q:
            return {"error": f"{skill_id} Q{question_num} 없음"}
    else:
        selected_q = random.choice(questions)

    question_text = selected_q["question"]
    question_num = selected_q["question_num"]

    # 사용자 임베딩
    user_embedding = await get_embedding(user_answer)

    # 정답 10개 가져오기
    query = """
    SELECT c.answer_num, c.answer_embedding
    FROM c
    WHERE c.skill_id = @skill_id AND c.question_num = @question_num
    ORDER BY c.answer_num
    """
    params = [
        {"name": "@skill_id", "value": skill_id},
        {"name": "@question_num", "value": question_num}
    ]
    answers = []
    async for ans in container.query_items(query=query, parameters=params):
        answers.append(ans)

    if not answers:
        return {"error": f"{skill_id} Q{question_num} 관련 답변 없음"}

    # 코사인 유사도 & 가중치
    sims, weights = [], []
    for ans in answers:
        emb = np.array(ans["answer_embedding"]).reshape(1, -1)
        sim = cosine_similarity(user_embedding, emb)[0][0] * 100
        sims.append(sim)
        weights.append(ans["answer_num"])

    total_weight = sum(weights)

    # 숙련도 계산
    weighted_avg = sum(s * w for s, w in zip(sims, weights)) / total_weight
    top_indices = np.argsort(sims)[-3:]
    weighted_top = sum(sims[i] * weights[i] for i in top_indices) / sum(weights[i] for i in top_indices)

    return {
        "question": question_text,
        "skill_level_all_answer": weighted_avg,
        "skill_level_top3": weighted_top,
        "sims": sims,
        "weights": weights
    }

# -----------------------------
# HTTP 트리거
# -----------------------------
@app.route(route="evaluate_skill", methods=["POST"])
async def evaluate_skill_http(req: HttpRequest) -> HttpResponse:
    try:
        body = req.get_json()
        skill_id = body["skill_id"]
        user_answer = body["user_answer"]
        question_num = body.get("question_num")

        client = CosmosClient(COSMOS_ENDPOINT, credential=COSMOS_KEY)
        db = client.get_database_client(COSMOS_DB)
        container = db.get_container_client(SKILL_ANSWERS_CONTAINER)

        result = await evaluate_skill(skill_id, user_answer, question_num, container)
        await client.close()

        return HttpResponse(json.dumps(result), mimetype="application/json")

    except Exception as e:
        logging.error(e)
        return HttpResponse(json.dumps({"error": str(e)}), status_code=500)
