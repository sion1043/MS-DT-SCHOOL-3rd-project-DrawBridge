import argparse
import asyncio
from dataclasses import dataclass
import datetime as dt
from datetime import datetime
from itertools import islice
import json
import logging
from logging.handlers import TimedRotatingFileHandler
import math
import os
import random
import re
import sys
import time
from typing import Any, Optional, Union
from urllib.parse import urlparse

import aiohttp
from azure.eventhub import EventHubProducerClient, EventData
import azure.functions as func
from bs4 import BeautifulSoup
from huggingface_hub import HfApi
import pandas as pd
import psycopg2
import pytz
import requests
from tqdm import tqdm
from uuid_utils import uuid7

# -----------------------------
# 환경변수
# -----------------------------
ENCODING_TYPE = 'utf-8-sig'
BASE = "https://huggingface.co"
HF_READ_TOKEN = os.getenv("HF_READ_TOKEN", None)
HF_WRITE_TOKEN = os.getenv("HF_WRITE_TOKEN", None)

EVENTHUB_CONNECTION_STRING = os.getenv("EVENTHUB_CONNECTION_STRING", None)
META_EVENTHUB_NAME = os.getenv("META_EVENTHUB_NAME", None)
FILE_EVENTHUB_NAME = os.getenv("FILE_EVENTHUB_NAME", None)
COMU_EVENTHUB_NAME = os.getenv("COMU_EVENTHUB_NAME", None)
CLOUD_DB_USER = os.getenv("CLOUD_DB_USER", None)
CLOUD_DB_PASSWORD = os.getenv("CLOUD_DB_PASSWORD", None)
CLOUD_DB_HOST = os.getenv("CLOUD_DB_HOST", None)

# -----------------------------
# 환경변수
# -----------------------------
app = func.FunctionApp()


# =====================
# Logging
# =====================
def setup_logging(log_to_file=False):
    handlers = []
    
    # 콘솔 핸들러는 항상 포함
    console_handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(asctime)s][%(levelname)s][%(name)s] %(message)s")
    console_handler.setFormatter(formatter)
    handlers.append(console_handler)
    
    if log_to_file:
        log_dir = "/logs"
        os.makedirs(log_dir, exist_ok=True)
        log_path = os.path.join(log_dir, "project.log")
        file_handler = TimedRotatingFileHandler(
            filename=log_path,
            when="midnight",
            interval=1,
            backupCount=7,
            encoding=ENCODING_TYPE
        )
        file_handler.setFormatter(formatter)
        handlers.append(file_handler)

    logging.basicConfig(level=logging.INFO, handlers=handlers)


# =====================
# Utility
# =====================

def make_hashable(data: Any) -> Union[tuple, str, None]:
    if isinstance(data, list):
        return tuple(data)
    return data


def jprint(data: Any):
    print(json.dumps(data, ensure_ascii=False, indent=4))


def batched(iterable, n):
    it = iter(iterable)
    while True:
        batch = list(islice(it, n))
        if not batch:
            break
        yield batch


def change_timestamp(dt_str: Optional[str]) -> str:
    if dt_str is None:
        return None
    
    if isinstance(dt_str, float):  # NaN, inf 같은 경우
        if math.isnan(dt_str) or math.isinf(dt_str):
            return None
    
    dt = datetime.strptime(dt_str[:-1], "%Y-%m-%dT%H:%M:%S.%f") # 문자열 파싱
    dt = dt.replace(tzinfo=pytz.UTC)        # UTC 지정
    seoul_tz = pytz.timezone("Asia/Seoul")  # Asia/Seoul로 변환
    dt_kst = dt.astimezone(seoul_tz)
    format1 = dt_kst.strftime("%Y-%m-%d %H:%M:%S")
    return format1
    # format2 = dt_kst.isoformat()
    # pg_ready = dt_kst.strftime("%Y-%m-%d %H:%M:%S.%f%z")
    # format3 = pg_ready[:-2] + ":" + pg_ready[-2:]
    # format_ = dt_kst.strftime("%Y-%m-%d %H:%M:%S:%z")[:-2]
    

# =====================
# Helper funcs (sync)
# =====================

def build_session() -> requests.Session:
    session = requests.Session()
    session.headers.update({
        "User-Agent": "hf-text-scraper/1.0 (+https://github.com/)",
        "Accept": "application/json, text/plain, */*",
    })
    token = HF_READ_TOKEN
    if token:
        session.headers.update({"Authorization": f"Bearer {token}"})
    return session


# =====================
# Helper funcs (async)
# =====================

