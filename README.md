# RSMS_VUE 파일럿 프로젝트

Vue.js + Node.js + PostgreSQL 기반 계층형 아키텍처 CRUD 애플리케이션

## 📚 프로젝트 구조

```
RSMS_VUE/
├── frontend/          # Vue.js 3 + Element Plus
├── backend/           # Node.js + Express (계층형 아키텍처)
│   ├── config/        # 설정 관리
│   ├── routes/        # 라우트 정의
│   ├── controllers/   # 요청/응답 처리
│   ├── services/      # 비즈니스 로직
│   ├── repositories/  # 데이터 접근 (Stored Procedure 호출)
│   └── middleware/    # 미들웨어
├── database/          # PostgreSQL Scripts & Stored Procedures
└── docs/              # 프로젝트 문서
```

## 🎯 구현 기능

- **조직관리**: 조직 CRUD (생성, 조회, 수정, 삭제)
- **직책관리**: 직책 CRUD (생성, 조회, 수정, 삭제)

## 🛠️ 기술 스택

### Frontend
- Vue 3 (Composition API)
- Element Plus (UI 라이브러리)
- Axios (HTTP 클라이언트)
- Vue Router (라우팅)
- Pinia (상태 관리)
- Vite (빌드 도구)

### Backend
- Node.js + Express
- 계층형 아키텍처 (Layered Architecture)
  - Routes → Controllers → Services → Repositories
- node-postgres (PostgreSQL 클라이언트)
- 환경변수 관리 (dotenv)
- 에러 핸들링 미들웨어

### Database
- PostgreSQL 14+
- Schema: `rsms_vue`
- Stored Procedures (plpgsql) - 19개
  - 조직 관리: 9개
  - 직책 관리: 10개

## 🚀 시작하기

### 1. 데이터베이스 설정

```bash
# PostgreSQL 접속
psql -h 172.21.174.2 -U postgres -d postgres

# 스키마 생성
\i /home/rocosoo/RSMS_VUE/database/scripts/01.create_schema.sql

# 테이블 생성
\i /home/rocosoo/RSMS_VUE/database/scripts/02.create_tables.sql

# Stored Procedures 생성
\i /home/rocosoo/RSMS_VUE/database/scripts/03.create_organization_procedures.sql
\i /home/rocosoo/RSMS_VUE/database/scripts/04.create_position_procedures.sql
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

## 🏗️ 아키텍처 특징

### Backend 계층형 아키텍처
```
Client (Vue.js)
    ↓
Routes (URL 매핑)
    ↓
Controllers (HTTP 처리)
    ↓
Services (비즈니스 로직)
    ↓
Repositories (데이터 접근)
    ↓
Stored Procedures
    ↓
Database (PostgreSQL)
```

### 주요 특징
- **관심사 분리**: 각 계층이 명확한 책임을 가짐
- **테스트 용이성**: 각 계층을 독립적으로 테스트 가능
- **유지보수성**: 변경 시 해당 계층만 수정
- **재사용성**: Service와 Repository 재사용 가능
- **성능**: Stored Procedure를 통한 DB 최적화
- **보안**: SQL Injection 방지, 비즈니스 로직 DB 캡슐화

## 📖 문서

- [프로젝트 구조 상세](PROJECT_STRUCTURE.md) - 전체 파일 구조 및 설명
- [아키텍처 리팩토링 보고서](ARCHITECTURE_REFACTORING.md) - Backend 계층형 아키텍처 전환 과정
- [Stored Procedures 가이드](STORED_PROCEDURES_GUIDE.md) - 19개 Stored Procedure 사용법
- [설치 가이드](SETUP_GUIDE.md) - 상세 설치 및 실행 가이드

## 🔧 다음 단계 (다음 주)

### Module 2: Frontend 개선
- [ ] 공통 컴포넌트 개발 (DataTable, FormDialog 등)
- [ ] Pinia 상태 관리 구현
- [ ] 로딩 상태 표시
- [ ] 에러 처리 개선

### Module 3: 추가 기능
- [ ] 통계 관련 Stored Procedures
- [ ] 트랜잭션 관리 Procedures
- [ ] 페이지네이션 구현
- [ ] 검색 기능 추가

### Module 4: 인증 및 권한
- [ ] 로그인/인증 추가
- [ ] 권한 관리 구현
