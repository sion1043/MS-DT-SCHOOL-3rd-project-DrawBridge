import logging
import psycopg2
from datetime import datetime
from azure.cosmos import CosmosClient, PartitionKey, exceptions
from azure.functions import TimerRequest
import azure.functions as func
from azure.functions import FunctionApp
from urllib.parse import quote  # 추가

app = FunctionApp()

POSTGRES_CONN = ""
COSMOS_ENDPOINT = ""
COSMOS_KEY = ""
COSMOS_DB = ''
COSMOS_CONTAINER = ''


@app.schedule(
    schedule="0 0 2 * * *",  # 매일 02:00 AM (UTC)
    arg_name="myTimer",
    run_on_startup=True,
    use_monitor=False
)
def main(myTimer: TimerRequest):
    logging.info("Starting ingest_skills Timer Trigger")

    # 1️⃣ Postgres 읽기
    try:
        pg_conn = psycopg2.connect(POSTGRES_CONN)
        cur = pg_conn.cursor()
        cur.execute("SELECT skill FROM meta.jumpit_skills;")
        rows = cur.fetchall()
        cur.close()
        pg_conn.close()
    except Exception as e:
        logging.exception("Postgres 읽기 실패")
        return

    # 2️⃣ Cosmos DB 연결
    try:
        client = CosmosClient(COSMOS_ENDPOINT, COSMOS_KEY)
        db = client.create_database_if_not_exists(id=COSMOS_DB)
        container = db.create_container_if_not_exists(
            id=COSMOS_CONTAINER,
            partition_key=PartitionKey(path="/skill_id"),
            offer_throughput=400
        )
    except Exception as e:
        logging.exception("Cosmos DB 연결 실패")
        return

    # 3️⃣ 데이터 업서트
    count = 0
    for (skill,) in rows:
        if not skill:
            continue
        skill = skill.strip()

        # URL-safe ID 생성
        skill_id = quote(skill.lower().replace(" ", "_"), safe="")

        doc = {
            "id": skill_id,           # Cosmos 필수 키
            "skill_id": skill_id,     # Partition key
            "skill": skill,           # 원본 스킬명
            "description": None,
            "source": "postgres",
            "created_at": datetime.utcnow().isoformat() + "Z"
        }

        try:
            container.upsert_item(doc)
            count += 1
        except exceptions.CosmosHttpResponseError as e:
            logging.warning(f"Upsert 실패: {skill} -> {e}")

    logging.info(f"Upserted {count} skills into Cosmos DB")
