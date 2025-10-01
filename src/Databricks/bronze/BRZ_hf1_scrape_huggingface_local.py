"""
Hugging Face Hub '텍스트만' 수집 스크립트 (requests만 사용)
- 모델 메타데이터(우측 정보), Model Card(README)
- Files 트리 정보(파일명/크기/경로/타입)
- Community(Discussions) 목록(제목/작성자/상태) + 총 개수
- 절대 대용량 모델 가중치 파일은 다운로드하지 않음 (메타 정보만 수집)

공개 API 엔드포인트 (문서 비공식/변경 가능성 있음):
- GET  /api/models/{repo_id}
- GET  /api/models/{repo_id}/tree/{revision}?cursor=...&limit=1000
- GET  /api/models/{repo_id}/discussions?limit=100&cursor=...
- GET  /{repo_id}/resolve/{revision}/README.md  (README 원문)
- (대안) GET /api/models/{repo_id}/readme?revision=...

비공개 접근 시 환경변수 HF_TOKEN (hf_...) 로 토큰 전달 필요
"""

import argparse
import asyncio
from dataclasses import dataclass
import datetime as dt
from itertools import islice
import json
import logging
from logging.handlers import TimedRotatingFileHandler
import os
import random
import re
import sys
import time
from typing import Any, Optional, Union
from urllib.parse import urlparse

import aiohttp
from bs4 import BeautifulSoup
from huggingface_hub import HfApi
import pandas as pd
import pickle
import pyarrow
import requests
from tqdm import tqdm



# =====================
# Shared constants
# =====================

ENCODING_TYPE = 'utf-8-sig'
BASE = "https://huggingface.co"
HF_READ_TOKEN = "YOUR_READ_TOKEN"
HF_WRITE_TOKEN = "YOUR_WRITE_TOKEN"


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


def get_model_meta(session: requests.Session, repo_id: str) -> dict[str, Any]:
    # Model Card
    url = f"{BASE}/api/models/{repo_id}"
    response = session.get(url, timeout=30)
    response.raise_for_status()
    return response.json()


def get_readme_markdown(session: requests.Session, repo_id: str, revision: str = "main") -> str:
    # Files > README.md
    url = f"{BASE}/{repo_id}/resolve/{revision}/README.md"
    response = session.get(url, timeout=30)
    if response.status_code == 200 and response.text:
        return response.text
    
    # if fail
    url = f"{BASE}/api/models/{repo_id}/readme?revision={revision}"
    response = session.get(url, timeout=30)
    if response.status_code == 200:
        try:
            json_ = response.json()
            for key in ("text", "content", "raw", "markdown"):
                if key in json_ and isinstance(json_[key], str):
                    return json_[key]
        except Exception:
            pass
    
    return ""


def get_files_tree(
    session: requests.Session,
    repo_id: str,
    revision: str = "main",
    limit: int = 1000
) -> list[dict[str, Any]]:
    """
    커서 기반 페이지네이션으로 전체 파일 트리 수집하는 함수
    각 item 예시
    {
        "type": "blob"|"directory"|"lfs",
        "oid": "...",
        "size": 12345,
        "path": "config.json",
        "lfs": {...}  # 있을 수 있음
    }
    """
    files_tree = []
    cursor = None
    while True:
        # Files: endpoint 설정하기
        url = f"{BASE}/api/models/{repo_id}/tree/{revision}?limit={limit}"
        if cursor:
            url += f"&cursor={cursor}"
        
        # 응답 코드 확인하기 및 데이터 가져오기
        response = session.get(url, timeout=30)
        response.raise_for_status()
        json_ = response.json()
        items = json_.get("tree", []) if isinstance(json_, dict) else json_
        files_tree.extend(items)
        
        # 다음 페이지네이션 탐색
        cursor = (
            (json_.get("cursor") or json_.get("nextCursor"))
            if isinstance(json_, dict) else None
        )
        # 없다면 종료
        if not cursor or not items:
            break
        time.sleep(0.2)

    return files_tree


