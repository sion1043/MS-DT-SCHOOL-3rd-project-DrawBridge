from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
import time

# ===== 사용자 설정 =====
ID = "ksmon1"       # 여기에 JobKorea ID 입력
PW = "soajd117@!" # 여기에 JobKorea PW 입력

URLS = [
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49506505",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49221677",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49368484",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49485837",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49462920",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49223018",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49220869",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49221938",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49222392",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49219780",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49454984",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49369146",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49373432",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49372226",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49371093",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49374849",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49369447",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49369965",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49369199",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49374779",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49375287",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49372423",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49370238",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49223163",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49248945",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49371184",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49368744",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49368585",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49385745",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49221565",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49220181",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49385602",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49222714",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49371923",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49372164",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49374047",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49373564",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49374109",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49369133",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49376042",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49372609",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49368892",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49371842",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49373551",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49373473",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49375130",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49374860",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49372574",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49377145",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49373399",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49373379",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49372560",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49376730",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49371691",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49371615",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49372767",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49371380",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49371734",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49374696",
    "https://www.jobkorea.co.kr/Recruit/ApplyChart?giNo=49370864"
]


# ===== 크롬 드라이버 설정 =====
options = Options()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
wait = WebDriverWait(driver, 15)

# ===== 로그인 =====
driver.get("https://www.jobkorea.co.kr/Login/Login_Tot.asp?rDBName=GG&re_url=%2f%3fmenucode%3dlocal%26localorder%3d1")
wait.until(EC.presence_of_element_located((By.ID, "M_ID"))).send_keys(ID)
wait.until(EC.presence_of_element_located((By.ID, "M_PWD"))).send_keys(PW)
wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "login-button"))).click()
time.sleep(5)
print("로그인 완료!")

# ===== 결과 저장용 리스트 =====
results = []

# ===== URL 순회 =====
for url in URLS:
    driver.get(url)
    time.sleep(3)
    
    try:
        # 공고 제목과 기업명
        header = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "h1.header")))
        company = header.find_element(By.CLASS_NAME, "company").text.strip()
        title = header.text.replace(company, "").strip()

        # 지원자 수
        applicants = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".metricsCount .value em"))).text.strip()

        # 연령별 지원자수
        age_labels = ["25세이하", "26세~30세", "31세~35세", "36세~40세", "41세~45세", "46세이상"]
        age_values = {label: 0 for label in age_labels}
        age_chart = driver.find_elements(By.CSS_SELECTOR, ".chartCol_1 ul li")
        for li in age_chart:
            label = li.find_element(By.CLASS_NAME, "label").text.strip()
            value = li.find_element(By.CLASS_NAME, "value").text.strip()
            if label in age_values:
                age_values[label] = value

        # 성별
        gender_labels = ["남자", "여자"]
        gender_values = {label: 0 for label in gender_labels}
        gender_chart = driver.find_elements(By.CSS_SELECTOR, ".chartSex .content .item")
        for item in gender_chart:
            label = item.find_element(By.CLASS_NAME, "label").text.strip()
            value = item.find_element(By.CLASS_NAME, "value").text.strip()
            if label in gender_values:
                gender_values[label] = value

        # 학력
        edu_labels = ["고졸미만", "고졸(예정)", "초대졸(예정)", "대졸(예정)", "석박사(예정)"]
        edu_values = {label: 0 for label in edu_labels}
        edu_chart = driver.find_elements(By.CSS_SELECTOR, ".chartCol_3 ul li")
        for li in edu_chart:
            label = li.find_element(By.CLASS_NAME, "label").text.strip()
            value = li.find_element(By.CLASS_NAME, "value").text.strip()
            if label in edu_values:
                edu_values[label] = value
        
        # 희망연봉
        salary_values = {}
        salary_chart = driver.find_elements(By.CSS_SELECTOR, ".item.salary ul li")
        for li in salary_chart:
            label = li.find_element(By.CLASS_NAME, "label").text.strip()
            value = li.find_element(By.CLASS_NAME, "value").text.strip()

            # "1800미만", "1800~2200", ..., "면접 후 결정" 형태로 label 정리
            label_clean = label.replace("\n", "").replace(" ", "")
            value_num = value.replace("명", "").strip()

            salary_values[label_clean] = value_num


        # 데이터 추가
        results.append({
            "공고제목": title,
            "기업명": company,
            "지원자수": applicants,
            **age_values,
            **gender_values,
            **edu_values,
            **salary_values
        })

        print(f"완료: {title} - {company}")

    except Exception as e:
        print(f"⚠ 오류 발생: {url} | {e}")
        continue

# ===== CSV 저장 =====
df = pd.DataFrame(results)
df.to_csv("jobkorea_data.csv", index=False, encoding="utf-8-sig")
print("크롤링 완료! jobkorea_data.csv 저장됨")

driver.quit()
