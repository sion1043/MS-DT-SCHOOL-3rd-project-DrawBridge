import logging
import azure.functions as func
import pandas as pd
import numpy as np
import random
import string
import io
import os

from datetime import datetime, timedelta, timezone
from azure.storage.blob import BlobServiceClient
from azure.eventhub import EventHubProducerClient, EventData

# -----------------------------
# 환경변수
# -----------------------------
BLOB_CONNECTION_STRING = os.getenv("")
BLOB_CONTAINER_NAME = os.getenv("BLOB_CONTAINER_NAME", "")
EVENTHUB_CONNECTION_STRING = os.getenv("EVENTHUB_CONNECTION_STRING","")
EVENTHUB_NAME = os.getenv("EVENTHUB_NAME", "")

# -----------------------------
# 함수 앱 정의
# -----------------------------
app = func.FunctionApp()

@app.schedule(schedule="0 0 18 * * *",  # 매일 02:00 AM
              arg_name="myTimer", run_on_startup=True,
              use_monitor=False)
def timer_trigger(myTimer: func.TimerRequest) -> None:
    if myTimer.past_due:
        logging.info('The timer is past due!')

    logging.info('Python timer trigger function started.')

    # -----------------------------
    # 1. Blob에서 CSV 읽기
    # -----------------------------
    def read_csv_from_blob(blob_name):
        blob_service_client = BlobServiceClient.from_connection_string(BLOB_CONNECTION_STRING)
        blob_client = blob_service_client.get_blob_client(container=BLOB_CONTAINER_NAME, blob=blob_name)
        stream = io.BytesIO()
        blob_client.download_blob().readinto(stream)
        stream.seek(0)
        return pd.read_csv(stream)

    df_jk = read_csv_from_blob("jobkorea_data.csv")
    job_df = read_csv_from_blob("job_skill_ratio.csv")
    career_df = read_csv_from_blob("career_ratio.csv")
    df_region = read_csv_from_blob("region_plus_closet_v3.csv")
    df_salary = read_csv_from_blob("job_exp_salary_v3.csv")

    # -----------------------------
    # 2~14. 기존 더미 데이터 생성 코드 포함
    # -----------------------------
    # -----------------------------
    # 2. 전체 나이대 비율
    # -----------------------------
    age_ratio_dict = {
        "25세이하": 18.72,
        "26세~30세": 34.61,
        "31세~35세": 17.88,
        "36세~40세": 7.18,
        "41세~45세": 8.19,
        "46세이상": 13.42
    }
    age_ratio_series = pd.Series(age_ratio_dict, dtype=float)
    age_ratio_series /= age_ratio_series.sum()

    # -----------------------------
    # 3. 경력 순서 및 숫자 변환 함수
    # -----------------------------
    career_order = ["신입","1년","2년","3년","4년","5년","6년","7년","8년","9년",
                    "10년","11년","12년","13년","14년","15년","16년","17년","18년","19년","20년 이상"]

    def exp_to_num(exp):
        if exp == "신입":
            return 0
        elif exp == "20년 이상":
            return 30
        else:
            return int(exp.replace("년",""))

    career_num = [exp_to_num(c) for c in career_order]

    # -----------------------------
    # 4. 경력 비율 불러오기
    # -----------------------------
    career_df['비율'] = career_df['비율'] / career_df['비율'].sum()
    career_target_ratio = career_df.set_index('경력')['비율'].reindex(career_order).fillna(0)

    # -----------------------------
    # 5. 나이대별 경력 가능한 최대
    # -----------------------------
    max_exp_by_age = {
        "25세이하": 3,
        "26세~30세": 7,
        "31세~35세": 12,
        "36세~40세": 17,
        "41세~45세": 23,
        "46세이상": 30
    }

    # -----------------------------
    # 6. 초기 나이대별 경력 비율 (가우시안 중심)
    # -----------------------------
    age_career_matrix = pd.DataFrame(0.0, index=age_ratio_series.index, columns=career_order, dtype=float)

    for age in age_ratio_series.index:
        max_exp = max_exp_by_age[age]
        center = max_exp - 2
        sigma = max_exp / 4
        for c in career_order:
            num = exp_to_num(c)
            if num <= max_exp:
                age_career_matrix.loc[age, c] = np.exp(-0.5*((num - center)/sigma)**2)
        # 정규화
        if age_career_matrix.loc[age].sum() > 0:
            age_career_matrix.loc[age] /= age_career_matrix.loc[age].sum()
        else:
            age_career_matrix.loc[age] = 1.0 / len(career_order)

    # -----------------------------
    # 7. 나이대별 세세한 가중치 적용
    # -----------------------------
    weight_matrix = pd.DataFrame(0.0, index=age_ratio_series.index, columns=career_order, dtype=float)

    # 각 나이대별 가중치
    weight_matrix.loc["25세이하"] = [1.5,1.3,1.2,1.1,1.0,0.9,0.8,0.7,0.6,0.5,
                                    0.4,0.3,0.2,0.15,0.1,0.1,0.05,0.05,0.03,0.02,0.01]
    weight_matrix.loc["26세~30세"] = [1.2,1.1,1.05,1.0,0.95,0.9,0.85,0.8,0.7,0.6,
                                    0.5,0.4,0.3,0.2,0.15,0.1,0.05,0.05,0.03,0.02,0.01]
    weight_matrix.loc["31세~35세"] = [0.05,0.1,0.2,0.4,0.6,0.8,1.0,1.1,1.0,0.9,
                                    0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.1,0.05,0.03,0.01]
    weight_matrix.loc["36세~40세"] = [0.01,0.05,0.1,0.3,0.5,0.7,1.0,1.1,1.2,1.3,
                                    1.2,1.1,1.0,0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.2]
    weight_matrix.loc["41세~45세"] = [0.0,0.02,0.05,0.1,0.3,0.5,0.8,1.0,1.2,1.3,
                                    1.4,1.3,1.2,1.1,1.0,0.9,0.8,0.7,0.6,0.5,0.4]
    weight_matrix.loc["46세이상"] = [0.0,0.01,0.02,0.05,0.1,0.3,0.5,0.7,0.9,1.0,
                                    1.2,1.3,1.4,1.3,1.2,1.1,1.0,0.9,0.8,0.7,0.6]

    age_career_matrix = age_career_matrix * weight_matrix
    age_career_matrix = age_career_matrix.div(age_career_matrix.sum(axis=1), axis=0)

    # -----------------------------
    # 8. 전체 경력 비율 맞춤 루프
    # -----------------------------
    for iteration in range(50):
        current_career_ratio = (age_career_matrix.T * age_ratio_series).T.sum()
        correction = career_target_ratio / current_career_ratio
        correction.replace([np.inf, -np.inf], 1, inplace=True)
        correction.fillna(1, inplace=True)
        for age in age_career_matrix.index:
            age_career_matrix.loc[age] *= correction
            age_career_matrix.loc[age] /= age_career_matrix.loc[age].sum()

    # -----------------------------
    # 9. 나이대 샘플링 
    # -----------------------------
    #####################
    ###더비 생성량 옵션###
    #####################
    N = random.randint(50, 200)
    #####################
    #####################

    age_samples = np.random.choice(age_ratio_series.index, size=N, p=age_ratio_series.values.astype(float))

    # -----------------------------
    # 10. 나이대별 경력 샘플링
    # -----------------------------
    exp_samples = []
    for age in age_samples:
        probs = age_career_matrix.loc[age].values.astype(float)
        exp_samples.append(np.random.choice(career_order, p=probs))

    # -----------------------------
    # 11. 더미 데이터 생성
    # -----------------------------
    df_dummy = pd.DataFrame({
        'age_category': age_samples,
        'career': exp_samples
    })

    # -----------------------------
    # 11.1 연령대에 맞춰 나이 추가
    # -----------------------------
    df_dummy['age'] = df_dummy['age_category'].map({
        '25세이하': lambda _: random.randint(20, 25),
        '26세~30세': lambda _: random.randint(26, 30),
        '31세~35세': lambda _: random.randint(31, 35),
        '36세~40세': lambda _: random.randint(36, 40),
        '41세~45세': lambda _: random.randint(41, 45),
        '46세이상': lambda _: random.randint(46, 51)
    }).apply(lambda f: f(None))

    # -----------------------------
    # 12. 직무 + 스킬 추가
    # -----------------------------
    job_df["비율"] = job_df["비율"] / job_df["비율"].sum()
    job_probs = job_df["비율"].values.astype(float)
    job_roles = job_df["직무"].values
    chosen_jobs = np.random.choice(job_roles, size=N, p=job_probs)
    df_dummy["job"] = chosen_jobs

    skills_list = []
    for job in chosen_jobs:
        available_skills = job_df.loc[job_df["직무"]==job,"스킬"].values[0]
        available_skills = available_skills.strip("{}").split(";")
        n_skills = random.randint(3,5)
        chosen_skills = random.sample(available_skills, min(n_skills,len(available_skills)))
        skills_list.append(";".join(chosen_skills))
    df_dummy["skills_current"] = skills_list

    # -----------------------------
    # 12.1 skfn_current 생성
    #      : 현재 스킬 숙련도
    # -----------------------------
    # 경력 카테고리
    career_category = {
    '신입': '신입',
    '주니어': ['1년', '2년', '3년'],
    '미드': ['4년', '5년', '6년'],
    '시니어': ['7년', '8년', '9년', '10년', '11년', '12년', '13년', '14년', '15년', '16년', '17년', '18년', '19년', '20년 이상']
    }

    # 경력 카테고리별 skfn 범위
    skfn_range = {
        '신입': [0, 10],
        '주니어': [11, 25],
        '미드': [26, 40],
        '시니어': [41, 55] 
    }

    # 경력 카테고리 매핑
    def get_career_category(career):
        if career == '신입':
            return '신입'
        for cat, years in career_category.items():
            if career in years:
                return cat
        return '시니어'

    # skfn_current 생성
    def generate_skillfulness(row):
        cat = get_career_category(row['career'])
        min, max = skfn_range[cat]
        skills = row['skills_current'].split(';')
        vals = [str(random.randint(min, max)) for skill in skills]
        return ';'.join(vals)

    df_dummy['skfn_current'] = df_dummy.apply(generate_skillfulness, axis=1)

    # -----------------------------
    # 12.2 skills_past, skfn_past, skills_pp, skfn_pp 생성
    #      : 이전 스킬/숙련도, 그 이전 스킬/숙련도 추가 (None)
    # -----------------------------
    df_dummy['skills_past'] = None
    df_dummy['skfn_past'] = None
    df_dummy['skills_p2'] = None
    df_dummy['skfn_p2'] = None
    df_dummy['skills_p3'] = None
    df_dummy['skfn_p3'] = None
    df_dummy['skills_p4'] = None
    df_dummy['skfn_p4'] = None
    df_dummy['skills_p5'] = None
    df_dummy['skfn_p5'] = None
    df_dummy['skills_p6'] = None
    df_dummy['skfn_p6'] = None


    # -----------------------------
    # 13. 구직자 ID 생성
    # -----------------------------
    # Blob에서 마지막 ID 읽기
    def read_last_id():
        blob_service_client = BlobServiceClient.from_connection_string(BLOB_CONNECTION_STRING)
        blob_client = blob_service_client.get_blob_client(container=BLOB_CONTAINER_NAME, blob="last_id.txt")
        try:
            data = blob_client.download_blob().readall().decode("utf-8").strip()
            return data
        except:
            return "a00010000"  # 최초 실행 시 시작값

    def save_last_id(last_id):
        blob_service_client = BlobServiceClient.from_connection_string(BLOB_CONNECTION_STRING)
        blob_client = blob_service_client.get_blob_client(container=BLOB_CONTAINER_NAME, blob="last_id.txt")
        blob_client.upload_blob(last_id, overwrite=True)

    # ID 생성
    letters = list(string.ascii_lowercase)
    ids = []
    last_id = read_last_id()

    letter_index = letters.index(last_id[0])
    counter = int(last_id[1:]) + 1

    for i in range(N):
        ids.append(f"{letters[letter_index]}{counter:08d}")
        counter += 1
        if counter > 99999999:
            counter = 1
            letter_index += 1

    df_dummy["employee_id"] = ids

    # 마지막 ID 저장
    save_last_id(ids[-1])



    # 합산에 필요한 column list 정의
    age_cols = ['25세이하', '26세~30세', '31세~35세', '36세~40세', '41세~45세', '46세이상']
    gender_cols = ['남자', '여자']
    edu_cols = ['고졸미만', '고졸(예정)', '초대졸(예정)', '대졸(예정)', '석박사(예정)']

    # 각 column마다 합산
    age_total = [df_jk[col].sum() for col in age_cols]
    gender_total = [df_jk[col].sum() for col in gender_cols]
    edu_total = [df_jk[col].sum() for col in edu_cols]

    age_total = np.array(age_total)
    gender_total = np.array(gender_total)
    edu_total = np.array(edu_total)

    total_count = df_jk['지원자수'].sum()

    # 결과를 저장할 변수 초기화
    best_max_diff = float('inf')
    best_iterations = 0
    best_joint_array = None

    # 반복 횟수 리스트
    iterations_list = [500, 1000, 3000, 10000, 20000]

    # 각 반복 횟수에 대해 시뮬레이션 실행
    for max_iterations in iterations_list:
        # 매 시뮬레이션마다 joint_array를 초기화
        joint_array = np.ones((6, 2, 5))
        # tol = 1e-6
        tol = 1
        
        for i in range(max_iterations):
            # a. 연령대 합계에 맞춰 조정
            age_sum = joint_array.sum(axis=(1, 2))
            joint_array *= (age_total / age_sum)[:, np.newaxis, np.newaxis]
        
            # b. 성별 합계에 맞춰 조정
            gender_sum = joint_array.sum(axis=(0, 2))
            joint_array *= (gender_total / gender_sum)[np.newaxis, :, np.newaxis]
            
            # c. 학력 합계에 맞춰 조정
            edu_sum = joint_array.sum(axis=(0, 1))
            joint_array *= (edu_total / edu_sum)[np.newaxis, np.newaxis, :]
            
            # 수렴 여부 확인 (주석 해제 권장)
            age_diff = np.abs(joint_array.sum(axis=(1,2)) - age_total).sum()
            gender_diff = np.abs(joint_array.sum(axis=(0,2)) - gender_total).sum()
            edu_diff = np.abs(joint_array.sum(axis=(0,1)) - edu_total).sum()
            
            if age_diff < tol and gender_diff < tol and edu_diff < tol:
                print(f"IPF가 {i}번의 반복 후 수렴했습니다.")
                break
                
        # 현재 시뮬레이션의 최대 오차 계산
        max_diff = max(age_diff, gender_diff, edu_diff)
        print(f"반복 횟수 {max_iterations}회: 최대 오차 = {max_diff:.8f}")

        # 최적 결과 업데이트
        if max_diff < best_max_diff:
            best_max_diff = max_diff
            best_iterations = max_iterations
            best_joint_array = joint_array.copy()

    # 확률 분포로 변환
    total_sum = best_joint_array.sum()
    joint_prob = best_joint_array / total_sum

    # 확률 분포를 1차원 배열로 평탄화
    flat_prob = joint_prob.flatten()

    # 모든 가능한 조합 리스트 생성
    age_cols = ['25세이하', '26세~30세', '31세~35세', '36세~40세', '41세~45세', '46세이상']
    gender_cols = ['남자', '여자']
    edu_cols = ['고졸미만', '고졸(예정)', '초대졸(예정)', '대졸(예정)', '석박사(예정)']

    all_combinations = []
    for age in age_cols:
        for gender in gender_cols:
            for edu in edu_cols:
                all_combinations.append((age, gender, edu))



    # age, gender, edu label 매핑
    age_labels = ['25세이하', '26세~30세', '31세~35세', '36세~40세', '41세~45세', '46세이상']
    gender_labels = ['남자', '여자']
    edu_labels = ['고졸미만', '고졸(예정)', '초대졸(예정)', '대졸(예정)', '석박사(예정)']

    # age별 조건부 분포 계산
    conditional_probs = best_joint_array / best_joint_array.sum(axis=(1,2), keepdims=True)

    # 샘플링 함수
    def sample_gender_edu(age_value):
        age_idx = age_labels.index(age_value)
        probs = conditional_probs[age_idx].flatten()  # shape (10,)
        choice = np.random.choice(len(probs), p=probs)
        g_idx, e_idx = divmod(choice, len(edu_labels))
        return gender_labels[g_idx], edu_labels[e_idx]

    # df_jk에 gender, edu 채워넣기
    df_dummy['gender'], df_dummy['education'] = zip(*df_dummy['age_category'].map(sample_gender_edu))

    # '경제활동인구' 기반 확률(p) 계산
    pop_weights = np.array(df_region['경제활동인구 (천명)'])
    proba = pop_weights / pop_weights.sum()

    # 분포에 맞춰 할당
    df_dummy['location'] = np.random.choice(
        df_region['행정구역명'],
        size=len(df_dummy),
        p=proba
    )

    # 전처리: 쉼표로 구분된 문자열을 리스트로 변환
    df_region['closest_sidos_list'] = df_region['closest_sidos'].str.split(';')
    df_region['closest_sigungu_list'] = df_region['closest_sigungu'].str.split(';')

    # 딕셔너리
    df_region_unique = df_region.drop_duplicates(subset=['행정구역명'], keep='first')
    region_dict = df_region_unique.set_index('행정구역명').to_dict('index')

    conditions = [
        '시/도 전체 1개',
        '시/도 전체 2개',
        '시군구 2개',
        '시/도 전체 1개 + 시군구 2개',
        '시군구 3개'
    ]

    def get_work_location(location):
        region_info = region_dict.get(location, {})
        current_sido = region_info.get('시도명')
        sido_list = region_info.get('closest_sidos_list', [])
        sigungu_list = region_info.get('closest_sigungu_list', [])

        def select_locations(cond):
            if cond == '시/도 전체 1개':
                return [current_sido]
            elif cond == '시/도 전체 2개':
                return [current_sido] + random.sample(sido_list, min(1, len(sido_list)))
            elif cond == '시군구 2개':
                return [location] + random.sample(sigungu_list, min(1, len(sigungu_list)))
            elif cond == '시/도 전체 1개 + 시군구 2개':
                return random.sample(sido_list, min(1, len(sido_list))) + [location] + random.sample(sigungu_list, min(1, len(sigungu_list)))
            elif cond == '시군구 3개':
                return [location] + random.sample(sigungu_list, min(2, len(sigungu_list)))
            return []

        chosen_condition = random.choice(conditions)
        location_candidates = select_locations(chosen_condition)

        # 후보가 없으면 기본값 fallback
        if not location_candidates:
            location_candidates = [current_sido]

        return ', '.join(location_candidates)


    # df_dummy_test에 'work_location' 열 추가
    df_dummy['work_location'] = df_dummy['location'].apply(get_work_location)


    N = df_dummy.shape[0]
    surnames = ["김","이","박","최","정","강","조","윤","장","임","한","오","서","신","권","황","안","송","전",
                "홍","유","고","문","양","손","배","조","백","허","유","남","심","노","정","하","곽","성",
                "차","주","우","구","신","임","전","민","유","류","나"]

    employee_names = [random.choice(surnames) + "XX" for _ in range(N)]
    df_dummy["employee_name"] = employee_names

    # -----------------------------
    # 15. 희망연봉 할당
    # -----------------------------
    career_to_col = {
        "신입": "0년차","1년": "1년차","2년": "2년차","3년": "3년차","4년": "4년차","5년": "5년차",
        "6년": "6년차","7년": "7년차","8년": "8년차","9년": "9년차","10년": "10년차","11년": "11년차",
        "12년": "12년차","13년": "13년차","14년": "14년차","15년": "15년차","16년": "16년차","17년": "17년차",
        "18년": "18년차","19년": "19년차","20년 이상": "20년차"
    }

    salary_cols = ["1800미만", "1800~2200", "2200~2600", "2600~3000",
                   "3000~3400", "3400~4000", "4000이상", "면접후결정"]
    salary_dist = df_jk[salary_cols].sum()
    salary_ratio = salary_dist / salary_dist.sum()
    salary_counter = {col: int(round(salary_ratio[col]*len(df_dummy))) for col in salary_cols}

    hope_salary = []
    for idx, row in df_dummy.iterrows():
        job = row['job']
        career = row['career']
        career_col = career_to_col.get(career, "0년차")
        try:
            val = df_salary.loc[df_salary['job']==job, career_col].values[0]
        except:
            val = "면접후결정"
        if val in salary_counter and salary_counter[val] > 0:
            hope_salary.append(val)
            salary_counter[val] -= 1
        else:
            hope_salary.append("면접후결정")
    df_dummy['hope_salary'] = hope_salary

    # -----------------------------
    # 16. 칼럼 순서 재배치
    # -----------------------------
    df_dummy = df_dummy[['employee_id', 'employee_name', 'age', 'age_category', 'gender', 'location', 'education', 'career',
                         'job', 'skills_current', 'skfn_current', 'work_location', 'hope_salary', 'skills_past', 'skfn_past','skills_p2','skfn_p2','skills_p3','skfn_p3','skills_p4','skfn_p4','skills_p5','skfn_p5','skills_p6','skfn_p6']]


    # -----------------------------
    # timestamp칼럼 생성 ()
    # -----------------------------
    def random_time_today():
        today = datetime.now().date()
        rand_hour = random.randint(0, 23)
        rand_minute = random.randint(0, 59)
        rand_second = random.randint(0, 59)
        return datetime(today.year, today.month, today.day, rand_hour, rand_minute, rand_second)

    df_dummy["timestamp"] = [random_time_today() for _ in range(len(df_dummy))]



    # -----------------------------
    # EventHub에 DataFrame 전송
    # -----------------------------
    from azure.eventhub import EventHubProducerClient, EventData
    import json

    producer = EventHubProducerClient.from_connection_string(
        conn_str=EVENTHUB_CONNECTION_STRING,
        eventhub_name=EVENTHUB_NAME
    )

    # DataFrame을 JSON 문자열 리스트로 변환
    records = df_dummy.to_dict(orient='records')
    json_strings = [json.dumps(rec, ensure_ascii=False, default=str) for rec in records]


    with producer:
        batch = producer.create_batch()
        for js in json_strings:
            try:
                batch.add(EventData(js))
            except ValueError:
                # 배치가 꽉 차면 전송 후 새 배치 생성
                producer.send_batch(batch)
                batch = producer.create_batch()
                batch.add(EventData(js))
        # 마지막 배치 전송
        if len(batch) > 0:
            producer.send_batch(batch)

    logging.info("DataFrame successfully sent to EventHub.")

