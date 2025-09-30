# -------------------------------------------------------
# 라이브러리 호출
# -------------------------------------------------------
import time
import logging
from datetime import datetime, timezone, timedelta
from bs4 import BeautifulSoup

# --- Selenium

# --- app
from app import login
from app.saramin_posting import _helpers


# -------------------------------------------------------
# 사용자 제공 상수
# -------------------------------------------------------
TARGET_URL_TEMPLATE = "https://www.saramin.co.kr/zf_user/jobs/relay/view?isMypage=no&rec_idx={posting_id}"


# -------------------------------------------------------
# 사용자 정의 함수 (메인)
# -------------------------------------------------------
def run_crawl_saramin_posting(posting_id_array: list[int]) -> list[dict]:

    driver = login.build_driver()
    rows = []
    try:
        login.login(driver)
        TARGET_URLS = [TARGET_URL_TEMPLATE.format(posting_id=int(pid)) for pid in posting_id_array]
        for url in TARGET_URLS:
            driver.get(url)
            time.sleep(3)
            logging.info(f"posting_id: {url[-8:]} 현재 페이지: {driver.current_url}")

            html = driver.page_source
            soup = BeautifulSoup(html, "html.parser")
            section_soup = soup.select_one(f".jview.jview-0-{url[-8:]}")

            #예외처리: 공고 마감으로 페이지가 삭제되어 None이 들어간 경우
            if not section_soup:
                row = {
                    # --- 식별자/메타
                    "posting_title": None,
                    "company_name": None,
                    "posting_id": url[-8:],
                    "is_closed": None,

                    # --- 노출 지표
                    "posting_bookmarks_total": None,
                    "posting_views_total": None,
                    "homepage_visits_total": None,

                    # --- 요약 정보
                    "experience": None,
                    "education": None,
                    "employment_type": None,
                    "salary": None,
                    "position": None,
                    "working_hours": None,
                    "work_location": None,

                    # --- 접수/지원
                    "start_datetime": None,
                    "end_datetime": None,
                    "application_method": None,
                    "application_format": None,

                    # --- 지원자 통계
                    "applicants_total": None,
                    "applicants_by_exp_new": None,
                    "applicants_by_exp_less_than_1yr": None,
                    "applicants_by_exp_1_3yrs": None,
                    "applicants_by_exp_3_5yrs": None,
                    "applicants_by_exp_over_5yrs": None,

                    "applicants_by_salary_2200_2600": None,
                    "applicants_by_salary_2600_3000": None,
                    "applicants_by_salary_3000_4000": None,
                    "applicants_by_salary_over_4000": None,

                    "applicants_by_gender_total": None,
                    "applicants_by_gender_male": None,
                    "applicants_by_gender_female": None,
                    "applicants_by_gender_ratio_male": None,
                    "applicants_by_gender_ratio_female": None,

                    "applicants_by_age_20s": None,
                    "applicants_by_age_30s": None,
                    "applicants_by_age_40s": None,
                    "applicants_by_age_50s": None,
                    "applicants_by_age_over_60s": None,

                    "applicants_by_education_highschool_or_less": None,
                    "applicants_by_education_associates": None,
                    "applicants_by_education_bachelors": None,
                    "applicants_by_education_masters": None,
                    "applicants_by_education_phd": None,

                    "applicants_submitted_portfolio_json": None,

                    # --- 기타
                    "saramin_posting_collection_time": _helpers.tz_kst_now_str(),
                    "company_url_saramin": None,
                }

                rows.append(row)
                time.sleep(1.0)  # 매너 대기

                continue

            header_meta = _helpers.parse_header_and_meta(section_soup)
            summary = _helpers.parse_summary_block(section_soup)
            howto = _helpers.parse_howto_block(section_soup)
            stats = _helpers.parse_stats_block(section_soup)

            # 일부 누락값 보정
            stats["applicants_total"] = _helpers.parse_applicants_total_fallback(section_soup, stats.get("applicants_total") or header_meta.get("applicants_total"))

            row = {
                # --- 식별자/메타
                "posting_title": header_meta.get("posting_title"),
                "company_name": header_meta.get("company_name"),
                "posting_id": url[-8:],
                "is_closed": howto.get("is_closed"),

                # --- 노출 지표
                "posting_bookmarks_total": header_meta.get("posting_bookmarks_total"),
                "posting_views_total": header_meta.get("posting_views_total"),
                "homepage_visits_total": header_meta.get("homepage_visits_total"),

                # --- 요약 정보
                "experience": summary.get("experience"),
                "education": summary.get("education"),
                "employment_type": summary.get("employment_type"),
                "salary": summary.get("salary"),
                "position": summary.get("position"),
                "working_hours": summary.get("working_hours"),
                "work_location": summary.get("work_location"),

                # --- 접수/지원
                "start_datetime": howto.get("start_datetime"),
                "end_datetime": howto.get("end_datetime"),
                "application_method": howto.get("application_method"),
                "application_format": howto.get("application_format"),

                # --- 지원자 통계
                "applicants_total": stats.get("applicants_total"),
                "applicants_by_exp_new": stats.get("applicants_by_exp_new"),
                "applicants_by_exp_less_than_1yr": stats.get("applicants_by_exp_less_than_1yr"),
                "applicants_by_exp_1_3yrs": stats.get("applicants_by_exp_1_3yrs"),
                "applicants_by_exp_3_5yrs": stats.get("applicants_by_exp_3_5yrs"),
                "applicants_by_exp_over_5yrs": stats.get("applicants_by_exp_over_5yrs"),

                "applicants_by_salary_2200_2600": stats.get("applicants_by_salary_2200_2600"),
                "applicants_by_salary_2600_3000": stats.get("applicants_by_salary_2600_3000"),
                "applicants_by_salary_3000_4000": stats.get("applicants_by_salary_3000_4000"),
                "applicants_by_salary_over_4000": stats.get("applicants_by_salary_over_4000"),

                "applicants_by_gender_total": stats.get("applicants_by_gender_total"),
                "applicants_by_gender_male": stats.get("applicants_by_gender_male"),
                "applicants_by_gender_female": stats.get("applicants_by_gender_female"),
                "applicants_by_gender_ratio_male": stats.get("applicants_by_gender_ratio_male"),
                "applicants_by_gender_ratio_female": stats.get("applicants_by_gender_ratio_female"),

                "applicants_by_age_20s": stats.get("applicants_by_age_20s"),
                "applicants_by_age_30s": stats.get("applicants_by_age_30s"),
                "applicants_by_age_40s": stats.get("applicants_by_age_40s"),
                "applicants_by_age_50s": stats.get("applicants_by_age_50s"),
                "applicants_by_age_over_60s": stats.get("applicants_by_age_over_60s"),

                "applicants_by_education_highschool_or_less": stats.get("applicants_by_education_highschool_or_less"),
                "applicants_by_education_associates": stats.get("applicants_by_education_associates"),
                "applicants_by_education_bachelors": stats.get("applicants_by_education_bachelors"),
                "applicants_by_education_masters": stats.get("applicants_by_education_masters"),
                "applicants_by_education_phd": stats.get("applicants_by_education_phd"),

                "applicants_submitted_portfolio_json": stats.get("applicants_submitted_portfolio_json"),

                # --- 기타
                "saramin_posting_collection_time": _helpers.tz_kst_now_str(),
                "company_url_saramin": header_meta.get("company_url_saramin"),
            }

            rows.append(row)
            time.sleep(1.0)  # 매너 대기

    finally:
        driver.quit()
        logging.info(f"posting_id_array 수집 종료")
        
    return rows
