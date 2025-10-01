# -------------------------------------------------------
# 라이브러리 호출
# -------------------------------------------------------
import re
import json
import time
import traceback
import logging
from typing import List

# --- Selenium
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, StaleElementReferenceException, ElementClickInterceptedException, JavascriptException
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.common.action_chains import ActionChains

# --- app
from app import login
from app.saramin_company import _helpers


# -------------------------------------------------------
# 사용자 제공 상수
# -------------------------------------------------------
WAIT_SHORT = 5
WAIT_MED = 10
WAIT_LONG = 300


# -------------------------------------------------------
# 사용자 정의 함수 (사람인 기업정보 상세페이지 크롤링)
# -------------------------------------------------------
def _crawl_saramin_company(driver):
    """
    페이지 구조가 회사마다 조금씩 다를 수 있으니,
    '있으면 파싱, 없으면 None' 전략으로 유연하게 수집.
    """
    page = driver.page_source

    # 회사명
    company_name = None
    # 헤더 타이틀
    el = _helpers.find_one_safe(driver, By.CSS_SELECTOR, "h1.tit_company")
    if el:
        company_name = _helpers.get_text_safe(el)
        if company_name:
            company_name = company_name.replace("기업정보", "").strip()
            logging.info(f"company_name: {company_name}")

    def _get_all_strong_txt_tags(driver: WebDriver) -> List[str]:
        """
        driver를 사용하여 모든 'strong.txt' 요소의 텍스트를 추출하는 함수
        """
        keywords = []
        
        # 1. 'ul.company_curation' 요소를 찾습니다.
        ul_element = _helpers.safe_find(driver, By.CSS_SELECTOR, "ul.company_curation")
        #logging.info(f"ul_element: {ul_element}")
        
        if ul_element:
            # 2. 해당 ul 요소 내의 모든 'li.company_curation_item' 요소를 찾습니다.
            # find_elements는 찾은 요소가 없으면 빈 리스트를 반환합니다.
            li_elements = ul_element.find_elements(By.CSS_SELECTOR, "li.company_curation_item")

            #logging.info(f"li_elements: {li_elements}")
            
            # 3. 각 li 요소를 순회하며 그 안의 'strong.txt'를 찾습니다.
            for li in li_elements:
                strong_tag = _helpers.safe_find(li, By.CSS_SELECTOR, "strong.txt")
                #logging.info(f"strong_tag: {strong_tag}")
                if strong_tag:
                    # 4. 찾은 strong 태그에서 _helpers.get_any_text 함수를 사용해 텍스트를 추출합니다.
                    text = _helpers.get_any_text(strong_tag)
                    if text:
                        keywords.append(text)

        return keywords
    
    keywords = _get_all_strong_txt_tags(driver)
        

    #설립일/기업형태/매출
    def _clean_text(text):
        return re.sub(r'\s+', ' ', text or '').strip()

    def _extract_founded_date(root):
        """
        <li class="company_summary_item"> 내에서
        <p class="company_summary_desc">2005년 10월 11일 설립</p> 형태를 찾아 'YYYY년 MM월 DD일'만 추출
        """
        try:
            items = root.find_elements(By.CSS_SELECTOR, "ul.company_summary li.company_summary_item")
        except NoSuchElementException:
            return None
        
        #logging.info(f"items: {items}")
        for li in items:
            desc = _helpers.safe_find(li, By.CSS_SELECTOR, "p.company_summary_desc")
            #logging.info(f"desc: {desc}")
            if not desc:
                continue
            text = _clean_text(desc.text)
            if "설립" in text:
                # '2005년 10월 11일 설립'에서 날짜만 추출
                m = re.search(r"(\d{4}년\s*\d{1,2}월\s*\d{1,2}일)", text)
                return m.group(1) if m else text.replace("설립", "").strip() or None
        return None  


    def _extract_company_type(root):
        """
        가능한 우선순위:
        1) 툴팁 전체 문구의 목록 (예: '기업형태: 1000대기업, 대기업, 수출입 기업' → '1000대기업, 대기업, 수출입 기업')
        2) 버튼의 가시 텍스트 (예: '1000대기업')
        """
        # 1) 툴팁 상세
        tip_txt = _helpers.safe_find(root, By.CSS_SELECTOR, ".TipBox.tooltip_company_type .TipTxt")
        #logging.info(f"tip_txt {tip_txt}")
        if tip_txt:
            #logging.info(f"tip_txt.text: {tip_txt.text}")
            raw = _clean_text(_helpers.get_any_text(tip_txt))
            #logging.info(f"raw: {raw}")
            # '기업형태:' 접두사 제거
            cleaned = re.sub(r"^기업형태\s*:\s*", "", raw).strip()
            #logging.info(f"cleaned {cleaned}")
            if cleaned:
                return cleaned

        # 2) 버튼/강조 텍스트
        btn_txt = _helpers.safe_find(root, By.CSS_SELECTOR, ".tooltip_company_type .btn_open_tooltip .company_summary_tit")
        if btn_txt:
            t = _clean_text(btn_txt.text)
            if t:
                return t

        # 3) 보조: '기업형태'라는 설명 행에서 strong 텍스트 찾기 (혹시 구조가 변할 경우)
        try:
            items = root.find_elements(By.CSS_SELECTOR, "ul.company_summary li.company_summary_item")
        except NoSuchElementException:
            return None
        for li in items:
            desc = _helpers.safe_find(li, By.CSS_SELECTOR, "p.company_summary_desc")
            if desc and _clean_text(desc.text) == "기업형태":
                strong = _helpers.safe_find(li, By.CSS_SELECTOR, "strong.company_summary_tit")
                if strong:
                    return _clean_text(strong.text)
        return None
   
    def _extract_revenue(root):
        """
        <p class="company_summary_desc">매출액</p> 인 항목의
        <strong class="company_summary_tit">2조 4,172억 6,119만원</strong> 텍스트를 문자열로 반환
        (필요시 숫자 KRW로 변환하는 헬퍼도 아래 주석 참고)
        """
        try:
            # '매출액'인 항목 찾기
            li = root.find_element(
                By.XPATH,
                "//ul[contains(@class,'company_summary')]//li[contains(@class,'company_summary_item')][.//p[@class='company_summary_desc' and normalize-space()='매출액']]"
            )
            #logging.info(f"_extract_revenue li: {li}")
        except NoSuchElementException:
            return None

        strong = _helpers.safe_find(li, By.CSS_SELECTOR, "strong.company_summary_tit")
        #logging.info(f"_extract_revenue strong: {strong}")
        return _clean_text(strong.text) if strong else None

    # ---- 실행부 ----
    try:
        root = WebDriverWait(driver, WAIT_LONG).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "ul.company_summary"))
        )
        founded_date = _extract_founded_date(root)
        company_type = _extract_company_type(root)
        revenue = _extract_revenue(root)
        #logging.info(f"founded_date 등 실행부 root: {root}")
    except TimeoutException:
        # 루트를 못 찾으면 에러 없이 기본값
        root = None
        founded_date = None
        company_type = None
        revenue = None

    # 산업/대표자/홈페이지/사업내용/주소/임직원수 등
    # 일반적으로 정보 테이블 구조(라벨-값)임. 라벨 텍스트 기반 검색.
    # 백업: 다양한 섹션에서 label과 value를 추출
    label_value_map = {}
    # 후보 섹션들
    info_blocks = _helpers.find_all_safe(driver, By.CSS_SELECTOR, "dl, table")
    for block in info_blocks:
        try:
            txt = block.get_attribute("outerText") or ""
            #logging.info(f"info_blocks txt: {txt}")
            if any(k in txt for k in ["설립", "기업형태", "매출", "산업", "대표", "홈페이지", "사업내용", "주소", "복지", "임직원"]):
                # dt/dd 기반
                dts = block.find_elements(By.CSS_SELECTOR, "dt")
                dds = block.find_elements(By.CSS_SELECTOR, "dd")
                if dts and dds and len(dts) == len(dds):
                    for dt, dd in zip(dts, dds):
                        k = _helpers.get_text_safe(dt)
                        v = _helpers.get_text_safe(dd)
                        if k and v:
                            label_value_map[k] = v
                else:
                    # 테이블 tr 기반
                    trs = block.find_elements(By.CSS_SELECTOR, "tr")
                    for tr in trs:
                        th = None
                        td = None
                        try:
                            th = tr.find_element(By.CSS_SELECTOR, "th")
                            td = tr.find_element(By.CSS_SELECTOR, "td")
                        except Exception:
                            pass
                        k = _helpers.get_text_safe(th) if th else None
                        v = _helpers.get_text_safe(td) if td else None
                        if k and v:
                            label_value_map[k] = v
        except Exception:
            continue

    def _pick(map_, keys):
        for k in keys:
            for kk in list(map_.keys()):
                if k in kk:
                    return map_[kk]
        return None

    industry = _pick(label_value_map, ["산업", "업종", "업 태"])
    ceo_name = _pick(label_value_map, ["대표", "대표자"])
    homepage_url = _pick(label_value_map, ["홈페이지", "홈 페이지"])
    business_description = _pick(label_value_map, ["사업내용", "사업 내용", "기업소개"])
    address = _pick(label_value_map, ["주소", "본사"])

    #복지
    company_benefits_json = {}

    # welfare 전체 리스트 찾기
    welfare_items = driver.find_elements(By.CSS_SELECTOR, "ul.list_welfare > li.welfare_item")

    for item in welfare_items:
        # 카테고리명 (예: 지원금/보험)
        title_el = _helpers.safe_find(item, By.CSS_SELECTOR, "h3.welfare_tit")
        category = _helpers.get_any_text(title_el) if title_el else None
        if not category:
            continue

        # 세부 항목들
        benefit_els = item.find_elements(By.CSS_SELECTOR, "ul.list_welfare_cate > li.cate_item")
        benefits = [_helpers.get_any_text(b) for b in benefit_els if _helpers.get_any_text(b)]

        company_benefits_json[category] = benefits



    # 관심기업/조회수 등: 헤더/요약부에서 흔함
    company_bookmarks_total = None
    # 예: "690 관심기업"
    buttons = _helpers.find_all_safe(driver, By.CSS_SELECTOR, ".box_btns button, .box_btns .interested_corp")
    for b in buttons:
        t = _helpers.get_text_safe(b)
        if t and ("관심기업" in t or "관심 기업" in t):
            # '관심기업' 앞부분 텍스트를 찾기 위한 정규 표현식
            # (.*?)는 최소한으로 일치하는 모든 문자를 찾습니다.
            # \s*는 공백 문자가 0개 이상 있음을 의미합니다.
            # (?:관심\s*기업)는 '관심'과 '기업' 사이에 공백이 있을 수도, 없을 수도 있음을 의미합니다.
            m = re.search(r"^(.*?)\s*(?:관심\s*기업)", t)
            if m:
                # 첫 번째 캡처 그룹(=전체 텍스트 중 ^와 (?:관심\s*기업) 사이의 모든 텍스트)을 할당
                company_bookmarks_total = m.group(1).strip()
                break
    
    
    def _to_int(text):
        digits = re.sub(r'[^0-9\-]', '', text)
        return int(digits) if digits else None

    def _get_metric_by_title(driver, title_text, timeout=WAIT_LONG):
        """해당 타이틀이 없으면 (None, None)을 반환"""
        try:
            #WebDriverWait(driver, timeout): 조건이 만족될 때까지 주기적으로 폴링하는 “대기 도우미”
            #.until(...): 안의 조건이 True가 될 때까지 기다림
            #조건: CSS 셀렉터 "ul.favor_company_infos"에 맞는 요소가 DOM에 존재하기만 하면 OK
            # 참고로, (존재(presence)는 “보인다”와 다르기 때문에 화면에 안 보여도(가려져도) DOM에만 있으면 통과)
            # 필요에 따라 바꿔 쓸 수 있다: 보이는 상태가 필요 → EC.visibility_of_element_located(...) , 클릭 가능해야 함 → EC.element_to_be_clickable(...)
            # HTML = 텍스트 / DOM = 브라우저가 HTML을 읽어 메모리 안에 만든 객체 트리 (Document Object Model)
            ul = WebDriverWait(driver, timeout).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "ul.favor_company_infos"))
            )
            li = ul.find_element(
                By.XPATH,
                ".//li[contains(@class,'favor_company_item')][.//span[@class='tit' and normalize-space(text())='" + title_text + "']]"
            )
        except NoSuchElementException:
            return None, None

        # percent, count 각각 안전하게 찾기
        try:
            percent_el = li.find_element(By.XPATH, ".//span[contains(@class,'percent')]")
            percent = _to_int(percent_el.text)
        except NoSuchElementException:
            percent = None

        try:
            count_el = li.find_element(By.XPATH, ".//span[contains(@class,'count')]//strong[@class='num']")
            count = _to_int(count_el.text)
        except NoSuchElementException:
            count = None

        return count, percent


    # 월간 조회/증가율 관련 변수
    company_views_monthly, company_view_increase_rate_monthly = _get_metric_by_title(driver, "조회수")
    company_bookmarks_monthly, company_bookmark_increase_rate_monthly = _get_metric_by_title(driver, "관심기업")
    company_keyword_search_count_monthly, company_keyword_search_increase_rate_monthly = _get_metric_by_title(driver, "기업 키워드 검색 횟수")


    # 임직원수
    employees_total = None
    worker_info = _helpers.safe_find(driver, By.CSS_SELECTOR, "div.worker_info")
    if worker_info:
        # "전체 사원수" 라벨이 있는 col 찾기
        cols = worker_info.find_elements(By.CSS_SELECTOR, "div.col")
        for col in cols:
            title_el = _helpers.safe_find(col, By.CSS_SELECTOR, "span.tit")
            if title_el and "전체 사원수" in _helpers.get_any_text(title_el):
                num_el = _helpers.safe_find(col, By.CSS_SELECTOR, "strong.num")
                if num_el:
                    text_value = _helpers.get_any_text(num_el)
                    try:
                        employees_total = int(text_value.replace(",", ""))
                    except ValueError:
                        employees_total = None
                break


    # 시계열
    employees_timeseries_json = None

    # 모든 <script type="module"> 태그 찾기
    script_tags = driver.find_elements(By.CSS_SELECTOR, "script[type='module']")

    for script in script_tags:
        script_content = _helpers.get_any_text(script)
        if "new EmployeeChart(" in script_content:
            # 정규식으로 new EmployeeChart({...}); 내부 JSON 추출
            # re.search(...) = 문자열 안에서 패턴에 맞는 첫 번째 부분을 찾아줍
            # re.S (또는 re.DOTALL) 은 .(점)이 줄바꿈 문자까지 포함해서 매칭되도록 만들어줌. 스크립트 안의 JSON이 여러 줄에 걸쳐 있을 수 있으므로 꼭 필요
            match = re.search(r"new\s+EmployeeChart\((\{.*?\})\);", script_content, re.S)
            if match:
                json_str = match.group(1)
                # group(0) = 전체 매칭된 문자열 (new EmployeeChart({ ... });)
                # group(1) = 첫 번째 괄호 캡처 그룹
                try:
                    employees_timeseries_json = json.loads(json_str)
                except json.JSONDecodeError:
                    employees_timeseries_json = {}
            break



    # 결과 dict
    return {
        "company_name": company_name,
        "company_bookmarks_total": company_bookmarks_total,
        "company_views_monthly": company_views_monthly,
        "company_view_increase_rate_monthly": company_view_increase_rate_monthly,
        "company_bookmarks_monthly": company_bookmarks_monthly,
        "company_bookmark_increase_rate_monthly": company_bookmark_increase_rate_monthly,
        "company_keyword_search_count_monthly": company_keyword_search_count_monthly,
        "company_keyword_search_increase_rate_monthly": company_keyword_search_increase_rate_monthly,
        "company_keywords_saramin": keywords,
        "founded_date": founded_date,
        "company_type": company_type,
        "revenue": revenue,
        "industry": industry,
        "ceo_name": ceo_name,
        "homepage_url": homepage_url,
        "business_description": business_description,
        "address": address,
        "company_benefits_json": company_benefits_json,
        "employees_total": employees_total,
        "employees_timeseries_json": employees_timeseries_json,
    }