@dataclass
class AsyncHTTPConfig:
    timeout_sec: int = 30
    max_retries: int = 5
    backoff_base: float = 0.5
    jitter: float = 0.2


async def _fetch_json(session: aiohttp.ClientSession, url: str, cfg: AsyncHTTPConfig) -> Any:
    for attempt in range(cfg.max_retries):
        try:
            async with session.get(url, timeout=cfg.timeout_sec) as resp:
                if resp.status in (200, 201):
                    ctype = resp.headers.get("Content-Type", "")
                    if "json" in ctype:
                        return await resp.json()
                    try:
                        raw = await resp.read()
                        return json.loads(raw.decode('utf-8'))
                    except Exception as e:
                        return raw.decode('utf-8', errors='replace')
                if resp.status in (404, 410):
                    return None
                if resp.status in (429, 500, 502, 503, 504):
                    # retryable
                    pass
                else:
                    # unexpected
                    text = await resp.text()
                    # raise RuntimeError(f"HTTP {resp.status}: {text[:200]}")
                    return None
        except Exception as e:
            if attempt == cfg.max_retries - 1:
                raise
        
        # backoff
        await asyncio.sleep(cfg.backoff_base * (2 ** attempt) + random.random() * cfg.jitter)
    return None


async def get_model_meta_async(
    session: aiohttp.ClientSession,
    repo_id: str,
    cfg: AsyncHTTPConfig
) -> dict[str, Any]:
    url = f"{BASE}/api/models/{repo_id}"
    data = await _fetch_json(session, url, cfg)
    return data if isinstance(data, dict) else None


async def get_readme_markdown_async(
    session: aiohttp.ClientSession,
    repo_id: str,
    cfg: AsyncHTTPConfig,
    revision: str = "main"
) -> str:
    url = f"{BASE}/{repo_id}/resolve/{revision}/README.md"
    data = await _fetch_json(session, url, cfg)
    if isinstance(data, str) and data:
        return data
    return ""


async def get_files_tree_async(
    session: aiohttp.ClientSession,
    repo_id: str,
    cfg: AsyncHTTPConfig,
    revision: str = "main",
    limit: int = 1000
) -> list[dict[str, Any]]:
    files = []
    cursor = None
    while True:
        url = f"{BASE}/api/models/{repo_id}/tree/{revision}?limit={limit}"
        if cursor:
            url += f"&cursor={cursor}"
        
        data = await _fetch_json(session, url, cfg)
        if data is None:
            break
        
        items = data.get("tree", []) if isinstance(data, dict) else data
        if not items:
            break
        
        files.extend(items)
        cursor = (
            (data.get("cursor") or data.get("nextCursor"))
            if isinstance(data, dict) else None
        )
        if not cursor:
            break
        await asyncio.sleep(0.05)
    return files


async def get_community_async(
    session: aiohttp.ClientSession,
    repo_id: str,
    cfg: AsyncHTTPConfig,
    limit: int = 100
) -> list[dict[str, Any]]:
    results = []
    cursor = None
    while True:
        url = f"{BASE}/api/models/{repo_id}/discussions?limit={limit}"
        if cursor:
            url += f"&cursor={cursor}"
        
        data = await _fetch_json(session, url, cfg)
        if data is None:
            break
        
        items = data.get("discussions") if isinstance(data, dict) else data
        if not items:
            break
        
        results.extend(items)
        cursor = (
            data.get("cursor") or data.get("nextCursor")
            if isinstance(data, dict) else data
        )
        if not cursor:
            break
        await asyncio.sleep(0.05)
    return results


async def isinBRZ(cur: psycopg2.extensions.cursor, model_id: str) -> bool:
    query = "SELECT 1 FROM bronze.brz_hf_meta WHERE id = %s LIMIT 1;"
    cur.execute(query, (model_id, ))
    return cur.fetchone()


# =====================
# Main class
# =====================

