# RSMS_VUE 설치 및 실행 가이드

## 📋 사전 준비사항

- Node.js 18 이상
- PostgreSQL 13 이상
- npm 또는 yarn

## 🔧 단계별 설정

### Step 1: 데이터베이스 설정

#### 1-1. PostgreSQL 접속
```bash
psql -h 172.21.174.2 -U postgres -d postgres
```

#### 1-2. 스키마 생성
```sql
-- 또는 psql에서 직접 실행
\i /home/rocosoo/RSMS_VUE/database/scripts/01.create_schema.sql
```

#### 1-3. 테이블 생성
```sql
\i /home/rocosoo/RSMS_VUE/database/scripts/02.create_tables.sql
```

#### 1-4. 데이터 확인
```sql
-- 조직 테이블 확인
SELECT * FROM rsms_vue.organizations;

-- 직책 테이블 확인
SELECT * FROM rsms_vue.positions;
```

### Step 2: Backend 설정 및 실행

#### 2-1. Backend 디렉토리 이동
```bash
cd /home/rocosoo/RSMS_VUE/backend
```

#### 2-2. 패키지 설치
```bash
npm install
```

#### 2-3. 환경변수 설정
```bash
# .env.example을 .env로 복사
cp .env.example .env

# .env 파일 수정
nano .env
```

`.env` 파일 내용:
```env
DB_HOST=172.21.174.2
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=실제비밀번호입력

PORT=3000
NODE_ENV=development
```

#### 2-4. Backend 서버 실행
```bash
# 개발 모드 (nodemon 사용 - 자동 재시작)
npm run dev

# 또는 일반 모드
npm start
```

**확인**: http://localhost:3000 에서 서버 실행 확인

#### 2-5. API 테스트
```bash
# 조직 목록 조회 테스트
curl http://localhost:3000/api/organizations

# 직책 목록 조회 테스트
curl http://localhost:3000/api/positions
```

### Step 3: Frontend 설정 및 실행

#### 3-1. 새 터미널 열기 (Backend는 계속 실행 중)

#### 3-2. Frontend 디렉토리 이동
```bash
cd /home/rocosoo/RSMS_VUE/frontend
```

#### 3-3. 패키지 설치
```bash
npm install
```

#### 3-4. Frontend 서버 실행
```bash
npm run dev
```

**확인**: http://localhost:5173 에서 화면 확인

### Step 4: 동작 확인

#### 4-1. 브라우저에서 접속
```
http://localhost:5173
```

#### 4-2. 조직관리 메뉴 테스트
- 조직 목록 확인
- 조직 등록 테스트
- 조직 수정 테스트
- 조직 삭제 테스트

#### 4-3. 직책관리 메뉴 테스트
- 직책 목록 확인
- 직책 등록 테스트
- 직책 수정 테스트
- 직책 삭제 테스트

## 🐛 문제 해결

### Backend 실행 오류

#### "Cannot find module 'express'"
```bash
cd backend
npm install
```

#### "PostgreSQL 연결 실패"
- .env 파일의 DB 정보 확인
- PostgreSQL 서버 실행 상태 확인
- 방화벽 설정 확인

### Frontend 실행 오류

#### "Cannot find module 'vue'"
```bash
cd frontend
npm install
```

#### "API 호출 실패"
- Backend 서버가 실행 중인지 확인 (http://localhost:3000)
- 브라우저 개발자 도구(F12) → Network 탭에서 오류 확인

### 포트 충돌

#### Backend 포트(3000) 충돌 시
```bash
# .env 파일에서 포트 변경
PORT=3001

# vite.config.js에서도 proxy 타겟 변경
```

#### Frontend 포트(5173) 충돌 시
```bash
# vite.config.js에서 포트 변경
server: {
  port: 5174
}
```

## 🔍 디버깅 팁

### Backend 로그 확인
```bash
cd backend
npm run dev

# 콘솔에서 SQL 쿼리 및 에러 확인
```

### Frontend 개발자 도구
- F12 → Console 탭: JavaScript 에러 확인
- F12 → Network 탭: API 호출 상태 확인

### Database 직접 확인
```sql
-- 조직 데이터 확인
SELECT * FROM rsms_vue.organizations;

-- 직책 데이터 확인
SELECT * FROM rsms_vue.positions;

-- 조인 쿼리 테스트
SELECT p.*, o.org_name
FROM rsms_vue.positions p
LEFT JOIN rsms_vue.organizations o ON p.org_code = o.org_code;
```

## 📞 도움말

문제가 계속되면 다음을 확인하세요:
1. Node.js 버전: `node -v` (18 이상)
2. PostgreSQL 버전: `psql --version` (13 이상)
3. 포트 사용 확인: `lsof -i :3000` / `lsof -i :5173`
