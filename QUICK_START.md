# 🚀 RSMS_VUE 빠른 시작 가이드

## 📋 사전 준비 (5분)

### 1️⃣ 필수 프로그램 확인
```bash
# Node.js 18+ 설치 확인
node -v    # v18.0.0 이상

# npm 설치 확인
npm -v     # 9.0.0 이상

# PostgreSQL 15+ 설치 확인
psql --version    # PostgreSQL 15 이상
```

**설치되지 않은 경우:**
- Node.js: https://nodejs.org (LTS 버전 설치)
- PostgreSQL: https://www.postgresql.org/download/

---

## 🗄️ 데이터베이스 설정 (3분)

### 1️⃣ PostgreSQL 접속
```bash
# Windows (WSL)
psql -h 172.21.174.2 -U postgres -d postgres

# Mac/Linux
psql -U postgres -d postgres
```

### 2️⃣ SQL 스크립트 실행
```bash
# 터미널에서 직접 실행
cd /home/rocosoo/RSMS_VUE/database/scripts

# 1. 스키마 생성
psql -h 172.21.174.2 -U postgres -d postgres -f 01.create_schema.sql

# 2. 테이블 생성
psql -h 172.21.174.2 -U postgres -d postgres -f 02.create_tables.sql
```

### 3️⃣ 데이터 확인
```sql
-- PostgreSQL에서 확인
SELECT * FROM rsms_vue.organizations;
SELECT * FROM rsms_vue.positions;

-- 3개 조직, 3개 직책이 보이면 성공 ✅
```

---

## ⚙️ Backend 서버 시작 (2분)

### 1️⃣ 디렉토리 이동 및 환경변수 설정
```bash
cd /home/rocosoo/RSMS_VUE/backend

# .env 파일 생성 (직접 작성)
cat > .env << EOF
DB_HOST=172.21.174.2
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password

PORT=3000
NODE_ENV=development
EOF
```

**⚠️ 중요**: `your_password`를 실제 PostgreSQL 비밀번호로 변경하세요!

### 2️⃣ 의존성 설치 및 서버 시작
```bash
# 의존성 설치
npm install

# 서버 시작
npm start

# ✅ 성공 메시지
# 🚀 RSMS Vue Backend API Server 시작됨: http://localhost:3000
# ✅ 데이터베이스 연결 성공
```

**서버가 실행되면 이 터미널은 그대로 두고, 새 터미널을 여세요!**

---

## 🎨 Frontend 개발 서버 시작 (2분)

### 1️⃣ 새 터미널에서 Frontend 디렉토리 이동
```bash
cd /home/rocosoo/RSMS_VUE/frontend

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# ✅ 성공 메시지
# VITE v5.3.1  ready in 500 ms
# ➜  Local:   http://localhost:5173/
```

### 2️⃣ 브라우저에서 확인
```
http://localhost:5173/
```

**화면에서 확인:**
- 좌측 메뉴: "조직관리", "직책관리"
- 상단 헤더: "RSMS Vue 파일럿"
- 데이터 테이블이 보이면 성공! ✅

---

## 🧪 기능 테스트 (5분)

### 조직관리 테스트
1. 좌측 메뉴 "조직관리" 클릭
2. "조직 등록" 버튼 클릭
3. 폼 입력:
   - 조직코드: `TEST001`
   - 조직명: `테스트부서`
   - 조직유형: `부서`
4. "확인" 클릭 → 테이블에 새 데이터 표시 ✅
5. "수정" 버튼 클릭 → 조직명 변경 → 저장 ✅
6. "삭제" 버튼 클릭 → 확인 → 데이터 삭제 ✅

### 직책관리 테스트
1. 좌측 메뉴 "직책관리" 클릭
2. "직책 등록" 버튼 클릭
3. 폼 입력:
   - 직책코드: `TEST_POS`
   - 직책명: `테스트직책`
   - 소속조직: (드롭다운에서 선택)
4. "확인" 클릭 → 테이블에 새 데이터 표시 ✅
5. 수정/삭제 동일하게 테스트 ✅

---

## 🎯 전체 프로세스 요약

```
1. PostgreSQL 접속 (psql)
   ↓
2. 01.create_schema.sql 실행
   ↓
3. 02.create_tables.sql 실행
   ↓
4. Backend 터미널: cd backend → npm install → npm start
   ↓
5. Frontend 터미널: cd frontend → npm install → npm run dev
   ↓
6. 브라우저: http://localhost:5173/ 접속
   ↓
7. 조직관리/직책관리 CRUD 테스트
```

---

## 🚨 문제 해결

### Backend 서버가 시작되지 않을 때
```bash
# 에러 메시지 확인
npm start

# 흔한 원인:
# 1) .env 파일의 DB_PASSWORD 확인
# 2) PostgreSQL 서버 실행 여부 확인
# 3) 포트 3000이 이미 사용중인지 확인 (lsof -i :3000)
```

### Frontend가 열리지 않을 때
```bash
# 에러 메시지 확인
npm run dev

# 흔한 원인:
# 1) node_modules가 제대로 설치되지 않음 → npm install 재실행
# 2) 포트 5173이 이미 사용중 → vite.config.js에서 포트 변경
```

### 데이터가 표시되지 않을 때
```bash
# 1) Backend 서버가 정상 실행중인지 확인
curl http://localhost:3000/api/organizations

# 2) 데이터베이스에 데이터가 있는지 확인
psql -h 172.21.174.2 -U postgres -d postgres
SELECT * FROM rsms_vue.organizations;

# 3) 브라우저 개발자 도구 (F12) → Console 탭에서 에러 확인
```

---

## 📌 참고 사항

- **Backend 포트**: 3000 (변경: .env 파일의 PORT 수정)
- **Frontend 포트**: 5173 (변경: vite.config.js 수정)
- **API 프록시**: Vite가 /api 요청을 자동으로 Backend로 전달
- **Hot Reload**: 코드 수정 시 자동으로 브라우저 새로고침

---

## ✅ 성공 체크리스트

- [ ] PostgreSQL 접속 성공
- [ ] rsms_vue 스키마 생성 확인
- [ ] organizations, positions 테이블 생성 확인
- [ ] Backend 서버 시작 성공 (포트 3000)
- [ ] Frontend 서버 시작 성공 (포트 5173)
- [ ] 브라우저에서 조직관리 화면 표시
- [ ] 조직 등록/수정/삭제 성공
- [ ] 직책관리 화면 표시
- [ ] 직책 등록/수정/삭제 성공

**모든 체크리스트 완료 시 파일럿 구축 성공! 🎉**

---

**소요 시간**: 약 15-20분
**난이도**: ⭐⭐ (초급)
**문의**: 문제 발생 시 SETUP_GUIDE.md의 상세 가이드 참조
