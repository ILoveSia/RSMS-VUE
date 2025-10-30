# RSMS_VUE 파일럿 프로젝트

Vue.js + Node.js + PostgreSQL 기반 간단한 CRUD 파일럿 프로젝트

## 📚 프로젝트 구조

```
RSMS_VUE/
├── frontend/          # Vue.js 3 + Element Plus
├── backend/           # Node.js + Express
├── database/          # PostgreSQL Scripts
└── README.md
```

## 🎯 구현 기능

- **조직관리**: 조직 CRUD (생성, 조회, 수정, 삭제)
- **직책관리**: 직책 CRUD (생성, 조회, 수정, 삭제)

## 🛠️ 기술 스택

### Frontend
- Vue 3 (Composition API)
- Element Plus (UI 라이브러리)
- Axios (HTTP 클라이언트)
- Vite (빌드 도구)

### Backend
- Node.js
- Express
- node-postgres (PostgreSQL 클라이언트)

### Database
- PostgreSQL
- Schema: `rsms_vue`

## 🚀 시작하기

### 1. 데이터베이스 설정

```bash
# PostgreSQL 접속
psql -h 172.21.174.2 -U postgres -d postgres

# 스키마 생성
\i /home/rocosoo/RSMS_VUE/database/scripts/01.create_schema.sql

# 테이블 생성
\i /home/rocosoo/RSMS_VUE/database/scripts/02.create_tables.sql
```

### 2. Backend 설정

```bash
cd backend

# 패키지 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일 수정 (DB 비밀번호 등)

# 서버 실행
npm run dev
```

Backend 서버: http://localhost:3000

### 3. Frontend 설정

```bash
cd frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

Frontend 서버: http://localhost:5173

## 📡 API 엔드포인트

### 조직 관리
- `GET /api/organizations` - 조직 목록 조회
- `GET /api/organizations/:orgCode` - 조직 상세 조회
- `POST /api/organizations` - 조직 생성
- `PUT /api/organizations/:orgCode` - 조직 수정
- `DELETE /api/organizations/:orgCode` - 조직 삭제

### 직책 관리
- `GET /api/positions` - 직책 목록 조회
- `GET /api/positions/:positionId` - 직책 상세 조회
- `POST /api/positions` - 직책 생성
- `PUT /api/positions/:positionId` - 직책 수정
- `DELETE /api/positions/:positionId` - 직책 삭제

## 📝 개발 노트

- 파일럿 프로젝트로 **간단하게** 구현
- 인증/권한은 추후 추가 예정
- UI는 Element Plus 기본 스타일 사용
- 에러 핸들링 최소화 (기본 수준)

## 🔧 다음 단계

- [ ] 로그인/인증 추가
- [ ] 페이지네이션 구현
- [ ] 검색 기능 추가
- [ ] 유효성 검증 강화
- [ ] 에러 핸들링 개선
- [ ] 로딩 상태 표시