# -------------------------------------------------------------------
# 사용자 정의 함수 (사람인 기업연봉정보 상세페이지 크롤링)
# -------------------------------------------------------------------
def _crawl_saramin_salary(driver):
    """
    연봉정보 페이지에서:
    - 평균연봉/최저/최고/전년대비/신뢰도
    - 2022~2024(또는 사용가능 연도)의 평균/최저/최고 + 업종평균
    - 대졸초임 및 예상월실수령액/전년대비
    - 직급별(IT/인터넷 선택 후)의 평균/최저/최고
    - 연령별(IT/인터넷 선택 후)의 2022~2024 JSON
    """
    page = driver.page_source

    # 회사명 (hidden input)
    company_name = None
    el = _helpers.find_one_safe(driver, By.CSS_SELECTOR, "input#company_name")
    if el:
        company_name = _helpers.safe_get_attribute(el, "value")
    if not company_name:
        el = _helpers.find_one_safe(driver, By.CSS_SELECTOR, "h1.tit_company")
        if el:
            company_name = (_helpers.get_text_safe(el) or "").replace("기업정보", "").strip()
    #logging.info(f"_crawl_saramin_salary company_name: {company_name}")

    # 평균연봉 블록
    average_salary = _helpers.find_one_safe(driver, By.CSS_SELECTOR, ".salary_avg .average_currency em")
    salary_avg = _helpers.to_int_or_none(_helpers.get_text_safe(average_salary))
    #logging.info(f"driver: {driver}")
    #logging.info(f"average_salary, salary_avg: {average_salary}, {salary_avg}")

    min_txt = _helpers.find_one_safe(driver, By.CSS_SELECTOR, ".salary_avg .aver_bar .min_txt em")
    salary_min = _helpers.to_int_or_none(_helpers.get_text_safe(min_txt))

    max_txt = _helpers.find_one_safe(driver, By.CSS_SELECTOR, ".salary_avg .aver_bar .max_txt em")
    salary_max = _helpers.to_int_or_none(_helpers.get_text_safe(max_txt))

    yoy = _helpers.find_one_safe(driver, By.XPATH, "//div[contains(@class,'salary_avg')]//dl[contains(@class,'info')]/dd[contains(@class,'point')]//em")
    salary_yoy_change = _helpers.to_float_or_none(_helpers.get_text_safe(yoy))
    #logging.info(f"yoy, yoy_change: {yoy}, {salary_yoy_change}")

    # 신뢰도 텍스트 (낮음/보통/높음/매우높음 등)
    rel = _helpers.find_one_safe(driver, By.CSS_SELECTOR, ".salary_avg .reliability .gauge")
    #logging.info(f"rel: {rel}")
    salary_info_reliability = _helpers.get_text_safe(rel)
    #logging.info(f"salary_info_reliability: {salary_info_reliability}")

    # setCombinationChart(...) 에서 연도별 (avg/min/max/same_kind_avg_salary) 파싱
    combo_json = _helpers.extract_json_from_func_call(driver.page_source, "setCombinationChart")
    salary_year_map = {}            # ex) {'2022': {'avg': 3875, 'min':2702, 'max':5944, 'industry_avg':4893}, ...}
    if combo_json and "average_years_salary" in combo_json:
        for item in combo_json["average_years_salary"]:
            year = str(item.get("years"))
            salary_year_map[year] = {
                "avg": item.get("avg_salary"),
                "min": item.get("min_salary"),
                "max": item.get("max_salary"),
                "industry_avg": item.get("same_kind_avg_salary"),
            }

    # 표준 열 (2024~2023) 채우기
    def yv(y, k):
        return salary_year_map.get(str(y), {}).get(k)

    salary_2022_avg = yv(2022, "avg")
    salary_2022_min = yv(2022, "min")
    salary_2022_max = yv(2022, "max")
    salary_2023_avg = yv(2023, "avg")
    salary_2023_min = yv(2023, "min")
    salary_2023_max = yv(2023, "max")
    salary_2024_avg = yv(2024, "avg")
    salary_2024_min = yv(2024, "min")
    salary_2024_max = yv(2024, "max")

    salary_2022_avg_industry = yv(2022, "industry_avg")
    salary_2023_avg_industry = yv(2023, "industry_avg")
    salary_2024_avg_industry = yv(2024, "industry_avg")

    #logging.info(f"salary_2024_max: {salary_2024_max}")
    #logging.info(f"salary_2024_avg_industry: {salary_2024_avg_industry}")

    # 대졸초임(블록)
    starting_salary_bachelors_avg = None
    starting_salary_bachelors_yoy_change = None
    starting_salary_bachelors_2022_avg = None
    starting_salary_bachelors_2023_avg = None
    starting_salary_bachelors_2024_avg = None
    starting_salary_bachelors_estimated_monthly_takehome = None

    # 현재 연도 기준 값
    el = _helpers.find_one_safe(driver, By.CSS_SELECTOR, ".salary_college .salary_graph_info .salary em")
    if el:
        starting_salary_bachelors_avg = _helpers.to_int_or_none(_helpers.get_text_safe(el))
    # 예상 월 실수령액
    el = _helpers.find_one_safe(driver, By.CSS_SELECTOR, ".salary_college .salary_graph_info .expected strong")
    if el:
        starting_salary_bachelors_estimated_monthly_takehome = _helpers.clean_money_kr_to_int(_helpers.get_text_safe(el))
    
    el = _helpers.safe_find(driver, By.CSS_SELECTOR, ".salary_college .salary_graph_info .keypoint strong")
    if el:
        raw_text = _helpers.get_any_text(el)  # 예: "3.02% 상승 했습니다."
        # 숫자만 추출
        import re
        match = re.search(r"([0-9]+(?:\.[0-9]+)?)", raw_text)
        if match:
            value = match.group(1)
            # 클래스에 따라 부호 붙이기
            cls = el.get_attribute("class") or ""
            if "downpoint" in cls:
                value = f"-{value}"
            starting_salary_bachelors_yoy_change = value


    # 연도별 막대(2022/2023/2024 표기)
    year_blocks = _helpers.find_all_safe(driver, By.CSS_SELECTOR, ".salary_college .graph_info .wrap_graph")
    for yb in year_blocks:
        y = _helpers.get_text_safe(_helpers.find_one_safe(yb, By.CSS_SELECTOR, ".tit_graph"))  # '2022' 등
        v = _helpers.get_text_safe(_helpers.find_one_safe(yb, By.CSS_SELECTOR, ".graph .inner_graph .txt_value"))  # '3,106' 등
        if y and v:
            val = _helpers.to_int_or_none(v)
            if y == "2022":
                starting_salary_bachelors_2022_avg = val
            elif y == "2023":
                starting_salary_bachelors_2023_avg = val
            elif y == "2024":
                starting_salary_bachelors_2024_avg = val
            # 2024는 표준 컬럼에 없고, 위의 starting_salary_bachelors_avg에 담김

    # ---------------------------
    # 직급별(IT/인터넷 버튼 클릭 후) 파싱
    # ---------------------------
    # IT/인터넷 버튼(data-upjong_key="5") 클릭
    # (버튼이 슬라이더 안에 있으므로 보이는 위치로 스크롤 후 클릭)
    it_clicked = False
    LABELS = ("IT/인터넷", "IT·인터넷", "IT · 인터넷", "IT")  # 허용 라벨 변형

    for sel in [
        "button.btn_rank_statistics[data-upjong_key='5']"
        #"button.btn_rank_statistics"  # 백업
    ]:
        buttons = _helpers.find_all_safe(driver, By.CSS_SELECTOR, sel, timeout=WAIT_LONG)
        #logging.info(f"직급별 IT/인터넷 buttons: {buttons}")
        for b in buttons:
            txt = _helpers.get_text_safe(b)
            cond_exact = sel.endswith("[data-upjong_key='5']")
            cond_text  = bool(txt) and any(lbl in txt for lbl in LABELS)

            if not (cond_exact or cond_text):
                continue

            # '전체' 오검출 방지
            if ("전체" in (txt or "")) and (b.get_attribute("data-upjong_key") != "5"):
                continue

            if (sel.endswith("[data-upjong_key='5']")) or (txt and "IT" in txt):
                try:
                    driver.execute_script("arguments[0].scrollIntoView({block:'center'});", b)
                    time.sleep(0.1)
                    b.click()
                    it_clicked = True
                    break
                except Exception:
                    pass
        if it_clicked:
            break

    if it_clicked:
        # Ajax 갱신 대기
        time.sleep(0.8)
    else:
        print(f"직급별 연봉상세정보의 IT/인터넷 탭을 클릭하지 못했습니다")

    def parse_min_max_from_row(row):
        # "최저 3,181" / "최고 3,619"
        mn = mx = None
        try:
            min_el = row.find_element(By.CSS_SELECTOR, ".innerbar .min")
            max_el = row.find_element(By.CSS_SELECTOR, ".innerbar .max")
            mn = _helpers.to_int_or_none(_helpers.get_text_safe(min_el))
            mx = _helpers.to_int_or_none(_helpers.get_text_safe(max_el))
        except Exception:
            pass
        return mn, mx
    
    
    # 직급별 리스트 파싱
    # 데이터 로드될 때까지 10초 대기
    time.sleep(10)
    # 행 구조: <dl class="row"> ... <dt class="title">직급명</dt> <dd class="index">평균</dd> ... 최저/최고는 .innerbar 의 텍스트에서
    rank_rows = _helpers.find_all_safe(driver, By.CSS_SELECTOR, "#positon_list_div dl.row")
    # 맵핑: 컬럼명 요구사항에 맞춰 채우기
    salary_staff_high_school_avg = salary_staff_high_school_min = salary_staff_high_school_max = None
    salary_staff_associates_avg = salary_staff_associates_min = salary_staff_associates_max = None
    salary_staff_bachelors_avg = salary_staff_bachelors_min = salary_staff_bachelors_max = None
    salary_junior_mgr_avg = salary_junior_mgr_min = salary_junior_mgr_max = None
    salary_deputy_mgr_avg = salary_deputy_mgr_min = salary_deputy_mgr_max = None
    salary_section_chief_avg = salary_section_chief_min = salary_section_chief_max = None
    salary_deputy_section_chief_avg = salary_deputy_section_chief_min = salary_deputy_section_chief_max = None
    salary_department_head_avg = salary_department_head_min = salary_department_head_max = None


    if it_clicked:
        for r in rank_rows:
            title = _helpers.get_text_safe(_helpers.find_one_safe(r, By.CSS_SELECTOR, ".title")) or ""
            avg = _helpers.to_int_or_none(_helpers.get_text_safe(_helpers.find_one_safe(r, By.CSS_SELECTOR, ".index")))
            mn, mx = parse_min_max_from_row(r)
            t = title.replace(" ", "")

            # 매핑 규칙 (예제 HTML 기준)
            if "사원(고졸)" in t or ("사원" in t and "고졸" in t):
                salary_staff_high_school_avg, salary_staff_high_school_min, salary_staff_high_school_max = avg, mn, mx
            elif "사원-대졸(2,3년)" in t or ("사원" in t and "2,3년" in t):
                salary_staff_associates_avg, salary_staff_associates_min, salary_staff_associates_max = avg, mn, mx
            elif "사원-대졸(4년)" in t or ("사원" in t and "4년" in t):
                salary_staff_bachelors_avg, salary_staff_bachelors_min, salary_staff_bachelors_max = avg, mn, mx
            elif "주임" in t:
                salary_junior_mgr_avg, salary_junior_mgr_min, salary_junior_mgr_max = avg, mn, mx
            elif "대리" in t:
                salary_deputy_mgr_avg, salary_deputy_mgr_min, salary_deputy_mgr_max = avg, mn, mx
            elif "과장" in t:
                salary_section_chief_avg, salary_section_chief_min, salary_section_chief_max = avg, mn, mx
            elif "차장" in t:
                salary_deputy_section_chief_avg, salary_deputy_section_chief_min, salary_deputy_section_chief_max = avg, mn, mx
            elif "부장" in t:
                salary_department_head_avg, salary_department_head_min, salary_department_head_max = avg, mn, mx
        
        #logging.info(f"salary_department_head_avg, min, max: {salary_department_head_avg}, {salary_department_head_min}, {salary_department_head_max}")

    # ---------------------------
    # 연령별(IT/인터넷 버튼 클릭 후) 파싱 (setLineChart JSON)
    # ---------------------------
    # IT/인터넷 클릭
    it_age_clicked = False
    LABELS = ("IT/인터넷", "IT·인터넷", "IT · 인터넷", "IT")  # 허용 라벨 변형

    for sel in [
        "button.btn_age_statistics[data-upjong_key='5']"
        #"button.btn_age_statistics"  # 백업
    ]:
        buttons = _helpers.find_all_safe(driver, By.CSS_SELECTOR, sel, timeout=WAIT_LONG)
        #logging.info(f"연령별 IT/인터넷 buttons: {buttons}")
        for b in buttons:
            txt = _helpers.get_text_safe(b)
            cond_exact = sel.endswith("[data-upjong_key='5']")
            cond_text  = bool(txt) and any(lbl in txt for lbl in LABELS)

            if not (cond_exact or cond_text):
                print(f"연령별 연봉상세정보에 IT/인터넷 탭이 없습니다: {txt}")
                continue

            # '전체' 오검출 방지
            if ("전체" in (txt or "")) and (b.get_attribute("data-upjong_key") != "5"):
                continue
            
            if (sel.endswith("[data-upjong_key='5']")) or (txt and "IT" in txt):
                try:
                    driver.execute_script("arguments[0].scrollIntoView({block:'center'});", b)
                    time.sleep(0.1)
                    b.click()
                    it_age_clicked = True
                    break
                except Exception:
                    pass
        if it_age_clicked:
            break

    if it_age_clicked:
        time.sleep(0.8)
    else:
        print(f"연령별 연봉상세정보의 IT/인터넷 탭을 클릭하지 못했습니다")

    # # Ajax 갱신 후 setLineChart JSON 재추출 (IT 업계 통계)

    def wait_tooltip_age(root, expected_age, timeout=WAIT_LONG, expected_years=("2022","2023","2024")):
        """
        툴팁의 age가 expected_age로 갱신될 때까지 대기.
        성공 시 (age:int, payload:dict[str, Optional[int]]) 반환.
        payload에는 expected_years의 모든 키가 존재하며,
        없던 연도는 None으로 채운다.
        """
        import re as _re  # ← 함수 로컬 별칭
        
        deadline = time.time() + timeout
        #매 while 루프(= 한 사이클)마다 새로 툴팁 요소를 잡는다. 이전에 들고 있던 WebElement를 재사용하지 않으니 stale에 강해짐.
        #stale이면 현재 사이클의 DOM 접근을 중단하고, 정상적으로 읽힐 때까지 또는 타임아웃 끝날때까지 같은 while 루프를 즉시 한 번 더 돌아서 툴팁과 li를 새로 다시 찾는다
        while time.time() < deadline:
            tooltip = _helpers.safe_find(root, By.CSS_SELECTOR, "#lineCheartTooltip") \
                    or _helpers.safe_find(driver, By.CSS_SELECTOR, "#lineCheartTooltip")  # 필요 시 전역 driver 사용
            
            if not tooltip:
                time.sleep(0.05)
                continue

            try:
                # 1) age 파싱: p.title span.years의 텍스트에서 숫자를 뽑아 expected_age와 같은지 체크
                title_years = _helpers.safe_find(tooltip, By.CSS_SELECTOR, "p.title span.years")
                age_txt = _helpers.safe_text(tooltip, By.CSS_SELECTOR, "p.title span.years")
                m = _re.search(r"(\d+)", age_txt)
                #logging.info(f"age_text search: {m}")
                
                #같지 않으면 그 사이클을 건너뛰고(짧게 sleep) 다음 사이클로
                if not (m and int(m.group(1)) == int(expected_age)):
                    time.sleep(0.05)
                    continue
            
                # 2) 기본 payload를 모두 None으로 초기화
                # payload = { "2022": None, "2023": None, "2024": None }로 시작 → 있는 값만 채움
                payload = {str(y): None for y in expected_years}

                # 3) 항목 읽기 (중간에 tooltip이 교체되면 다시 루프로 continue)
                try:
                    items = tooltip.find_elements(By.CSS_SELECTOR, "ul.graph_wrap_legend li")
                except StaleElementReferenceException:
                    # tooltip 자체가 바뀐 경우 → 다음 while 루프로
                    continue
                #logging.info(f"tooltip items: {items}")

                # 4) 툴팁에 실제로 있는 연도/급여만 덮어쓰기
                for li in items:
                    # li 자체가 stale일 수 있으니 safe_find로 방어
                    yr_el  = _helpers.safe_find(li, By.CSS_SELECTOR, "span.years")
                    sal_el = _helpers.safe_find(li, By.CSS_SELECTOR, "span.salary")
                    #그래도 못 읽으면 그 li만 continue(건너뜀) → 해당 연도는 이번 사이클에서는 None으로 남을 수 있음
                    if not (yr_el and sal_el):
                        continue

                    year_txt = _helpers.safe_text(li, By.CSS_SELECTOR, "span.years")
                    sal_txt  = _helpers.safe_text(li, By.CSS_SELECTOR, "span.salary")
                    year = year_txt.replace("년", "").strip()

                    # 숫자만 남기고 변환 시도
                    sal_num_txt = _re.sub(r"[^\d]", "", sal_txt)      # "8,761 만원" → "8761"
                    sal_val = int(sal_num_txt) if sal_num_txt.isdigit() else None

                    if year in payload:
                        payload[year] = sal_val  # 존재하면 값 덮어쓰기

                return int(m.group(1)), payload
            
            except StaleElementReferenceException:
            # 타이틀/내용 읽는 도중 툴팁이 갈렸으면 다시 시도
                continue

            time.sleep(0.05)
        #타임아웃(예: 0.8s, 10s) 이 끝나면 루프를 탈출하고, 그때까지 안정된 읽기(= return 지점)에 도달하지 못했다면 못 읽었다고 결과 돌리기
        return None, {str(y): None for y in expected_years}

    def robust_hover(bar, actions):
        """막대 중앙/여러 지점을 찍고, JS 이벤트까지 쏘는 강인한 hover"""
        # 뷰로 스크롤
        driver.execute_script("arguments[0].scrollIntoView({block:'center', inline:'center'});", bar)
        time.sleep(0.05)

        # 좌표/사이즈
        w = max(1, int(bar.size.get("width", 25)))
        h = max(1, int(bar.size.get("height", 270)))
        # 찍을 지점(중앙 + 약간의 지터)
        points = [
            (w//2, h//2),
            (max(1, w//4), h//2),
            (min(w-1, (3*w)//4), h//2),
            (w//2, max(1, h//4)),
            (w//2, min(h-1, (3*h)//4)),
        ]

        for (ox, oy) in points:
            try:
                actions.move_to_element_with_offset(bar, ox, oy).pause(0.02).perform()
                # mousemove 추가로 한 번 더 흔들기
                actions.move_by_offset(1, 0).pause(0.02).move_by_offset(-1, 0).perform()
                time.sleep(0.03)
                return True
            except Exception:
                pass

        # 마지막 수단: JS로 mouseover/mousemove 디스패치
        try:
            driver.execute_script("""
                const el = arguments[0];
                const evOver = new MouseEvent('mouseover', {bubbles:true, cancelable:true, composed:true});
                const evMove = new MouseEvent('mousemove', {bubbles:true, cancelable:true, composed:true});
                el.dispatchEvent(evOver);
                el.dispatchEvent(evMove);
            """, bar)
            time.sleep(0.05)
            return True
        except Exception:
            return False

    # ---------- 메인 로직 ----------
    salary_by_age_2022_json = {}
    salary_by_age_2023_json = {}
    salary_by_age_2024_json = {}

    if it_age_clicked:
        root = _helpers.safe_find(driver, By.CSS_SELECTOR, "#linechart_area")
        if root is None:
            raise RuntimeError("라인 차트 영역(#linechart_area)을 찾을 수 없습니다.")
        #logging.info(f"it_age_clicked_root: {root}")

        # 연령 라벨(20~50)을 x축에서 읽어 순서 정합성 확인
        tick_labels = [_helpers.get_any_text(t) for t in root.find_elements(By.CSS_SELECTOR, ".xAxis g.tick text")]
        ages_from_axis = [int(x) for x in tick_labels if x.isdigit()]
        #logging.info(f"ages_from_axis: {ages_from_axis}")

        # 호버 대상 막대들
        bars = root.find_elements(By.CSS_SELECTOR, "#line_barGroup rect.line_bar")
        if not bars:
            bars = driver.find_elements(By.CSS_SELECTOR, "#linechart_area rect.line_bar")

        # 기대 연령 리스트 구성 (x축 읽기 실패 시 20~50로 fallback)
        expected_ages = ages_from_axis if ages_from_axis else list(range(20, 51))

        # bars/ages 길이가 다르면, 가능한 최소 길이에 맞춤
        N = min(len(bars), len(expected_ages))
        bars = bars[:N]
        expected_ages = expected_ages[:N]

        actions = ActionChains(driver)

        for bar, age in zip(bars, expected_ages):
            # 강인한 hover 시도 + 툴팁 age 일치할 때까지 대기/재시도
            success = False
            for _ in range(4):  # 최대 4회 재시도
                if not robust_hover(bar, actions):
                    continue
                t_age, payload = wait_tooltip_age(root, expected_age=age, timeout=0.8)
                #logging.info(f"t_age, payload: {t_age}, {payload}")
                if t_age == age and payload:
                    # 저장
                    if "2024" in payload:
                        salary_by_age_2024_json[str(age)] = payload["2024"]
                    if "2023" in payload:
                        salary_by_age_2023_json[str(age)] = payload["2023"]
                    if "2022" in payload:
                        salary_by_age_2022_json[str(age)] = payload["2022"]
                    success = True
                    break

    # 결과 dict
    return {
        "company_name": company_name,
        "salary_avg": salary_avg,
        "salary_min": salary_min,
        "salary_max": salary_max,
        "salary_yoy_change": salary_yoy_change,
        "salary_info_reliability": salary_info_reliability,
        "salary_2022_avg": salary_2022_avg,
        "salary_2022_min": salary_2022_min,
        "salary_2022_max": salary_2022_max,
        "salary_2023_avg": salary_2023_avg,
        "salary_2023_min": salary_2023_min,
        "salary_2023_max": salary_2023_max,
        "salary_2024_avg": salary_2024_avg,
        "salary_2024_min": salary_2024_min,
        "salary_2024_max": salary_2024_max,
        "salary_2022_avg_industry": salary_2022_avg_industry,
        "salary_2023_avg_industry": salary_2023_avg_industry,
        "salary_2024_avg_industry": salary_2024_avg_industry,
        "starting_salary_bachelors_avg": starting_salary_bachelors_avg,
        "starting_salary_bachelors_yoy_change": starting_salary_bachelors_yoy_change,
        "starting_salary_bachelors_2022_avg": starting_salary_bachelors_2022_avg,
        "starting_salary_bachelors_2023_avg": starting_salary_bachelors_2023_avg,
        "starting_salary_bachelors_2024_avg": starting_salary_bachelors_2024_avg,
        "starting_salary_bachelors_estimated_monthly_takehome": starting_salary_bachelors_estimated_monthly_takehome,
        "salary_staff_high_school_avg": salary_staff_high_school_avg,
        "salary_staff_high_school_min": salary_staff_high_school_min,
        "salary_staff_high_school_max": salary_staff_high_school_max,
        "salary_staff_associates_avg": salary_staff_associates_avg,
        "salary_staff_associates_min": salary_staff_associates_min,
        "salary_staff_associates_max": salary_staff_associates_max,
        "salary_staff_bachelors_avg": salary_staff_bachelors_avg,
        "salary_staff_bachelors_min": salary_staff_bachelors_min,
        "salary_staff_bachelors_max": salary_staff_bachelors_max,
        "salary_junior_mgr_avg": salary_junior_mgr_avg,
        "salary_junior_mgr_min": salary_junior_mgr_min,
        "salary_junior_mgr_max": salary_junior_mgr_max,
        "salary_deputy_mgr_avg": salary_deputy_mgr_avg,
        "salary_deputy_mgr_min": salary_deputy_mgr_min,
        "salary_deputy_mgr_max": salary_deputy_mgr_max,
        "salary_section_chief_avg": salary_section_chief_avg,
        "salary_section_chief_min": salary_section_chief_min,
        "salary_section_chief_max": salary_section_chief_max,
        "salary_deputy_section_chief_avg": salary_deputy_section_chief_avg,
        "salary_deputy_section_chief_min": salary_deputy_section_chief_min,
        "salary_deputy_section_chief_max": salary_deputy_section_chief_max,
        "salary_department_head_avg": salary_department_head_avg,
        "salary_department_head_min": salary_department_head_min,
        "salary_department_head_max": salary_department_head_max,
        "salary_by_age_2022_json": salary_by_age_2022_json,
        "salary_by_age_2023_json": salary_by_age_2023_json,
        "salary_by_age_2024_json": salary_by_age_2024_json,
    }


# -------------------------------------------------------
# 사용자 정의 함수 (메인)
# -------------------------------------------------------
def run_crawl_saramin_company_and_salary(company_url_saramin_array):
    
    driver = login.build_driver()
    company_records = []
    salary_records = []

    try:
        login.login(driver)

        for idx, url in enumerate(company_url_saramin_array):
            try:
                url = str(url)
                if not url.startswith("http"):
                    continue

                # 1) 기업 상세 페이지
                _helpers.safe_navigate(driver, url)
                # 메뉴 사이드바가 보일 때까지 대기 (백업: 헤더 타이틀)
                _ = _helpers.find_one_safe(driver, By.CSS_SELECTOR, ".menu_list", timeout=WAIT_LONG) or \
                    _helpers.find_one_safe(driver, By.CSS_SELECTOR, "h1.tit_company", timeout=WAIT_MED)

                comp = _crawl_saramin_company(driver)
                comp["company_url_saramin"] = url
                comp["saramin_company_collection_time"] = _helpers.now_kr_iso()
                company_records.append(comp)
                logging.info(f"회사정보 {len(company_records)}건 추가 -> {url}")

                # 2) 연봉정보 페이지 이동
                # 사이드바에서 '연봉정보' 버튼 클릭 우선
                clicked_salary = _helpers.click_safe(driver, By.XPATH, "//ul[contains(@class,'menu_list')]//button[contains(., '연봉정보')]", timeout=WAIT_SHORT)

                if not clicked_salary:
                    print("연봉상세정보페이지가 없습니다.")
                    continue  # 다음 기업으로
            
                if clicked_salary:
                    # 연봉 탭 로드 대기 (평균연봉 타이틀)
                    _ = _helpers.find_one_safe(driver, By.CSS_SELECTOR, ".salary_avg .title", timeout=WAIT_LONG)

                    sal = _crawl_saramin_salary(driver)
                    # 실제 접근한 연봉 페이지 URL 기록
                    sal["company_salary_url_saramin"] = driver.current_url
                    sal["saramin_company_salary_collection_time"] = _helpers.now_kr_iso()

                    salary_records.append(sal)
                    #logging.info(f"연봉정보 {len(salary_records)}건 추가 -> {url}")
            
            except Exception as e:
                print(f"[WARN] {idx} {url} 처리 중 오류: {e}")
                traceback.print_exc()
                continue

    finally:
        driver.quit()
        logging.info(f"posting_id_array 수집 종료")

    return company_records, salary_records