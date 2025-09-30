# MS-DT-SCHOOL-3rd-project-DrawBridge

Microsoft Data School 3차 프로젝트, **DrawBridge** 저장소입니다.  
본 프로젝트는 **데이터 수집 → 처리 → 저장 → 시각화 → 웹 서비스 구현**까지의 **엔드 투 엔드(End-to-End) 데이터 파이프라인**을 다루고 있습니다.  

- **데이터 계층화**: Medallion Architecture (Bronze → Silver → Gold)  
- **데이터 처리 환경**: PostgreSQL, Databricks, Azure Function App, ASA  
- **시각화**: Power BI  
- **웹 서비스**: Python 기반 Web  

---

## 📂 프로젝트 구조

```bash
│
├── README.md                # 프로젝트 소개 (구조도 이미지, 웹 구현 GIF 포함)
│
├── data                     # 데이터 파일
│   ├── PostgreSQL           # PostgreSQL 쿼리 결과
│   │   ├── public           # 메달리온 아키텍처 (브론즈 계층)
│   │   ├── bronze           # 브론즈 계층 데이터
│   │   ├── silver           # 실버 계층 데이터
│   │   └── gold             # 골드 계층 데이터
│   └── Databricks           # Databricks 데이터
│       ├── bronze
│       ├── silver
│       └── gold
│
├── src                      # 전체 코드
│   ├── PostgreSQL           # PostgreSQL 쿼리
│   │   ├── table definition # 테이블 정의 쿼리
│   │   └── gold             # 골드 테이블 생성 쿼리
│   ├── Databricks           # Databricks Notebook 소스
│   │   ├── bronze
│   │   ├── silver
│   │   └── gold
│   ├── Function App         # Azure Functions 코드
│   │   ├── fapp-dummy       # 더미 데이터 생성
│   │   ├── fapp-jumpit      # 점핏 실시간 데이터 수집
│   │   ├── fapp-huggingface # HuggingFace API 실시간 수집
│   │   ├── fapp-rag         # RAG 기능 구현
│   │   └── capp-saramin     # 사람인 데이터 수집
│   ├── ASA                  # ASA 쿼리 텍스트
│   └── Web                  # 웹 서비스 소스 코드
│
├── PowerBI                  # Power BI 파일 (.pbix)
│
├── image                    # 이미지 자료
 |    ├── Azure resource         # Azure 리소스 그룹 목록 및 비용
│   ├── ERD                  # 데이터 모델 ERD
│   ├── Databricks           # 클러스터/잡 이미지
│   │   ├── cluster
│   │   └── job
│   ├── Function App
│   ├── ASA                  # ASA 입출력 구조도
│   ├── PowerBI             # Power BI 화면
│   └── Web                  # 웹 서비스 화면
│
├── video                    # 시연 영상
│
├── docs                     # 문서 자료
│   ├── daily_report         # 데일리 리포트
│   ├── proposal_paper       # 프로젝트 제안서
│   ├── table_definition     # 테이블 명세서
│   ├── feature_definition     # 테이블 명세서
│   └── PPT                  # 발표 자료
│
```

---

## 🚀 주요 기능

- **실시간 데이터 수집**: Jumpit, HuggingFace, Saramin 등  
- **데이터 계층화 처리**: PostgreSQL & Databricks 기반 Bronze → Silver → Gold  
- **실시간 분석**: Azure Stream Analytics (ASA)  
- **데이터 시각화**: Power BI Dashboard  
- **웹 서비스 구현**: Python 기반 데이터 제공 및 대시보드 연동  

---

## 📊 아키텍처 & 화면 예시

- **프로젝트 구조도**  
  ![구조도](image/ASA/asa_architecture.png)

- **웹 화면**  
  ![웹 서비스](image/Web/web_demo.png)

- **Power BI Dashboard**  
  ![Power BI](image/Databricks/cluster/cluster_cost.png)

---

## 📽 시연 영상

👉 [시연 영상 보기](./video/demo.mp4)  

---

## ⚙️ 실행 방법

### 1. 환경 설정
```bash
# 가상환경 생성
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

# 필요 라이브러리 설치
pip install -r requirements.txt
```

### 2. 웹 서비스 실행
```bash
cd src/Web
python app.py
```

### 3. Databricks/ASA/Function App
- Databricks: `src/Databricks/`의 Notebook 활용  
- ASA: `src/ASA/` 내 쿼리 파일 참고  
- Function App: `src/Function App/` 내 개별 함수 실행  

---

## 📑 문서 자료

- [프로젝트 제안서](./docs/proposal/proposal.pdf)  
- [발표 자료 PPT](./docs/PPT/presentation.pptx)  
- [데일리 리포트](./docs/daily_report/)  
- [테이블 명세서](./docs/table_definition/)  
