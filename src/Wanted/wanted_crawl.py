from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
import time

EMAIL = "your_ID"
PASSWORD = "your_PW"

BASE_URL = "https://www.wanted.co.kr/discovery?job=518&annual=3-4&is_signup=true&provider=google"

options = Options()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
wait = WebDriverWait(driver, 20)

# 로그인
driver.get(BASE_URL)
time.sleep(5)

login_button = wait.until(
    EC.element_to_be_clickable((By.XPATH, "//button[@data-attribute-id='discovery__signupLogin']"))
)
login_button.click()
time.sleep(2)

email_button = wait.until(
    EC.element_to_be_clickable((By.XPATH, "//button[@data-attribute-id='signupLogin__start' and @data-method='email']"))
)
email_button.click()
time.sleep(2)

wait.until(EC.presence_of_element_located((By.ID, "email"))).send_keys(EMAIL)
time.sleep(1)
wait.until(EC.presence_of_element_located((By.NAME, "password"))).send_keys(PASSWORD)
time.sleep(1)
wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@data-attribute-id='signup__email__login']"))).click()
time.sleep(8)
print("로그인 완료!")

job_roles = [
    ("655", "데이터 엔지니어"),
    ("658", "임베디드 개발자"),
    ("660", "자바 개발자"),
    ("661", ".NET 개발자"),
    ("665", "시스템,네트워크 관리자"),
    ("669", "프론트엔드 개발자"),
    ("672", "하드웨어 엔지니어"),
    ("674", "DevOps / 시스템 관리자"),
    ("676", "QA,테스트 엔지니어"),
    ("677", "안드로이드 개발자"),
    ("678", "iOS 개발자"),
    ("795", "CTO,Chief Technology Officer"),
    ("872", "서버 개발자"),
    ("873", "웹 개발자"),
    ("876", "프로덕트 매니저"),
    ("877", "개발 매니저"),
    ("895", "Node.js 개발자"),
    ("896", "영상,음성 엔지니어"),
    ("899", "파이썬 개발자"),
    ("900", "C,C++ 개발자"),
    ("939", "웹 퍼블리셔"),
    ("1022", "BI 엔지니어"),
    ("1024", "데이터 사이언티스트"),
    ("1025", "빅데이터 엔지니어"),
    ("1026", "기술지원"),
    ("1027", "블록체인 플랫폼 엔지니어"),
    ("1634", "머신러닝 엔지니어"),
    ("10110", "소프트웨어 엔지니어"),
    ("10111", "크로스플랫폼 앱 개발자"),
    ("10231", "DBA"),
]

data = []

for value, name in job_roles:
    print(f"=== 크롤링 중: {name} ===")
    job_url = f"https://www.wanted.co.kr/discovery?job=518&subJob={value}&annual=3-4&is_signup=true&provider=google"
    driver.get(job_url)
    time.sleep(5)

    # 페이지 끝까지 스크롤
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    # 같은 직무자들의 스킬 버튼 클릭 (무조건 3회)
    try:
        # 버튼 <p> 텍스트로 찾기
        skill_text = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//p[text()='같은 직무자들의 스킬']"))
        )
        # 조상 <button> 찾기
        skill_button = skill_text.find_element(By.XPATH, "./ancestor::button")
        
        # 스크롤로 화면에 위치시키기
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", skill_button)
        time.sleep(0.5)
        
        # JS 클릭 3회 반복
        for _ in range(3):
            driver.execute_script("arguments[0].click();", skill_button)
            time.sleep(0.5)  # AJAX 로딩 대기

        print("같은 직무자들의 스킬 버튼 클릭 완료")
    except Exception as e:
        print("같은 직무자들의 스킬 버튼 클릭 실패:", e)




    # JS로 스킬 이름 + 비율 가져오기
    try:
        skills = driver.execute_script("""
        let items = document.querySelectorAll("div[class*='Bar_BarItem__']");
        let result = [];
        items.forEach(item=>{
            let skill = item.querySelector("p[class*='wds-1syzcz2']");
            let percent = item.querySelector("div[class*='Bar_BarItem_body__'] p[class*='wds-rca5um']");
            if(skill && percent){
                result.push([skill.innerText.trim(), percent.innerText.trim()]);
            }
        });
        return result;
        """)
        for skill_name, percent_text in skills:
            data.append({
                "직무": name,
                "스킬": skill_name,
                "비율": percent_text
            })
        print(f"{name} 스킬 {len(skills)}개 수집 완료")
    except Exception as e:
        print(f"⚠ {name} 스킬 수집 실패: {e}")

# CSV 저장
df = pd.DataFrame(data)
df.to_csv("wanted_data.csv", index=False, encoding="utf-8-sig")
print("크롤링 완료! wanted_data.csv 저장됨")

driver.quit()
