# -------------------------------------------------------
# 라이브러리 호출
# -------------------------------------------------------
import re
import json
from datetime import datetime, timezone, timedelta
from urllib.parse import urljoin


# -------------------------------------------------------
# 사용자 제공 상수
# -------------------------------------------------------


# -------------------------------------------------------
# 사용자 정의 함수
# -------------------------------------------------------
def tz_kst_now_str():
    kst = timezone(timedelta(hours=9))
    return datetime.now(tz=kst).strftime("%Y-%m-%d %H:%M:%S%z")

def _first_int(text):
    
    if not text:
        return None
    m = re.search(r"-?\d[\d,]*", str(text))
    if not m:
        return None
    return int(m.group(0).replace(",", ""))

def _get_text(el):
    if not el:
        return None
    txt = el.get_text(" ", strip=True)
    return txt if txt else None

def parse_summary_block(soup):
    """상단 요약 블록(경력/학력/근무형태/급여/근무지역 등)"""
    res = {
        "experience": None,
        "education": None,
        "employment_type": None,
        "salary": None,
        "position": None,
        "working_hours": None,
        "work_location": None
    }
    box = soup.select_one(".jv_summary .cont")
    if not box:
        return res
    dls = box.find_all("dl")
    for dl in dls:
        dt = _get_text(dl.find("dt"))
        dd = _get_text(dl.find("dd"))
        if not dt:
            continue
        if "경력" in dt:
            res["experience"] = dd
        elif "학력" in dt:
            res["education"] = dd
        elif "근무형태" in dt:
            res["employment_type"] = dd
        elif "급여" in dt:
            res["salary"] = dd
        elif "직급/직책" in dt:
            res["position"] = dd
        elif "근무요일" in dt:
            res["working_hours"] = dd
        elif "근무지역" in dt:
            res["work_location"] = dd
    return res

def parse_howto_block(soup):
    """접수기간/방법/제출서류"""
    res = {
        "start_datetime": None,
        "end_datetime": None,
        "application_method": None,
        "application_format": None,
        "is_closed": None
    }
    howto = soup.select_one(".jv_howto .cont")
    if not howto:
        return res

    # 기간
    period = howto.select_one(".info_period")
    if period:
        dds = period.find_all("dd")
        if len(dds) >= 1:
            res["start_datetime"] = _get_text(dds[0])
        if len(dds) >= 2:
            res["end_datetime"] = _get_text(dds[1])

    # 마감 여부(휴리스틱): '마감', '채용마감', '내일마감' 등 키워드 또는 D- 표기 부재
    status = howto.select_one(".status")
    is_closed = None
    if status:
        status_text = status.get_text(" ", strip=True)
        if any(k in status_text for k in ["채용마감", "마감", "종료"]):
            is_closed = True
        # D-xx, 남은 기간 등이 보이면 진행중으로 추정
        if "D-" in status_text or "남은 기간" in status_text:
            is_closed = False
    res["is_closed"] = is_closed

    # 지원방법
    method_box = howto.select_one(".guide .method")
    if method_box:
        labels = [_get_text(b) for b in method_box.select("button, a, span") if _get_text(b)]
        labels = [t for t in labels if t]
        res["application_method"] = ", ".join(sorted(set(labels))) if labels else None

    # 제출서류
    template_box = howto.select_one(".guide .template")
    if template_box:
        # 툴팁 내부 텍스트
        tooltip = template_box.select_one(".toolTipCont")
        res["application_format"] = _get_text(tooltip) or _get_text(template_box)
    
    return res

