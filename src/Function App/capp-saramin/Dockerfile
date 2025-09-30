# Azure Functions Linux Python 3.11 베이스 이미지
FROM mcr.microsoft.com/azure-functions/python:4-python3.11

# 브라우저, 드라이버, 필수 라이브러리 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium chromium-driver \
    fonts-liberation \
    libasound2 libatk-bridge2.0-0 libatk1.0-0 libatspi2.0-0 \
    libdrm2 libgbm1 libgtk-3-0 libnspr4 libnss3 \
    libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 \
    libxdamage1 libxext6 libxfixes3 libxrandr2 libxrender1 libxshmfence1 libxtst6 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /home/site/wwwroot

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1 \
    CHROME_BIN=/usr/bin/chromium
