import time
import logging
import requests

logger = logging.getLogger("webhook")

def post_to_webhook(webhook_url: str, payload: dict, timeout: float = 10, retries: int = 3) -> requests.Response:
    """웹훅 URL로 JSON payload를 POST. 간단한 재시도 포함."""
    last_err = None
    for attempt in range(1, retries + 1):
        try:
            resp = requests.post(webhook_url, json=payload, timeout=timeout)  # 자동으로 application/json 설정
            resp.raise_for_status()
            logging.info("Webhook POST OK (status=%s)", resp.status_code)
            return resp
        except Exception as e:
            last_err = e
            logging.warning("Webhook POST 실패 (attempt %d/%d): %s", attempt, retries, e)
            if attempt < retries:
                time.sleep(2 ** (attempt - 1))  # 1s, 2s, 4s 백오프
    raise last_err

import json

import json
from typing import List, Dict, Any

def _first_dict(rows: List[Dict[str, Any]]) -> Dict[str, Any]:
    return rows[0] if rows and isinstance(rows[0], dict) else {}

def _pick_fields(item: Dict[str, Any], prefer_keys: List[str], max_fields: int = 3) -> Dict[str, Any]:
    picked = []

    # 1) 우선순위 키에서 존재하고 스칼라(리스트/딕트 아님)인 값만 선택
    for k in prefer_keys:
        if k in item and not isinstance(item[k], (list, dict)):
            picked.append(k)
            if len(picked) >= max_fields:
                break

    # 2) 아직 부족하면 나머지 단순 필드로 채우기
    if len(picked) < max_fields:
        for k, v in item.items():
            if k in picked:
                continue
            if isinstance(v, (list, dict)):
                continue
            picked.append(k)
            if len(picked) >= max_fields:
                break

    return {k: item.get(k) for k in picked}

def _to_pretty_json(d: Dict[str, Any]) -> str:
    # 카드에 코드블록으로 넣기 좋게 들여쓰기
    return json.dumps(d, ensure_ascii=False, indent=2)

# --- 타입별 헬퍼 ---

def make_example_posting_json(posting_rows: List[Dict[str, Any]], max_fields: int = 3) -> str:
    """
    추천 필드: 공고제목/회사/마감일 → 부족하면 근무지/경력/형태 등으로 자동 보완
    """
    item = _first_dict(posting_rows)
    prefer = [
        "posting_title", "company_name", "end_datetime",
        "work_location", "experience", "employment_type",
        "salary", "posting_views_total", "applicants_total"
    ]
    return _to_pretty_json(_pick_fields(item, prefer, max_fields))

def make_example_company_json(company_rows: List[Dict[str, Any]], max_fields: int = 3) -> str:
    """
    추천 필드: 회사명/업종/임직원수 → 부족하면 설립일/매출 등으로 자동 보완
    """
    item = _first_dict(company_rows)
    prefer = [
        "company_name", "industry", "employees_total",
        "founded_date", "revenue", "company_type"
    ]
    return _to_pretty_json(_pick_fields(item, prefer, max_fields))

def make_example_salary_json(salary_rows: List[Dict[str, Any]], max_fields: int = 3) -> str:
    """
    추천 필드: 회사명/평균연봉/전년대비 → 부족하면 2024 평균/신입초봉/신뢰도 등으로 자동 보완
    """
    item = _first_dict(salary_rows)
    prefer = [
        "company_name", "salary_avg", "salary_yoy_change",
        "salary_2024_avg", "starting_salary_bachelors_avg", "salary_info_reliability"
    ]
    return _to_pretty_json(_pick_fields(item, prefer, max_fields))