def parse_stats_block(soup):
    """지원자 통계블록(경력/연봉/성별/연령/학력/포트폴리오)"""
    stats = {
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
    }

    root = soup.select_one(".jv_statics .cont")
    if not root:
        return stats

    # 총 지원자수
    # <dl class="total"><dt>지원자수</dt><dd><span>56</span>명</dd></dl>
    total_block = root.select_one(".box_chart .total, .box_chart.narrow .total")
    if total_block:
        stats["applicants_total"] = _first_int(_get_text(total_block))

    # 경력별
    def _extract_bar_counts(section_title_contains, order):
        box = None
        for bx in root.select(".box_chart"):
            tit = _get_text(bx.select_one(".tit_stats"))
            if tit and section_title_contains in tit:
                box = bx
                break
        if not box:
            return [None] * len(order)
        cols = box.select(".chart_line .col")
        # 라벨→값
        label_to_val = {}
        for c in cols:
            lab = _get_text(c.select_one(".legend"))
            val = _first_int(_get_text(c.select_one(".value")))
            if lab:
                label_to_val[lab.replace("\n", "").replace("\r", "")] = val
        return [label_to_val.get(k) for k in order]

    # 경력별 현황
    exp_order = ["신입", "1년 미만", "1~3년", "3~5년", "5년 이상"]
    exp_vals = _extract_bar_counts("경력별", exp_order)
    if exp_vals:
        (stats["applicants_by_exp_new"],
         stats["applicants_by_exp_less_than_1yr"],
         stats["applicants_by_exp_1_3yrs"],
         stats["applicants_by_exp_3_5yrs"],
         stats["applicants_by_exp_over_5yrs"]) = exp_vals

    # 연봉별 현황
    sal_order = ["2,200~2,600", "2,600~3,000", "3,000~4,000", "4,000이상"]
    # 라벨이 줄바꿈 포함해 표기되므로 정규화
    def _normalize_salary_label(s):
        if not s:
            return s
        s = s.replace(" ", "").replace("\n", "")
        s = s.replace("2,200~2,600", "2,200~2,600")
        s = s.replace("2,600~3,000", "2,600~3,000")
        s = s.replace("3,000~4,000", "3,000~4,000")
        s = s.replace("4,000이상", "4,000이상")
        return s

    box = None
    for bx in root.select(".box_chart"):
        tit = _get_text(bx.select_one(".tit_stats"))
        if tit and "연봉별 현황" in tit:
            box = bx
            break
    if box:
        label_to_val = {}
        for c in box.select(".chart_line .col"):
            lab = _get_text(c.select_one(".legend"))
            lab_n = _normalize_salary_label(lab)
            val = _first_int(_get_text(c.select_one(".value")))
            if lab_n:
                label_to_val[lab_n] = val
        stats["applicants_by_salary_2200_2600"] = label_to_val.get("2,200~2,600")
        stats["applicants_by_salary_2600_3000"] = label_to_val.get("2,600~3,000")
        stats["applicants_by_salary_3000_4000"] = label_to_val.get("3,000~4,000")
        stats["applicants_by_salary_over_4000"] = label_to_val.get("4,000이상")

    # 성별
    gender_box = None
    for bx in root.select(".box_chart"):
        tit = _get_text(bx.select_one(".tit_stats"))
        if tit and "성별 현황" in tit:
            gender_box = bx
            break
    if gender_box:
        # 총/남/여
        total = _first_int(_get_text(gender_box.select_one(".legend .total")))
        male = _first_int(_get_text(gender_box.select_one(".legend .male dd:last-child")))
        female = _first_int(_get_text(gender_box.select_one(".legend .female dd:last-child")))
        male_ratio = _first_int(_get_text(gender_box.select_one(".legend .male .perc span")))
        female_ratio = _first_int(_get_text(gender_box.select_one(".legend .female .perc span")))
        stats["applicants_by_gender_total"] = total
        stats["applicants_by_gender_male"] = male
        stats["applicants_by_gender_female"] = female
        stats["applicants_by_gender_ratio_male"] = male_ratio
        stats["applicants_by_gender_ratio_female"] = female_ratio

    # 연령
    age_order = ["20대", "30대", "40대", "50대", "60대 이상"]
    age_vals = _extract_bar_counts("연령별", age_order)
    if age_vals:
        (stats["applicants_by_age_20s"],
         stats["applicants_by_age_30s"],
         stats["applicants_by_age_40s"],
         stats["applicants_by_age_50s"],
         stats["applicants_by_age_over_60s"]) = age_vals

    # 학력
    edu_order = ["고졸이하", "2~3년제", "4년제", "석사", "박사"]
    edu_vals = _extract_bar_counts("학력별", edu_order)
    if edu_vals:
        (stats["applicants_by_education_highschool_or_less"],
         stats["applicants_by_education_associates"],
         stats["applicants_by_education_bachelors"],
         stats["applicants_by_education_masters"],
         stats["applicants_by_education_phd"]) = edu_vals

    
    # 포트폴리오 제출 내역(딕셔너리 → JSON 문자열)
    portfolio_dict = _parse_portfolio_dict(soup)
    portfolio_json = json.dumps(portfolio_dict, ensure_ascii=False) if portfolio_dict else None

    # 결과 저장 (스펙 컬럼명 유지)
    stats["applicants_submitted_portfolio_json"] = portfolio_json

    return stats