class HuggingFace:
    def __init__(self) -> None:
        self.api = HfApi()
        self.logger = logging.getLogger(self.__class__.__name__)
        self.session = build_session()
        self.base_url = "https://huggingface.co/"
        self.api_schema = [
            "id",                   # 모델 전체 ID, author/model_name의 형태
            "gguf",                 # GGUF 포맷 변환 여부 (LLaMA 등 양자화 모델 관련 정보)
            "inference",            # Inference API 지원 여부
            "mask_token",           # BERT류 모델에서 [MASK] 토큰 같은 마스킹 토큰 값
            "widget_data",          # 모델 위젯(사이트 우측 패널)에서 보여주는 예시 입출력
            "trending_score",       # 인기도 점수(내부 점수라 모름)
            "security_repo_status", # 보안 관련 검토 상태
            # "downloads_all_time",   # 전체 기간 다운로드 횟수(제공 안 하는 경우 다수 존재)
        ]
        self.req_schema = [
            "_id",                  # hex 코드로 들어오는 id값    
            "id",                   # 모델 전체 ID, author/model_name의 형태
            "private",              # 모델 비공개 여부
            "pipeline_tag",         # 모델의 대표 태스크
            "library_name",         # 모델이 주로 사용하는 라이브러리
            "tags",                 # 모델에 붙은 태그 리스트
            "downloads",            # 최근 1달 다운로드 횟수
            "likes",                # 좋아요 수
            "modelId",              # id와 동일
            "author",               # 작성자, None이라면 id 앞부분이 author 역할
            "sha",                  # 현재 repo의 commit SHA, 버전 식별자 역할
            "lastModified",         # 마지막 수정 날짜
            "gated",                # 접근 제한 모델 여부 (동의 절차 필요)
            "disabled",             # 허깅페이스 정책 위반/이슈로 인해 비활성화 상태인지 여부
            "model-index",          # 모델 평가 지표, 벤치마크 관련 데이터
            "config",               # 모델 설정 파일(config.json)에서 읽은 파라미터들
            "cardData",             # 모델 카드(README.md)에서 추출한 메타데이터(YAML 헤더)
            "transformersInfo",     # Transformer 라이브러리 관련 정보(구성, 아키텍쳐 등)
            # "siblings",             # 모델 저장소 파일 리스트(동일한 repo 안의 여러 파일들)
            "spaces",               # 이 모델을 사용하는 허깅페이스 Hugging Face Spaces 정보
            "createdAt",            # 모델 처음 생성 날짜
            "safetensors",          # 모델 저장 포맷이 safetensors인지 여부
            "usedStorage",          # 이거는 뭘까?            
        ]
        self.rename = {
            "_id": "hexid",
            "model-index": "model_index",
            "createdAt": "created_at",
            "lastModified": "last_modified",
            "cardData": "card_data",
            "transformersInfo": "transformers_info",
            "usedStorage": "used_storage"
        }
        self.reorder = [
            "id", "hexid", "sha", "author", "private", "disabled", "gated",
            "pipeline_tag", "library_name", "tags", "likes", "downloads",
            "trending_score", "created_at", "last_modified", "config", "card_data",
            "safetensors", "spaces", "transformers_info", "used_storage", "readme",
            "model_index", "gguf", "inference", "mask_token", "widget_data", "security_repo_status"
        ]
        self.cols = [
            "uuid7", "model_id", "type", "oid", "size", "path",
            "lfs_oid", "lfs_size", "lfs_pointerSize", "xetHash"
        ]
        self.comu_rename = {
            "model_id": "model_id",
            "num": "num",
            "title": "title",
            "status": "status",
            "createdAt": "created_at",
            "isPullRequest": "is_pull_request",
            "numComments": "num_comments",
            "topReactions": "top_reactions",
            "numReactionUsers": "num_reaction_users",
            "pinned": "pinned",
            "author__id": "author_id",
            "author_avatarUrl": "author_avatar_url",
            "author_fullname": "author_fullname",
            "author_name": "author_name",
            "author_type": "author_type",
            "author_isPro": "author_ispro",
            "author_isHf": "author_ishf",
            "author_isHfAdmin": "author_ishf_admin",
            "author_isMod": "author_ismod",
            "author_followerCount": "author_follower_count",
            "repo_name": "repo_name",
            "repo_type": "repo_type",
            "repoOwner_name": "repo_owner_name",
            "repoOwner_isParticipating": "repo_owner_isparticipating",
            "repoOwner_type": "repo_owner_type",
            "repoOwner_isDiscussionAuthor": "repo_owner_isdiscussion_author"
        }
        self.comu_reindex = [
            "uuid7", "model_id", "num", "title", "status", "created_at", "is_pull_request",
            "num_comments","top_reactions", "num_reaction_users", "pinned",
            "author_id", "author_avatar_url", "author_fullname", "author_name",
            "author_type", "author_ispro", "author_ishf", "author_ishf_admin",
            "author_ismod", "repo_name", "repo_type", "repo_owner_name",
            "repo_owner_isparticipating", "repo_owner_type",
            "repo_owner_isdiscussion_author", "author_follower_count"
        ]
    
    # -----------------
    # ASYNC: aiohttp
    # -----------------
    async def reset_csv_async(
        self,
        sort: str = "createdAt",
        limit: Optional[int] = None,
        concurrency: int = 32,
        include_readme: bool = True,
        include_files: bool = True,
        include_community: bool = True,
        batch_size: int = 3_500,
        cloud_db_cursor: psycopg2.extensions.cursor = None
    ) -> tuple[pd.DataFrame]:
        if aiohttp is None:
            raise RuntimeError("Async mode requires aiohttp. Install it first: pip install aiohttp")
                
        self.logger.info(f"RESET_CSV(ASYNC) 시작")
        models = self.api.list_models(sort=sort, limit=limit)
        self.logger.info(f"API list_models 함수 호출 완료")
        
        sema = asyncio.Semaphore(concurrency)
        headers = {
            "User-Agent": "hf-text-scraper/1.0 (+https://github.com/)",
            "Accept": "application/json, text/plain, */*",
        }
        if HF_READ_TOKEN:
            headers["Authorization"] = f"Bearer {HF_READ_TOKEN}"
        cfg = AsyncHTTPConfig()
        
        metadatas, files, communities = [], [], []
        async with aiohttp.ClientSession(headers=headers) as session:            
            async def process(model):
                async with sema:
                    base = {attr: getattr(model, attr) for attr in self.api_schema}
                    repo_id = getattr(model, "id", None)
                    meta = {}
                    readme = {}
                    f_list = []
                    c_list = []
                    
                    if include_readme or include_files or include_community:
                        meta_full = await get_model_meta_async(session, repo_id, cfg)
                        if isinstance(meta_full, dict):
                            meta = {k: meta_full.get(k, None) for k in self.req_schema}
                    if include_readme:
                        readme_text = await get_readme_markdown_async(session, repo_id, cfg)
                        readme = {"readme": readme_text}
                    if include_files:
                        for ft in await get_files_tree_async(session, repo_id, cfg):
                            f_list.append({"model_id": repo_id} | ft)
                    if include_community:
                        for c in await get_community_async(session, repo_id, cfg):
                            c_list.append({"model_id": repo_id} | c)
                    
                    merged = base | meta | readme
                    # self.logger.info(f"{model.id} 완료")
                    return merged, f_list, c_list
            
            for model in tqdm(models):
                isin = await isinBRZ(cloud_db_cursor, model.id)
                if isin:
                    break
                
                tasks = {asyncio.create_task(process(model))}
                for coro in tqdm(asyncio.as_completed(tasks), total=len(tasks)):
                    meta, f_list, c_list = await coro
                    metadatas.append({k: make_hashable(v) for k, v in meta.items()})
                    files.extend(f_list)
                    communities.extend(c_list)
        
        meta_df, file_df, community_df = self._write_csvs(metadatas, files, communities)
        self.logger.info(f"RESET_CSV(ASYNC) 완료")
        return meta_df, file_df, community_df
    
    
    def _write_csvs(
        self,
        metadatas: list[dict],
        files: list[dict],
        communities: list[dict]
    ) -> tuple[pd.DataFrame]:
        # save dataframe: metadata
        meta_df = (
            pd.DataFrame(metadatas)
            .rename(columns=self.rename)
            .reindex(columns=self.reorder)
            .assign(
                created_at=lambda df: df["created_at"].map(change_timestamp),
                last_modified=lambda df: df["last_modified"].map(change_timestamp),
            )
        )
        # meta_df.to_csv('hf_metadata.csv', encoding=ENCODING_TYPE, index=False)
        self.logger.info(f"hf_metadata.csv 생성 완료")
        
        # save dataframe: files
        file_df = (
            pd
            .json_normalize(files, sep="_")
            .assign(uuid7=lambda df: [str(uuid7()) for _ in range(len(df))])
            .reindex(columns=self.cols)
            .rename(columns={"xetHash": "xethash", "lfs_pointerSize": "lfs_pointersize"})
            .where(pd.notna, None)
        )
        # file_df.to_csv('hf_files.csv', encoding=ENCODING_TYPE, index=False)
        self.logger.info(f"hf_files.csv 생성 완료")
        
        # save dataframe: community
        community_df = (
            pd
            .json_normalize(communities, sep="_")
            .assign(uuid7=lambda df: [str(uuid7()) for _ in range(len(df))])
            .rename(columns=self.comu_rename)
            .reindex(columns=self.comu_reindex)
            .where(pd.notna, None)
            .assign(created_at=lambda df: df["created_at"].map(change_timestamp))
        )
        # community_df.to_csv('hf_community.csv', encoding=ENCODING_TYPE, index=False)        
        self.logger.info(f"hf_community.csv 생성 완료")
        return meta_df, file_df, community_df


