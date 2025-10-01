# -------------------------------------------------------
# 라이브러리 호출
# -------------------------------------------------------
import re
import json
import time
import html
from zoneinfo import ZoneInfo
from datetime import datetime, timezone, timedelta

# --- Selenium
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, StaleElementReferenceException, ElementClickInterceptedException, JavascriptException

# -------------------------------------------------------
# 사용자 제공 상수
# -------------------------------------------------------
SEOUL = ZoneInfo("Asia/Seoul")
WAIT_SHORT = 5
WAIT_MED = 10
WAIT_LONG = 20

# -------------------------------------------------------
# 사용자 정의 함수 (유틸)
# -------------------------------------------------------
def now_kr_iso():
    return datetime.now(SEOUL).isoformat()

def get_text_safe(el):
    try:
        return el.text.strip()
    except Exception:
        return None

def find_one_safe(driver, by, selector, timeout=WAIT_SHORT):
    try:
        return WebDriverWait(driver, timeout).until(EC.presence_of_element_located((by, selector)))
    except TimeoutException:
        return None

def find_all_safe(driver, by, selector, timeout=WAIT_SHORT):
    try:
        WebDriverWait(driver, timeout).until(EC.presence_of_all_elements_located((by, selector)))
        #W는 WebDriverWait의 약자로 보이며, timeout 시간 동안 기다리면서 특정 조건이 충족될 때까지 기다림
        return driver.find_elements(by, selector) #driver.find_elements를 사용하여 찾은 모든 요소를 리스트 형태로 반환
    except TimeoutException:
        return [] #TimeoutException이 발생했을 경우, 빈 리스트를 반환하여 호출한 코드에서 오류가 발생하지 않게함.

def click_safe(driver, by, selector, timeout=WAIT_MED, scroll=True):
    try:
        el = WebDriverWait(driver, timeout).until(EC.element_to_be_clickable((by, selector)))
        if scroll:
            driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
            time.sleep(0.1)
        el.click()
        return True
    except Exception:
        # 차선책: JS 클릭
        try:
            el = driver.find_element(by, selector)
            driver.execute_script("arguments[0].click();", el)
            return True
        except Exception:
            return False

def to_int_or_none(s):
    if s is None:
        return None
    s = s.strip()
    # 숫자, 콤마, 마이너스, 소수점, 만원/원 등 제거 처리
    s = re.sub(r"[^\d\.\-]", "", s)
    if s == "" or s == "-" or s == ".":
        return None
    try:
        # 소수점이 있더라도 int로
        return int(float(s))
    except Exception:
        return None

def to_float_or_none(s):
    if s is None:
        return None
    s = s.strip()
    s = s.replace("%", "")
    s = re.sub(r"[^\d\.\-]", "", s)
    if s in ("", "-", "."):
        return None
    try:
        return float(s)
    except Exception:
        return None

def clean_money_kr_to_int(text):
    """
    '5,739 만원' -> 5739
    '2,610,960원' -> 2610960
    """
    if text is None:
        return None
    t = text.replace(",", "").replace(" ", "")
    t = t.replace("만원", "0000")  # 만원 -> 10,000원 환산
    t = t.replace("원", "")
    return to_int_or_none(t)

def extract_json_from_func_call(page_source, func_name):
    """
    HTML 내에 있는 setCombinationChart({...}) / setLineChart({...}) 호출에서
    JSON 오브젝트를 안전하게 추출.
    """
    try:
        # 함수명 뒤 괄호 내부의 중괄호 블록 추출
        # 중첩 괄호까지 안전하게 파싱하기 위해 수동 스택 파서 사용
        start_idx = page_source.find(func_name + "(")
        if start_idx == -1:
            return None
        start_idx = page_source.find("(", start_idx) + 1
        # 중괄호 기준 영역 찾기
        while start_idx < len(page_source) and page_source[start_idx].isspace():
            start_idx += 1
        if start_idx >= len(page_source) or page_source[start_idx] != "{":
            return None
        brace = 0
        end_idx = start_idx
        while end_idx < len(page_source):
            ch = page_source[end_idx]
            if ch == "{":
                brace += 1
            elif ch == "}":
                brace -= 1
                if brace == 0:
                    end_idx += 1
                    break
            end_idx += 1
        raw_json = page_source[start_idx:end_idx]
        raw_json = html.unescape(raw_json)
        # JS의 true/false/null은 json 호환, key에 따옴표는 이미 있음
        return json.loads(raw_json)
    except Exception:
        return None

def safe_get_attribute(el, name):
    try:
        return el.get_attribute(name)
    except Exception:
        return None

def safe_navigate(driver, url):
    driver.get(url)
    # 기본 대기
    time.sleep(0.5)

def get_any_text(el):
    """보이든 숨겨져 있든 최대한 텍스트를 뽑아주는 헬퍼"""
    t = (el.text or "").strip()
    if t:
        return t
    for attr in ("textContent", "innerText"):
        v = (el.get_attribute(attr) or "").strip()
        if v:
            return v
    return ""

def safe_find(el, by, selector, retries=3, pause=0.05):
    """
    parent(el)이 잠깐 stale 됐다가 다시 살아나는 상황을 고려해
    짧게 몇 번 재시도. 끝까지 못 찾으면 None 반환.
    """
    for i in range(retries):
        try:
            return el.find_element(by, selector)
        except NoSuchElementException:
            return None
        except StaleElementReferenceException:
            if i == retries - 1:
                return None
            time.sleep(pause)
    return None

def safe_text(parent, by, selector, retries=3, pause=0.05):
    import time
    for i in range(retries):
        try:
            el = parent.find_element(by, selector)
            txt = (el.text or "").strip()
            if not txt:
                txt = (el.get_attribute("innerText") or el.get_attribute("textContent") or "").strip()
            return txt
        except NoSuchElementException:
            return ""
        except StaleElementReferenceException:
            if i == retries - 1:
                return ""
            time.sleep(pause)