def parse_header_and_meta(soup):
    """타이틀/회사명/스크랩수(북마크)/조회수/지원버튼 등 상단 메타"""
    res = {
        "posting_title": None,
        "company_name": None,
        "posting_bookmarks_total": None,
        "posting_views_total": None,
        "homepage_visits_total": None,  # 페이지에 일반 미노출 → None
        "company_url_saramin": None
    }

    # 제목
    title = _get_text(soup.select_one(".wrap_jv_header h1.tit_job"))
    res["posting_title"] = title

    # 회사명 / 회사 URL
    company_a = soup.select_one(".wrap_jv_header a.company")
    if company_a:
        res["company_name"] = _get_text(company_a)
        if company_a.get("href"):
            res["company_url_saramin"] = urljoin("https://www.saramin.co.kr", company_a.get("href"))
        else:
            res["company_url_saramin"] = ""

    # 스크랩(=북마크) 수: 버튼 aria-label 혹은 내 텍스트
    scrap_btn = soup.select_one(".wrap_jv_header .btn_scrap")
    if scrap_btn:
        # aria-label="스크랩 20건"
        aria = scrap_btn.get("aria-label")
        n = _first_int(aria) or _first_int(_get_text(scrap_btn))
        res["posting_bookmarks_total"] = n

    # 조회수, 홈페이지 접속수
    # 상단 요약 .list_meta > li 에 '조회수 <strong>295</strong>'
    meta = soup.select_one(".jv_summary .meta")
    if meta:
        for li in meta.select("li"):
            txt = _get_text(li)
            if txt and "조회수" in txt:
                res["posting_views_total"] = _first_int(txt)
            elif txt and "홈페이지접속" in txt:
                res["homepage_visits_total"] = _first_int(txt)
                break

    return res

def parse_applicants_total_fallback(soup, current):
    """지원자수 상단 또는 통계 블럭에서 보조적으로 파싱"""
    if current:
        return current
    # 통계 블럭 total dd
    total = _first_int(_get_text(soup.select_one(".jv_statics .total dd")))
    return total

import re

def _parse_portfolio_dict(soup):
    """
    포트폴리오/기타문서 제출 섹션을 '모든 항목' 딕셔너리로 파싱.
    - .legend 내 모든 <dl>의 <dt>(라벨) / <dd> 또는 .perc span(숫자)
    - ul.info 내 모든 항목(단일 li + li.etc 내부 다수 span)
    - 동일 라벨이 여러 번 나오면 값은 '최댓값'으로 병합(중복 카운트 방지)
    """
    root = soup.select_one(".jv_statics .box_chart.portfolio .chart_donut")
    if not root:
        return None

    result = {}

    def _norm_label(s: str) -> str:
        # 과도한 공백/개행 제거 (라벨 의미 보존 위해 내부 공백은 단일 스페이스로)
        return " ".join(s.strip().split())

    def _to_int(s: str):
        if not s:
            return None
        m = re.search(r"\d[\d,]*", s)
        return int(m.group(0).replace(",", "")) if m else None

    def _upsert(label, value):
        if not label or value is None:
            return
        label = _norm_label(label)
        prev = result.get(label)
        result[label] = max(prev, value) if isinstance(prev, int) else value

    # 1) ul.info 안의 모든 항목 수집 (li.resume/li.career 같은 클래스명 무시)
    info = root.select_one("ul.info")
    if info:
        # 각 li는 하나 이상의 <span> 블록을 가질 수 있음(특히 li.etc)
        for li in info.select("li"):
            spans = li.select("span")
            if not spans:
                spans = [li]  # 방어적: 혹시 span 없이 em이 바로 있는 경우
            for sp in spans:
                ems = sp.select("em")
                if len(ems) >= 2:
                    label = ems[0].get_text(strip=True)
                    val_txt = ems[1].get_text(strip=True)
                    _upsert(label, _to_int(val_txt))

    # 2) .legend 영역의 모든 dl 수집 (dt=라벨, dd/.perc span=값)
    legend = root.select_one(".legend")
    if legend:
        for dl in legend.select("dl"):
            dt = dl.find("dt")
            dd = dl.find("dd")
            label = dt.get_text(strip=True) if dt else None
            val_txt = None
            if dd:
                val_txt = dd.get_text(" ", strip=True)
                # dd 안에 .perc span 이 따로 있으면 우선 사용
                perc = dl.select_one(".perc span")
                if perc:
                    val_txt = perc.get_text(strip=True)
            _upsert(label, _to_int(val_txt))

    return result or None