# =====================
# main call start
# =====================
@app.timer_trigger(schedule="0 0 0 * * *", arg_name="myTimer", run_on_startup=False, use_monitor=False) 
def timer_trigger(myTimer: func.TimerRequest) -> None:
    setup_logging()
    logging.info('Complete Setup Logger')
    
    # -----------------------------
    # Cloud DB(Azure DB for Postgres)의 BRZ에 접속
    # -----------------------------
    conn = psycopg2.connect(
        user=CLOUD_DB_USER,
        password=CLOUD_DB_PASSWORD,
        host=CLOUD_DB_HOST,
        port=5432,
        database="postgres",
        sslmode="require"
    )
    cur = conn.cursor()
    logging.info('Connect Azure DB for PostgreSQL.')
    
    # -----------------------------
    # Huggingface에서 데이터 수집
    # -----------------------------
    hf = HuggingFace()
    logging.info('Complete Generate HuggingFace<class> instance')
    
    logging.info('Ready to start async huggingface data collection.')
    meta_df, file_df, community_df = asyncio.run(
        hf.reset_csv_async(
            sort="createdAt",
            limit=10,
            concurrency=256,
            include_readme=True,
            include_files=True,
            include_community=True,
            batch_size=4_096,
            cloud_db_cursor=cur
        )
    )
    logging.info('End to start async huggingface data collection.')
    cur.close()
    conn.close()
    
    # -----------------------------
    # EventHub에 META DataFrame 전송
    # -----------------------------
    producer = EventHubProducerClient.from_connection_string(
        conn_str=EVENTHUB_CONNECTION_STRING,
        eventhub_name=META_EVENTHUB_NAME
    )
    # DataFrame을 JSON 문자열 리스트로 변환
    records = (
        meta_df
        .astype(object)
        .where(pd.notnull(meta_df), None)
        .to_dict(orient='records')
    )
    json_strings = [json.dumps(rec, ensure_ascii=False, allow_nan=False) for rec in records]

    with producer:
        batch = producer.create_batch()
        for js in json_strings:
            try:
                batch.add(EventData(js))
            except ValueError:
                # 배치가 꽉 차면 전송 후 새 배치 생성
                producer.send_batch(batch)
                batch = producer.create_batch()
                batch.add(EventData(js))
        # 마지막 배치 전송
        if len(batch) > 0:
            producer.send_batch(batch)
    logging.info("DataFrame successfully sent to META EventHub.")
    
    # -----------------------------
    # EventHub에 FILE DataFrame 전송
    # -----------------------------
    producer = EventHubProducerClient.from_connection_string(
        conn_str=EVENTHUB_CONNECTION_STRING,
        eventhub_name=FILE_EVENTHUB_NAME
    )
    records = file_df.astype(object).where(pd.notnull(file_df), None).to_dict(orient='records')
    json_strings = [json.dumps(rec, ensure_ascii=False, allow_nan=False) for rec in records]

    with producer:
        batch = producer.create_batch()
        for js in json_strings:
            try:
                batch.add(EventData(js))
            except ValueError:
                # 배치가 꽉 차면 전송 후 새 배치 생성
                producer.send_batch(batch)
                batch = producer.create_batch()
                batch.add(EventData(js))
        # 마지막 배치 전송
        if len(batch) > 0:
            producer.send_batch(batch)
    logging.info("DataFrame successfully sent to FILES EventHub.")
    
    # -----------------------------
    # EventHub에 COMU DataFrame 전송
    # -----------------------------
    producer = EventHubProducerClient.from_connection_string(
        conn_str=EVENTHUB_CONNECTION_STRING,
        eventhub_name=COMU_EVENTHUB_NAME
    )
    records = community_df.astype(object).where(pd.notnull(community_df), None).to_dict(orient='records')
    json_strings = [json.dumps(rec, ensure_ascii=False, allow_nan=False) for rec in records]

    with producer:
        batch = producer.create_batch()
        for js in json_strings:
            try:
                batch.add(EventData(js))
            except ValueError:
                # 배치가 꽉 차면 전송 후 새 배치 생성
                producer.send_batch(batch)
                batch = producer.create_batch()
                batch.add(EventData(js))
        # 마지막 배치 전송
        if len(batch) > 0:
            producer.send_batch(batch)
    logging.info("DataFrame successfully sent to COMMUNITY EventHub.")
