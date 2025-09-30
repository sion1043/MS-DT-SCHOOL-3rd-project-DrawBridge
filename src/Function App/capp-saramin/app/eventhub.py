import json
from datetime import datetime, timezone, timedelta

# 안전 마진(헤더/메타데이터/엔코딩 오버헤드 고려)
MAX_EVENT_BYTES = 524288   # 1MB = 1024 * 1024 =1,048,576
SAFETY_RATIO = 0.9             # 90% 권장 (ASA 입력 한도 2MB를 고려해 넉넉히 잡고 싶으면 0.85~0.9 권장)
EVENT_BUDGET = int(MAX_EVENT_BYTES * SAFETY_RATIO)

KST = timezone(timedelta(hours=9))

def _byte_len(obj) -> int:
    return len(json.dumps(obj, ensure_ascii=False, separators=(',', ':')).encode('utf-8'))

def _empty_payload_single_source(source: str):
    return {
        "source": source,                       # ★ 단일 테이블 소스
        "total_items_count": 0,
        "each_items_count": {                   # 의미상 유지하되, 해당 소스만 증가
            "posting_rows": 0, "company_rows": 0, "salary_rows": 0
        },
        "items": {                              # ★ 해당 소스만 채움
            "posting_rows": [], "company_rows": [], "salary_rows": []
        },
        "sent_at": None,
        "chunk_index": None,
    }

def _finalize(payload, chunk_index):
    payload["sent_at"] = datetime.now(tz=KST).strftime("%Y-%m-%d %H:%M:%S%z")
    payload["chunk_index"] = chunk_index
    return json.dumps(payload, ensure_ascii=False)

def _chunk_one_table(rows, table_key: str, source_label: str) -> list[str]:
    """
    단일 테이블(rows)을 EVENT_BUDGET 이하로 여러 이벤트로 분할하여
    JSON 문자열 리스트로 반환합니다. 각 이벤트는 source=source_label 로 표기됩니다.
    """
    messages: list[str] = []
    payload = _empty_payload_single_source(source_label)
    chunk_index = 0
    _ = _byte_len(payload)  # 초기 크기 계산(로깅/디버깅 용도면 활용)

    for item in rows:
        # 아이템 넣어보고 크기 측정
        payload["items"][table_key].append(item)
        payload["each_items_count"][table_key] += 1
        payload["total_items_count"] += 1

        new_size = _byte_len(payload)
        if new_size <= EVENT_BUDGET:
            continue  # 그대로 유지
        else:
            # 되돌리기
            payload["items"][table_key].pop()
            payload["each_items_count"][table_key] -= 1
            payload["total_items_count"] -= 1

            # 비어있다면 단일 아이템이 너무 큼
            if payload["total_items_count"] == 0:
                raise ValueError(
                    f"Single item too large to fit under {EVENT_BUDGET} bytes: table={table_key}"
                )

            # 지금까지 청크 확정
            messages.append(_finalize(payload, chunk_index))
            chunk_index += 1

            # 새 청크 시작 후 방금 아이템을 다시 시도
            payload = _empty_payload_single_source(source_label)
            payload["items"][table_key].append(item)
            payload["each_items_count"][table_key] += 1
            payload["total_items_count"] += 1

            # 새 청크에도 못 들어가면 아이템 자체가 과대
            if _byte_len(payload) > EVENT_BUDGET:
                raise ValueError(
                    f"Single item too large to fit under {EVENT_BUDGET} bytes even in a fresh payload: table={table_key}"
                )

    # 남은 것 확정
    if payload["total_items_count"] > 0:
        messages.append(_finalize(payload, chunk_index))

    return messages

def send_result_split_under_1mb(outputEvent, posting_rows, company_rows, salary_rows):
    # ★ 테이블별로 독립 분할 → 단일 source 이벤트들로 구성
    msgs_posting = _chunk_one_table(posting_rows, "posting_rows", "saramin_posting")
    msgs_company = _chunk_one_table(company_rows, "company_rows", "saramin_company")
    msgs_salary  = _chunk_one_table(salary_rows,  "salary_rows",  "saramin_salary")

    # 한 번에 set: 리스트 합치면 각 요소가 개별 이벤트로 전송됨
    messages = msgs_posting + msgs_company + msgs_salary
    outputEvent.set(messages)
