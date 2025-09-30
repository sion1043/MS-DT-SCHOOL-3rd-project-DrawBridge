# -------------------------------------------------------
# 라이브러리 호출
# -------------------------------------------------------
import os
import time
import logging

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# -------------------------------------------------------
# 사용자 제공 상수
# -------------------------------------------------------
SARAMIN_LOGIN_URL = "https://www.saramin.co.kr/zf_user/auth"
USER_ID = os.environ["saramin-id"]
USER_PW = os.environ["saramin-pw"]


# -------------------------------------------------------
# 사용자 정의 함수
# -------------------------------------------------------
def build_driver() -> webdriver.Chrome:
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    # 서버리스 환경이면 주석 해제
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1280,800")
    chrome_options.add_argument("--lang=ko-KR")
    # 일반 브라우저 UA 흉내
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                      "AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/124.0.0.0 Safari/537.36")
    # 컨테이너 환경 변수 활용
    chrome_options.binary_location = os.environ.get("CHROME_BIN", "/usr/bin/chromium")
    driver_path = os.environ.get("CHROME_DRIVER", "/usr/bin/chromedriver")

    return webdriver.Chrome(service=Service(), options=chrome_options)


def login(driver: webdriver.Chrome) -> None:
    driver.get(SARAMIN_LOGIN_URL)
    wait = WebDriverWait(driver, 30)

    try:
        id_input = wait.until(EC.presence_of_element_located((By.ID, "id")))
        pw_input = driver.find_element(By.ID, "password")
        id_input.send_keys(USER_ID)
        pw_input.send_keys(USER_PW)
        login_btn = driver.find_element(By.CSS_SELECTOR, "button.btn_login")
        login_btn.click()
        time.sleep(3)
    except TimeoutException:
        _debug_dump(driver)
        raise