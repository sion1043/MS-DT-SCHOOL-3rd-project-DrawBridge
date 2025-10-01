# function_app.py
import os
import json
import logging
import requests
from datetime import datetime, timezone, timedelta

import pandas as pd

import azure.functions as func


# --- Selenium / 파싱
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

# --- app
from app.saramin_posting import postingcrawler
from app.saramin_company import companycrawler
from app import webhook
from app import eventhub

# --- DB
from app.postgres import _get_conn
from psycopg2.extras import RealDictCursor

TARGET_URL_TEMPLATE = "https://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx={posting_id}"

app = func.FunctionApp()


# ========= Timer Trigger + Event Hub Output =========

@app.function_name(name="SaraminCrawlerTimer")
@app.schedule(
    schedule="0 30 12 * *",  # utc 시간 기준으로 오전 12시 30분, 한국 시간 기준으로 매일 오전 10시 30분에 (CRON: 초 분 시 ...)
    arg_name="mytimer",
    run_on_startup=False,
    use_monitor=True
)
@app.event_hub_output(
    arg_name="outputEvent",
    event_hub_name=os.environ["jumpit-eventhub-name"],
    connection="jumpit-eventhub-connection",
)
def saramin_crawler_timer(mytimer: func.TimerRequest, outputEvent: func.Out[str]) -> None:
    """
    매 시 정각 실행 -> 크롤링 -> Event Hub로 전송
    """
    logging.info("SaraminCrawlerTimer triggered at %s", datetime.utcnow().isoformat())

    try:
        #1. posting_id_array 불러오기
        try:
            # 1) 날짜 파라미터 (기본: 오늘 kst)
            kst = timezone(timedelta(hours=9))
            date_str = datetime.now(kst).strftime("%Y-%m-%d")  # 예: 2025-09-16
            #date_str = "2025-09-16"
            # 2) DB 조회
            with _get_conn() as conn, conn.cursor(cursor_factory=RealDictCursor) as cur:
                # 안전: 파라미터 바인딩 사용, DATE로 비교
                cur.execute("""
                    SELECT posting_id
                    FROM bronze.brz_jumpit_posting_id
                    WHERE posting_id_collection_time::date = %s::date
                """, (date_str,))
                rows = cur.fetchall()
    
            posting_id_array = [str(int(r["posting_id"])) for r in rows if r.get("posting_id") is not None]
            #posting_id_array = [51743731]
            logging.info(posting_id_array)

        except Exception as e:
            logging.exception("DB fetch failed")
       
        #2. 크롤링 (사람인 채용공고 상세페이지)
        posting_rows = postingcrawler.run_crawl_saramin_posting(posting_id_array)
        logging.info(f"rows: {posting_rows}")

        #3. company_url_saramin_array 저장
        df_saramin_posting = pd.DataFrame(posting_rows)
        company_url_saramin_array = df_saramin_posting["company_url_saramin"].unique()

    except Exception as e:
        logging.exception("Saramin crawl failed: %s", e)


    try:
        #1. 크롤링  (사람인 기업정보&연봉정보 상세페이지)
        company_rows, salary_rows = companycrawler.run_crawl_saramin_company_and_salary(company_url_saramin_array)
        logging.info(f"company_rows: {company_rows}")
        logging.info(f"salary_rows: {salary_rows}")
        kst = timezone(timedelta(hours=9))

    except Exception as e:
        logging.exception("Saramin crawl failed: %s", e)

    # KST = timezone(timedelta(hours=9))
    # posting_rows = [
    #     {
    #         "posting_title": f"웹·앱 개발자 모집 ({i})",
    #         "company_name": f"(주)트러스트{i}",
    #         "posting_id": str(51743731 + i),
    #         "is_closed": False,
    #         "posting_bookmarks_total": 50 + i,
    #         "posting_views_total": 1200 + i * 10,
    #         "homepage_visits_total": None,
    #         "experience": "신입" if i % 2 == 0 else "경력",
    #         "education": "고교졸업 이상",
    #         "employment_type": "정규직",
    #         "salary": "회사내규에 따름",
    #         "position": None,
    #         "working_hours": None,
    #         "work_location": f"경기 성남시 분당구 {i}동",
    #         "start_datetime": (datetime(2025, 9, 4) + timedelta(days=i)).strftime("%Y.%m.%d 00:00"),
    #         "end_datetime": (datetime(2025, 10, 3) + timedelta(days=i)).strftime("%Y.%m.%d 23:59"),
    #         "application_method": "사람인 입사지원",
    #         "application_format": "제출서류 이력서, 자기소개서",
    #         "applicants_total": 200 + i * 5,
    #         "applicants_by_exp_new": 100 + i,
    #         "applicants_by_exp_less_than_1yr": 10 + i,
    #         "applicants_by_exp_1_3yrs": 20,
    #         "applicants_by_exp_3_5yrs": 15,
    #         "applicants_by_exp_over_5yrs": 10,
    #         "applicants_by_salary_2200_2600": 1,
    #         "applicants_by_salary_2600_3000": 6,
    #         "applicants_by_salary_3000_4000": 20,
    #         "applicants_by_salary_over_4000": 3,
    #         "applicants_by_gender_total": 200 + i * 5,
    #         "applicants_by_gender_male": 80,
    #         "applicants_by_gender_female": 20,
    #         "applicants_by_gender_ratio_male": 80,
    #         "applicants_by_gender_ratio_female": 20,
    #         "applicants_by_age_20s": 150,
    #         "applicants_by_age_30s": 50,
    #         "applicants_by_age_40s": 1,
    #         "applicants_by_age_50s": 1,
    #         "applicants_by_age_over_60s": 0,
    #         "applicants_by_education_highschool_or_less": 30,
    #         "applicants_by_education_associates": 20,
    #         "applicants_by_education_bachelors": 140,
    #         "applicants_by_education_masters": 2,
    #         "applicants_by_education_phd": 0,
    #         "applicants_submitted_portfolio_json": '{"이력서": 40, "미첨부": 30, "기타": 20, "경력기술서": 10, "자격증": 5, "동영상": 2, "증명서": 2, "기획서": 1, "포트폴리오": 150}',
    #         "saramin_posting_collection_time": datetime.now(tz=KST).strftime("%Y-%m-%d %H:%M:%S%z"),
    #         "company_url_saramin": "https://www.saramin.co.kr/zf_user/company-info/view?csn=..."
    #     }
    #     for i in range(620)
    # ]

    # # company_rows 더미 데이터 (5개)
    # company_rows = [
    #     {'company_name': f'(주)트러스트{i}', 'company_bookmarks_total': '130', 'company_views_monthly': 390, 'company_view_increase_rate_monthly': 8, 'company_bookmarks_monthly': 9, 'company_bookmark_increase_rate_monthly': None, 'company_keyword_search_count_monthly': 128, 'company_keyword_search_increase_rate_monthly': 3, 'company_keywords_saramin': ['역세권 기업', '일상이 된 재택근무', '편의시설이 아닌 인권', '자유 복장 기업 모음', '정시 퇴근 보장!', '연구가 좋아요~', '수면실 보유 기업모음', '만만치 않은 교통비', '야근 눈치 보지마요', '간식제공 복지 기업!', '배부른 퇴근길', '나의 커리어 첫 시작', '주차 고민은 끝!', '월급+보너스=행복2배', '휴식시간 필요해요', '경조사 챙겨주는 기업'], 'founded_date': '2020년 11월 13일', 'company_type': '중소기업, 주식회사, 연구소', 'revenue': '2억 703만원', 'industry': '응용 소프트웨어 개발 및 공급업', 'ceo_name': '박영훈', 'homepage_url': 'https://payparan.com/', 'business_description': '소프트웨어개발', 'address': '경기 성남시 분당구 성남대로43번길 10, 406호 (구미동,하나이지타워)\n지도보기', 'company_benefits_json': {'지원금/보험': ['각종 경조사 지원', '업무활동비 지급'], '급여제도': ['퇴직연금', '인센티브제', '상여금', '장기근속자 포상', '우수사원포상', '퇴직금', '성과급', '직책수당', '4대 보험'], '선물': ['장기근속 선물'], '교육/생활': ['저녁식사 제공', '간식 제공'], '근무 환경': ['휴게실', '수면실', '회의실', '공기청정기', '장애인 화장실', '장애인 전용주차장', '문턱 없음', '사원증', '사무용품 지급', '최고 성능 컴퓨터', '안마실/안마의자', '스탠딩 책상'], '조직문화': ['회식강요 안함', '야근강요 안함', '자유복장', '자유로운 연차사용', '칼퇴근 보장'], '출퇴근': ['야간교통비지급', '주차장제공', '주차비지원', '탄력근무제', '출퇴근 교통비 지원', '재택근무'], '리프레시': ['연차', '반차', '근로자의 날 휴무']}, 'employees_total': 5, 'employees_timeseries_json': {'total': [4, 4, 4, 4, 6, 5, 6, 6, 6, 6, 6, 5, 5, 5, 5, 6, 6, 5, 5, 5, 5, 5, 5, 5], 'hired': [0, 0, 1, 0, 2, 0, 1, 0, 1, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], 'left': [0, 1, 0, 0, 1, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], 'date': ['2023.8', '2023.9', '2023.10', '2023.11', '2023.12', '2024.1', '2024.2', '2024.3', '2024.4', '2024.5', '2024.6', '2024.7', '2024.8', '2024.9', '2024.10', '2024.11', '2024.12', '2025.1', '2025.2', '2025.3', '2025.4', '2025.5', '2025.6', '2025.7'], 'personChange': [0, 0, 0, 0, 2, -1, 1, 0, 0, 0, 0, -1, 0, 0, 0, 1, 0, -1, 0, 0, 0, 0, 0, 0]}, 'company_url_saramin': 'https://www.saramin.co.kr/zf_user/company-info/view?csn=Y2F2ZEZta0cyV3JqUU9teGFRRm5PZz09&popup_yn=y', 
    #      'saramin_company_collection_time': datetime.now(tz=KST).strftime("%Y-%m-%d %H:%M:%S%z")}
    #     for i in range(113)
    # ]

    # # salary_rows 더미 데이터 (5개)
    # salary_rows = [
    #     {'company_name': f'(주)트러스트{i}', 'salary_avg': 3262, 'salary_min': 2455, 'salary_max': 5399, 'salary_yoy_change': -3.35, 'salary_info_reliability': '매우\n낮음', 'salary_2022_avg': 4231, 'salary_2022_min': 2793, 'salary_2022_max': 6089, 'salary_2023_avg': 3375, 'salary_2023_min': 2482, 'salary_2023_max': 5586, 'salary_2024_avg': 3262, 'salary_2024_min': 2455, 'salary_2024_max': 5399, 'salary_2022_avg_industry': 4893, 'salary_2023_avg_industry': 5140, 'salary_2024_avg_industry': 5292, 'starting_salary_bachelors_avg': 2913, 'starting_salary_bachelors_yoy_change': '-1.02', 'starting_salary_bachelors_2022_avg': 3244, 'starting_salary_bachelors_2023_avg': 2943, 'starting_salary_bachelors_2024_avg': 2913, 'starting_salary_bachelors_estimated_monthly_takehome': 2132670, 'salary_staff_high_school_avg': 2699, 'salary_staff_high_school_min': 2547, 'salary_staff_high_school_max': 2851, 'salary_staff_associates_avg': 2855, 'salary_staff_associates_min': 2719, 'salary_staff_associates_max': 2991, 'salary_staff_bachelors_avg': 3013, 'salary_staff_bachelors_min': 2837, 'salary_staff_bachelors_max': 3189, 'salary_junior_mgr_avg': 3369, 'salary_junior_mgr_min': 3175, 'salary_junior_mgr_max': 3563, 'salary_deputy_mgr_avg': 3911, 'salary_deputy_mgr_min': 3569, 'salary_deputy_mgr_max': 4253, 'salary_section_chief_avg': 4536, 'salary_section_chief_min': 4260, 'salary_section_chief_max': 4812, 'salary_deputy_section_chief_avg': 5200, 'salary_deputy_section_chief_min': 4850, 'salary_deputy_section_chief_max': 5550, 'salary_department_head_avg': 5937, 'salary_department_head_min': 5560, 'salary_department_head_max': 6315, 'salary_by_age_2022_json': {'20': 2865, '21': 2865, '': 4040, '32': 4201, '33': 4364, '34': 4515, '35': 4669, '36': 4822, '37': 4994, '38': 5168, '39': 5341, '40': 5512, '41': 5682, '42': 5844, '43': 5984, '44': 6140, '45': 6341, '46': 6539, '47': 6717, '48': 6856, '49': 6995, '50': 7163}, 'salary_by_age_2023_json': {'20': 2656, '21': 2656, '22': 2656, '23': 2763, '24': 2859, '25': 2933, '26': 3050, '27': 3112, '28': 3232, '29': 3350, '30': 3472, '31': 3604, '32': 3748, '33': 3893, '34': 4039, '35': 4171, '36': 4307, '37': 4436, '38': 4580, '39': 4729, '40': 4884, '41': 5038, '42': 5188, '43': 5326, '44': 5447, '45': 5585, '46': 5764, '47': 5938, '48': 6104, '49': 6247, '50': 6408}, 'salary_by_age_2024_json': {'20': 2573, '21': 2573, '22': 2728, '23': 2786, '24': 2837, '25': 2927, '26': 2999, '27': 3120, '28': 3184, '29': 3307, '30': 3430, '31': 3556, '32': 3692, '33': 3840, '34': 3986, '35': 4132, '36': 4263, '37': 4398, '38': 4527, '39': 4672, '40': 4823, '41': 4980, '42': 5137, '43': 5289, '44': 5428, '45': 5547, '46': 5684, '47': 5861, '48': 6031, '49': 6188, '50': 6315}, 'company_salary_url_saramin': 'https://www.saramin.co.kr/zf_user/company-info/view-inner-salary?csn=Y2F2ZEZta0cyV3JqUU9teGFRRm5PZz09', 
    #      'saramin_company_salary_collection_time': datetime.now(tz=KST).strftime("%Y-%m-%d %H:%M:%S%z")}
    #     for i in range(88)
    # ]

    try:  
        #이벤트 허브 전송
        eventhub.send_result_split_under_1mb(outputEvent, posting_rows, company_rows, salary_rows)

        logging.info("saramin_posting Crawl finished. %d items sent to Event Hub.", len(posting_rows))
        logging.info("saramin_company Crawl finished. %d items sent to Event Hub.", len(company_rows))
        logging.info("saramin_salary Crawl finished. %d items sent to Event Hub.", len(salary_rows))

    except Exception as e:
        logging.exception("Sending to Event Hub failed: %s", e)


    #4. 웹훅요청 (Teams)
    # 웹훅 URL
    webhook_url = os.getenv("TEAMS_WEBHOOK_URL")

    # 적응형 카드에 보낼 변수들
    timestamp_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  

            
    total_rows_count = {
        "posting_rows": len(posting_rows),
        "company_rows": len(company_rows),
        "salary_rows": len(salary_rows)
        }

    ex_posting_json = webhook.make_example_posting_json(posting_rows)
    ex_company_json = webhook.make_example_company_json(company_rows)
    ex_salary_json  = webhook.make_example_salary_json(salary_rows)


    adaptive_card = {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.4",
        "msTeams": {"width": "full"},
        "body": [
            {"type": "TextBlock", "text": "✅ Saramin 크롤링 완료", "size": "Large", "weight": "Bolder"},
            {"type": "TextBlock", "text": "Saramin 크롤링 결과 요약", "isSubtle": True, "wrap": True},
            {"type": "TextBlock", "text": f"실행 시각: {timestamp_now}", "wrap": True},

            {"type": "TextBlock", "text": "📊 수집 요약", "weight": "Bolder", "spacing": "Medium"},
            {"type": "ColumnSet", "columns": [
                {"type": "Column","width":"stretch","items":[
                    {"type":"TextBlock","text":"Posting","weight":"Bolder"},
                    {"type":"TextBlock","text":str(total_rows_count["posting_rows"]),"size":"ExtraLarge","weight":"Bolder"}]},
                {"type": "Column","width":"stretch","items":[
                    {"type":"TextBlock","text":"Company","weight":"Bolder"},
                    {"type":"TextBlock","text":str(total_rows_count["company_rows"]),"size":"ExtraLarge","weight":"Bolder"}]},
                {"type": "Column","width":"stretch","items":[
                    {"type":"TextBlock","text":"Salary","weight":"Bolder"},
                    {"type":"TextBlock","text":str(total_rows_count["salary_rows"]),"size":"ExtraLarge","weight":"Bolder"}]}
            ]},

            {"type":"TextBlock","text":"🧩 예시 항목 (각 1건)","weight":"Bolder","spacing":"Medium"},
            {"type":"TextBlock","text":"Posting","weight":"Bolder"},
            {"type":"TextBlock","text":ex_posting_json,"wrap":True,"fontType":"Monospace","size":"Small","isSubtle":True},
            {"type":"TextBlock","text":"Company","weight":"Bolder","spacing":"Small"},
            {"type":"TextBlock","text":ex_company_json,"wrap":True,"fontType":"Monospace","size":"Small","isSubtle":True},
            {"type":"TextBlock","text":"Salary","weight":"Bolder","spacing":"Small"},
            {"type":"TextBlock","text":ex_salary_json,"wrap":True,"fontType":"Monospace","size":"Small","isSubtle":True}
        ],
        "actions": []
    }

    # Flow 웹훅으로 보낼 최종 payload (attachments 배열 포함)
    card = {
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": adaptive_card
            }
        ]
    }
    webhook.post_to_webhook(webhook_url, card)