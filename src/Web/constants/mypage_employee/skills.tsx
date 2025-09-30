export const SKILL_CATEGORIES: Record<string, string> = (() => {
  const tsv = `
id	skill
3d_rendering	3D Rendering
aac	AAC
abap	ABAP
adobe_target	Adobe Target
adobe_xd	Adobe XD
ai%2F%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5	AI/인공지능
aiohttp	AIOHTTP
airflow	Airflow
akka_http	Akka HTTP
amazon_aurora	Amazon Aurora
amazon_cloudfront	Amazon CloudFront
amazon_dynamodb	Amazon DynamoDB
amazon_ec2	Amazon EC2
amazon_ecr	Amazon ECR
amazon_eks	Amazon EKS
amazon_elasticache	Amazon ElastiCache
amazon_quicksight	Amazon Quicksight
amazon_rds	Amazon RDS
amazon_redshift	Amazon Redshift
amazon_s3	Amazon S3
amazon_sqs	Amazon SQS
analog	Analog
android_os	Android OS
android_sdk	Android SDK
android_studio	Android Studio
angular_2	Angular 2
angularjs	AngularJS
ansible	Ansible
ant_design	Ant Design
apache_flink	Apache Flink
apache_http_server	Apache HTTP Server
apache_jmeter	Apache JMeter
apache_sling	Apache Sling
apache_tomcat	Apache Tomcat
apexcharts	ApexCharts
appium	Appium
ar	AR
arangodb	ArangoDB
argo	Argo
arm	ARM
asana	Asana
asic	ASIC
asp.net	ASP.NET
assemblyscript	AssemblyScript
auth0	Auth0
autocad	Autocad
aws	AWS
aws_amplify	AWS Amplify
aws_certificate_manager	AWS Certificate Manager
aws_cloud_development_kit	AWS Cloud Development Kit
aws_cloudformation	AWS CloudFormation
aws_cloudtrail	AWS CloudTrail
aws_codecommit	AWS CodeCommit
aws_codepipeline	AWS CodePipeline
aws_config	AWS Config
aws_glue	AWS Glue
aws_iam	AWS IAM
aws_iot_device_management	AWS IoT Device Management
aws_lambda	AWS Lambda
aws_mobile_hub	AWS Mobile Hub
aws_waf	AWS WAF
axios	axios
azure	AZURE
azure_application_insights	Azure Application Insights
azure_app_service	Azure App Service
azure_cosmos_db	Azure Cosmos DB
azure_database_for_mysql	Azure Database for MySQL
azure_devops	Azure DevOps
azure_devops_server	Azure DevOps Server
azure_security_center	Azure Security Center
azure_sql_database	Azure SQL Database
azure_synapse	Azure Synapse
babel	Babel
backendless	Backendless
bamboo	Bamboo
bigdata	BigData
bitbucket	Bitbucket
blazor	Blazor
blender	Blender
blockchain	Blockchain
blueprint	Blueprint
bootsnap	Bootsnap
bootstrap	Bootstrap
bugcrowd	Bugcrowd
c	C
c%23	C#
c%2B%2B	C++
capacitor	Capacitor
cassandra	Cassandra
ccie	Ccie
ccna	Ccna
ccnp	Ccnp
celery	Celery
centos	CentOS
chakra_ui	Chakra UI
chart.js	Chart.js
circuit_design	Circuit design
cisa	CISA
cisco	Cisco
cisco_ise	Cisco ISE
cissp	CISSP
citrix_gateway	Citrix Gateway
c_lang	C lang
classic_asp	Classic ASP
cloudflare	CloudFlare
cloudflare_waf	Cloudflare WAF
cmake	CMake
cocos2d-x	Cocos2D-X
codeigniter	CodeIgniter
confluence	Confluence
coqui_tts	Coqui TTS
coroutine	Coroutine
couchdb	CouchDB
cppg	CPPG
create_react_native_app	Create React Native App
css_3	CSS 3
cuda	CUDA
d3.js	D3.js
dagger_hilt	Dagger Hilt
dart	Dart
dashboards_by_keen_io	Dashboards by Keen IO
datadog	Datadog
db	DB
db2	DB2
dbunit	DbUnit
debian	Debian
deeplearning	DeepLearning
deta_cloud	Deta Cloud
dialogflow	Dialogflow
dicom	DICOM
directx	DirectX
django	Django
django_rest_framework	Django REST framework
docker	Docker
docker_cloud	Docker Cloud
docker_compose	Docker Compose
druid	Druid
dvc	DVC
dynamo	Dynamo
eclipse	Eclipse
eda	EDA
elasticsearch	Elasticsearch
electron	Electron
elk	ELK
embedded	Embedded
embedded_linux	Embedded Linux
emotion	Emotion
entity_framework	Entity Framework
envoy	Envoy
erp	ERP
es6	ES6
ethernet	ethernet
etl	Etl
expo	Expo
expressjs	ExpressJS
fastapi	FastAPI
ffmpeg	FFMPEG
figma	Figma
firebase	Firebase
firebase_hosting	Firebase Hosting
firebase_realtime_database	Firebase Realtime Database
firewall	Firewall
flask	Flask
flow	Flow
flutter	Flutter
flux	Flux
fortigate_ngfw	FortiGate NGFW
foundation	Foundation
fpga	FPGA
framer	Framer
fusion_360	Fusion 360
fw	FW
gcp	GCP
gcp_iam	GCP IAM
genesys	Genesys
git	Git
git_flow	Git Flow
github	GitHub
github_actions	GitHub Actions
gitlab	GitLab
gitui	GitUI
gnu_bash	GNU Bash
go	Go
goland	GoLand
golang	Golang
google_analytics	Google Analytics
google_app_engine	Google App Engine
google_bigquery	Google BigQuery
google_cloud_platform	Google Cloud Platform
google_docs	Google Docs
gradle	Gradle
grafana	Grafana
graphicsmagick	GraphicsMagick
graphql	GraphQL
groovy	Groovy
grpc	gRPC
gui	GUI
hack	Hack
hadoop	Hadoop
halcon	HALCON
haskell	Haskell
headless_ui	Headless UI
helm	Helm
hibernate	Hibernate
hp_cloud_compute	HP Cloud Compute
html5	HTML5
hw	HW
hyperledger_indy	Hyperledger Indy
ibatis	ibatis
influxdb	InfluxDB
infra	Infra
insight	Insight
intellij_idea	IntelliJ IDEA
ios	iOS
ips	IPS
isms	ISMS
jasmine	Jasmine
java	Java
java_8	Java 8
javascript	JavaScript
jenkins	Jenkins
jest	Jest
jetpack	Jetpack
jetpack_compose	Jetpack Compose
jira	Jira
jotai	Jotai
jquery	jQuery
json	JSON
jsonapi	JsonAPI
jsp	JSP
jstl	JSTL
junit	JUnit
jupyter	Jupyter
k8s	K8S
kafka	Kafka
keras	Keras
konva	Konva
kotlin	Kotlin
kubeflow	Kubeflow
kubernetes	Kubernetes
l2	L2
l3	L3
l4	L4
l7	L7
labview	labview
laravel	Laravel
ldap	LDAP
linear	Linear
linux	Linux
looker	Looker
lua	Lua
machinelearning	MachineLearning
macos	macOS
mac_os_x	Mac OS X
mantis	Mantis
mariadb	MariaDB
matlab	MATLAB
matplotlib	Matplotlib
mcu	MCU
mes	MES
mfc	Mfc
microsoft_azure	Microsoft Azure
microsoft_excel	Microsoft Excel
microsoft_iis	Microsoft IIS
microsoft_office_365	Microsoft Office 365
microsoft_sharepoint	Microsoft SharePoint
microsoft_sql_server	Microsoft SQL Server
microsoft_teams	Microsoft Teams
miplatform	Miplatform
mobx	mobX
mocha	Mocha
mongodb	MongoDB
mqtt	MQTT
msa	MSA
mssql	MSSQL
mvvm	MVVM
mybatis	Mybatis
mysql	MySQL
neo4j	Neo4j
nestjs	NestJS
.net	.NET
netbeans_ide	NetBeans IDE
network	Network
newman	Newman
nexacro	Nexacro
next.js	Next.js
nft	Nft
nginx	NGINX
nginx_proxy_manager	Nginx Proxy Manager
nlp	NLP
node.js	Node.js
nosql	NoSql
notion	Notion
notion.so	notion.so
numpy	NumPy
nuxt.js	Nuxt.js
oauth2	OAuth2
objective-c	Objective-C
okhttp	OkHttp
olap	OLAP
openapi	OpenAPI
opencv	OpenCV
opengl	OpenGL
openproject	OpenProject
openresty	OpenResty
openstack	OpenStack
oracle	Oracle
oracle_pl%2Fsql	Oracle PL/SQL
orcad	Orcad
pads	Pads
pandas	Pandas
pcb	PCB
perforce	Perforce
perl	Perl
phaser	Phaser
photon	Photon
php	PHP
playwright	Playwright
plc	PLC
plotly.js	Plotly.js
pnpm	pnpm
postgresql	PostgreSQL
postman	Postman
power_bi	Power BI
powerbi	PowerBI
powershell	PowerShell
prettier	Prettier
prisma	Prisma
project_reactor	Project Reactor
prometheus	Prometheus
protobuf	Protobuf
pulumi	Pulumi
pyqt	PyQt
pytest	pytest
python	Python
pytorch	PyTorch
qa	QA
qt	Qt
querydsl	QueryDSL
queue	Queue
r	R
rabbitmq	RabbitMQ
rails	Rails
rdb	RDB
react	React
react_canvas	React Canvas
react_d3_library	React D3 Library
react.js_boilerplate	React.js Boilerplate
react_native	React Native
react_query	React Query
react_router	React Router
recoil	Recoil
red_hat_openshift	Red Hat OpenShift
redis	Redis
redis_cloud	Redis Cloud
redmine	Redmine
redux	Redux
redux-saga	redux-saga
refactor.io	Refactor.io
remix	Remix
rest_api	REST API
retrofit	Retrofit
rf	RF
rhcsa	RHCSA
r_language	R Language
room	Room
ros	ROS
router	Router
rpa	RPA
rtos	RTOS
ruby	Ruby
rust	Rust
rxjs	RxJS
rxswift	Rxswift
sap	SAP
sass	Sass
scada	SCADA
scala	Scala
scikit-learn	scikit-learn
scope	Scope
scrapingbot	ScrapingBot
scss	SCSS
securecrt	SecureCRT
selenium	Selenium
semantic_ui	Semantic UI
semantic_ui_react	Semantic UI React
sentry	Sentry
sequelize	Sequelize
shell	Shell
shopify	Shopify
slack	Slack
slim	Slim
smps	SMPS
snort	Snort
snowflake	Snowflake
socketcluster	SocketCluster
socket.io	Socket.IO
solidity	Solidity
solidworks	Solidworks
sonarqube	SonarQube
spark	Spark
splunk	Splunk
spring	Spring
spring_batch	Spring Batch
spring_boot	Spring Boot
spring_data_jpa	Spring Data JPA
spring_framework	Spring Framework
spring_mvc	Spring MVC
spring_security	Spring Security
sql	SQL
sqlalchemy	SQLAlchemy
sqlite	SQLite
storybook	Storybook
styled-components	styled-components
summitdb	SummitDB
supabase	Supabase
svelte	Svelte
sw	SW
swagger_ui	Swagger UI
swift	Swift
swiftui	SwiftUI
switch	Switch
tableau	Tableau
tailwind_css	Tailwind CSS
tailwindcss	TailwindCSS
tcp%2Fip	TCP/IP
tensorflow	TensorFlow
terraform	Terraform
testrail	Testrail
three.js	three.js
thymeleaf	Thymeleaf
tibero	Tibero
timber.io	Timber.io
tortoisesvn	TortoiseSVN
transformers	Transformers
travis_ci	Travis CI
typeorm	TypeORM
typescript	TypeScript
ubuntu	Ubuntu
uniform_css	Uniform CSS
unity	Unity
unreal_engine	Unreal Engine
utm	Utm
vault	Vault
vb.net	Vb.net
vercel	Vercel
verilog	Verilog
vertica	Vertica
vhdl	VHDL
visual_c%2B%2B	Visual C++
visual_studio	Visual Studio
visual_studio_code	Visual Studio Code
vite	Vite
vmware	vmware
vpn	VPN
vr	VR
vscode.dev	vscode.dev
vue.js	Vue.js
vuex	vuex
vulkan	Vulkan
wcf	WCF
webassembly	WebAssembly
webgl	WebGL
webpack	Webpack
webrtc	WebRTC
websocket	WebSocket
whatsapp	WhatsApp
windows	Windows
windows_server	Windows Server
windows_terminal	Windows Terminal
wpf	WPF
xcode	Xcode
xml	XML
yaml	YAML
yocto	Yocto
yolo	yolo
zabbix	Zabbix
zephyr	Zephyr
zeplin	Zeplin
zeromq	ZeroMQ
zustand	Zustand
`.trim();

  const lines = tsv.split(/\r?\n/);
  if (/^id\s+skill$/i.test(lines[0])) lines.shift(); // 헤더 제거

  const entries = lines.map((line) => {
    const [id, ...rest] = line.split("\t");
    const skill = rest.join("\t"); // 혹시 스킬명에 탭이 있으면 결합
    return [skill, id] as const;
  });

  return Object.fromEntries(entries);
})();

// export const SKILL_CATEGORIES: Record<string, string> = {}

export const ALL_SKILLS = Object.keys(SKILL_CATEGORIES)

// export const SKILL_CATEGORY_OPTIONS = [
//   { value: "all", label: "전체 카테고리" },
//   ...Object.keys(SKILL_CATEGORIES).map((category) => ({
//     value: category,
//     label: category,
//   })),
// ]

export const SORT_OPTIONS = [
  { value: "score-desc", label: "점수 높은순" },
  { value: "score-asc", label: "점수 낮은순" },
  { value: "name", label: "이름순" },
  { value: "date", label: "최근 검사순" },
]
  