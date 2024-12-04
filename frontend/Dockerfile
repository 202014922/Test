# Node.js 이미지를 사용 (LTS 버전 권장)
FROM node:18

# 작업 디렉터리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 소스 코드 복사
COPY . .

# 실행 권한 설정
RUN chmod +x node_modules/.bin/react-scripts

# 애플리케이션 실행 포트
EXPOSE 3000

# 개발 서버 실행
CMD ["npm", "start"]