def get_community(session: requests.Session, repo_id: str, limit: int = 100) -> list[dict[str, Any]]:
    """
    커서 기반 페이지네이션으로 Community(Discussions) 목록을 모두 긁어오는 함수
    가져오는 정보로는 제목, 작성자, 상태, 댓글 수 등
    """
    all_discussions = []
    cursor = None
    while True:
        # Community: endpoint 설정하기
        url = f"{BASE}/api/models/{repo_id}/discussions?limit={limit}"
        if cursor:
            url += f"&cursor={cursor}"
        
        # 응답 코드 확인하기
        response = session.get(url, timeout=30)
        if response.status_code == 404:
            # discussions 기능이 비활성/없는 경우
            break
        
        # 데이터 가져오기
        response.raise_for_status()
        json_ = response.json()
        items = json_.get("discussions") if isinstance(json_, dict) else json_
        all_discussions.extend(items)
        
        # 다음 페이지네이션 탐색
        cursor = (
            json_.get("cursor") or json_.get("nextCursor")
            if isinstance(json_, dict) else json_
        )
        # 없다면 종료
        if not cursor or not items:
            break
        time.sleep(0.2)
    
    return all_discussions


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
    
    # # fallback
    # url = f"{BASE}/api/models/{repo_id}/readme?revision={revision}"
    # data = await _fetch_json(session, url, cfg)
    # if isinstance(data, dict):
    #     for key in ("text", "content", "raw", "markdown"):
    #         val = data.get(key)
    #         if isinstance(val, str):
    #             return val
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
            "model_id", "type", "oid", "size", "path",
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
            "model_id", "num", "title", "status", "created_at", "is_pull_request",
            "num_comments","top_reactions", "num_reaction_users", "pinned",
            "author_id", "author_avatar_url", "author_fullname", "author_name",
            "author_type", "author_ispro", "author_ishf", "author_ishf_admin",
            "author_ismod", "repo_name", "repo_type", "repo_owner_name",
            "repo_owner_isparticipating", "repo_owner_type",
            "repo_owner_isdiscussion_author", "author_follower_count"
        ]
    
    # -----------------
    # SYNC: parallel via threads
    # -----------------
    def reset_csv(self, sort: str = "createdAt", limit: Optional[int] = None) -> None:
        self.logger.info(f"허깅페이스 모델 CSV 초기화 시작")
        
        metadatas, files, communities = [], [], []
        for model in tqdm(self.api.list_models(sort=sort, limit=limit)):
            # hf_metadata csv
            base_data = {attr: getattr(model, attr) for attr in self.api_schema}
            repo_id = getattr(model, "id")
            meta_data = get_model_meta(self.session, repo_id)
            meta_data = {attr: meta_data.get(attr, None) for attr in self.req_schema}
            readme = {"readme": get_readme_markdown(self.session, repo_id)}
            merged = base_data | meta_data | readme
            metadatas.append({k: make_hashable(v) for k, v in merged.items()})
            
            # hf_files csv
            file_tree: dict = get_files_tree(self.session, repo_id)
            for ft in file_tree:
                files.append({"model_id": repo_id} | ft)            
            
            # hf_community csv
            community = get_community(self.session, repo_id)
            for c in community:
                communities.append({"model_id": repo_id} | c)
        
        self.logger.info(f"허깅페이스 모델 전체 탐색 완료")
        
        # save dataframe: metadata
        meta_df = pd.DataFrame(metadatas).rename(columns=self.rename)[self.reorder]
        meta_df.to_csv('hf_metadata.csv', encoding=ENCODING_TYPE, index=False)
        self.logger.info(f"hf_metadata.csv 생성 완료")
        
        # save dataframe: files
        file_df = pd.json_normalize(files, sep="_").reindex(columns=self.cols)
        file_df.to_csv('hf_files.csv', encoding=ENCODING_TYPE, index=False)
        self.logger.info(f"hf_files.csv 생성 완료")
        
        # save dataframe: community
        community_df = pd.json_normalize(communities, sep="_")
        community_df.to_csv('hf_community.csv', encoding=ENCODING_TYPE, index=False)        
        self.logger.info(f"hf_community.csv 생성 완료")
        return

    def update_csv(self, sort: str = "createdAt", limit: Optional[int] = None) -> None:
        self.logger.info(f"허깅페이스 모델 CSV 최신화 시작")
        
        # 최신화 기준으로 삼을 모델 선정(created_at이 가장 마지막)
        last_model_id = pd.read_csv('hf_metadata.csv', encoding=ENCODING_TYPE).sort_values(
            by=['created_at'], ascending=[False]
        ).head(1)['id'].values[0]
        self.logger.info(f"비교 모델 선정 완료")
        
        metadatas, files, communities = [], [], []
        count = 0
        for model in tqdm(self.api.list_models(sort=sort, limit=limit)):
            # 종료 조건) 최신화 기준 모델을 찾음
            if model.id == last_model_id:
                break
            
            # hf_metadata csv
            base_data = {attr: getattr(model, attr) for attr in self.api_schema}
            repo_id = getattr(model, "id")
            meta_data = get_model_meta(self.session, repo_id)
            meta_data = {attr: meta_data.get(attr, None) for attr in self.req_schema}
            readme = {"readme": get_readme_markdown(self.session, repo_id)}
            merged = base_data | meta_data | readme
            metadatas.append({k: make_hashable(v) for k, v in merged.items()})
            
            # hf_files csv
            file_tree: dict = get_files_tree(self.session, repo_id)
            for ft in file_tree:
                files.append({"model_id": repo_id} | ft)            
            
            # hf_community csv
            community = get_community(self.session, repo_id)
            for c in community:
                communities.append({"model_id": repo_id} | c)
            count += 1
        
        self.logger.info(f"새로운 모델 탐색 완료")
        
        # save dataframe: metadata
        meta_df = pd.DataFrame(metadatas).rename(columns=self.rename)[self.reorder]
        legacy_meta_df = pd.read_csv("hf_metadata.csv", encoding=ENCODING_TYPE)
        (
            pd
            .concat([meta_df, legacy_meta_df], ignore_index=True)
            .drop_duplicates(['id'])
            .reset_index(drop=True)
            .to_csv('hf_metadata.csv', encoding=ENCODING_TYPE, index=False)
        )
        
        # save dataframe: files
        file_df = pd.json_normalize(files, sep="_").reindex(columns=self.cols)
        legacy_file_df = pd.read_csv("hf_files.csv", encoding=ENCODING_TYPE)
        (
            pd
            .concat([file_df, legacy_file_df], ignore_index=True)
            .drop_duplicates(['model_id'])
            .reset_index(drop=True)
            .to_csv('hf_files.csv', encoding=ENCODING_TYPE, index=False)
        )
        
        # save dataframe: community
        community_df = pd.json_normalize(communities, sep="_")
        legacy_community_df = pd.read_csv("hf_community.csv", encoding=ENCODING_TYPE)
        (
            pd
            .concat([community_df, legacy_community_df], ignore_index=True)
            .drop_duplicates(['model_id'])
            .reset_index(drop=True)
            .to_csv('hf_community.csv', encoding=ENCODING_TYPE, index=False)
        )
    
        # logging
        if len(count) >= 1_000_000:
            self.logger.warning(f"""
                                허깅페이스에서 삭제된 모델({last_model_id})이 있습니다.
                                이에 전체 허깅페이스 데이터를 재수집했습니다.
                                재수집 이후 전체 모델 개수: {format(count, ',')}개""")
        else:
            self.logger.info(f"""
                             {count}건의 모델 업데이트 완료
                             업데이트 이후 전체 모델 개수: {format(count, ',')}개""")

        return
    
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
        batch_size: int = 3_500
    ) -> None:
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
            
            for batch in tqdm(batched(models, batch_size)):
                tasks = {asyncio.create_task(process(m)) for m in batch}
                for coro in tqdm(asyncio.as_completed(tasks), total=len(tasks)):
                    meta, f_list, c_list = await coro
                    metadatas.append({k: make_hashable(v) for k, v in meta.items()})
                    files.extend(f_list)
                    communities.extend(c_list)
        
        # 데이터프레임으로 변환하기
        try:
            meta_df = (
                pd.DataFrame(metadatas)
                .rename(columns=self.rename)
                .reindex(columns=self.reorder)
            )
            file_df = pd.json_normalize(files, sep="_").reindex(columns=self.cols)
            community_df = (
                pd
                .json_normalize(communities, sep="_")
                .rename(columns=self.comu_rename)
                .reindex(columns=self.comu_reindex)
            )
        except Exception as e:
            logging.exception(f"예외 발생: {e}")
            logging.info(f"pickle 형태로 리스트 저장")
            with open("metadatas.pkl", "wb") as f:
                pickle.dump(metadatas, f)
            with open("files.pkl", "wb") as f:
                pickle.dump(files, f)
            with open("communities.pkl", "wb") as f:
                pickle.dump(communities, f)
        
        try:
            self._write_csvs(meta_df, "hf_metadata.csv")
            self._write_csvs(file_df, "hf_files.csv")
            self._write_csvs(community_df, "hf_community.csv")    
            self.logger.info(f"RESET_CSV(ASYNC) 완료")
        except Exception as e:
            logging.exception(f"예외 발생: {e}")
            logging.info(f"parquet 형태로 데이터프레임 저장")
            meta_df.to_parquet("meta_df.parquet", engine="pyarrow", index=False)
            file_df.to_parquet("file_df.parquet", engine="pyarrow", index=False)
            community_df.to_parquet("community_df.parquet", engine="pyarrow", index=False)
        
        return
        
    
    def _write_csvs(self, df: pd.DataFrame, file_nm: str) -> None:    
        # meta_df = pd.DataFrame(metadatas).rename(columns=self.rename)[self.reorder]
        # file_df = pd.json_normalize(files, sep="_").reindex(columns=self.cols)
        # community_df = pd.json_normalize(communities, sep="_")
        df.to_csv(
            file_nm,
            encoding=ENCODING_TYPE,
            index=False,
            escapechar='\\'
        )
        self.logger.info(f"{file_nm} 생성 완료")
        return


# =====================
# main call start
# =====================

if __name__ == "__main__":
    # session = build_session()
    # test_repo = "microsoft/VibeVoice-1.5B"
    # ret = get_community(session, test_repo, limit=1)
    # print(ret)
    
    setup_logging()
    
    hf = HuggingFace()
    asyncio.run(
        hf.reset_csv_async(
            sort="createdAt",
            limit=None,
            concurrency=256,
            include_readme=True,
            include_files=False,
            include_community=False,
            batch_size=4_096
        )
    )