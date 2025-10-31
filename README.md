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

Backend 서버: http://localhost:5000

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

## 🚀 운영 환경 구성

### 개발 환경 (현재)
```
Frontend 개발 서버: localhost:5173 (Vite)
Backend 개발 서버: localhost:5000 (Node.js + Express)
Database: 172.21.174.2:5432 (PostgreSQL)
```

### 운영 환경 구성 방식

Node.js + Express는 자체적으로 웹 서버 역할이 가능하므로 두 가지 방식으로 구성할 수 있습니다.

#### 방법 1: Node.js 단독 구성 (간단한 방식)

**하나의 서버, 하나의 포트**

```
┌─────────────────────────────────────────┐
│          서버 1대                        │
│                                         │
│  [Node.js :5000]                        │
│    ├─ 정적 파일 서빙 (Vue 빌드 결과)     │
│    └─ API 처리                          │
│           ↓                             │
│  [PostgreSQL :5432]                     │
└─────────────────────────────────────────┘
```

**배포 과정:**
```bash
# 1. Frontend 빌드
cd frontend
npm run build  # → dist/ 폴더 생성

# 2. Backend에서 정적 파일 서빙 설정
# server.js에 추가:
# app.use(express.static('../frontend/dist'))

# 3. PM2로 Node.js 실행
cd backend
pm2 start server.js --name rsms-api
```

**장점:** 설정 간단, 서버 하나만 관리
**단점:** 성능 제한, SSL 설정 복잡

#### 방법 2: Nginx + Node.js 구성 (권장)

**하나의 서버, 포트 분리**

```
┌─────────────────────────────────────────┐
│          서버 1대                        │
│                                         │
│  [Nginx :80, :443]                      │
│    ├─ 정적 파일 서빙 (Vue)               │
│    ├─ SSL/HTTPS 처리                    │
│    └─ /api/* → localhost:5000 프록시    │
│           ↓                             │
│  [Node.js :5000]                        │
│    └─ API 처리만 담당                    │
│           ↓                             │
│  [PostgreSQL :5432]                     │
└─────────────────────────────────────────┘
```

**포트 구성:**
- 포트 80: Nginx (HTTP)
- 포트 443: Nginx (HTTPS)
- 포트 5000: Node.js (내부 전용, 외부 차단)
- 포트 5432: PostgreSQL (내부 전용, 외부 차단)

**Nginx 설정 예시:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Vue 빌드 결과물 서빙
    location / {
        root /var/www/rsms-vue/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 요청은 Node.js로 프록시
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

**배포 과정:**
```bash
# 1. Frontend 빌드
cd frontend
npm run build

# 2. 빌드 결과물을 Nginx 디렉토리로 복사
sudo cp -r dist/* /var/www/rsms-vue/frontend/dist/

# 3. Node.js 실행 (PM2)
cd backend
pm2 start server.js --name rsms-api

# 4. Nginx 재시작
sudo systemctl restart nginx
```

**장점:** 성능 우수, SSL 설정 쉬움, 로드 밸런싱 가능, 보안 강화
**단점:** 설정 복잡, Nginx 추가 관리 필요

### 권장 구성

- **소규모 (사용자 <100명)**: Node.js 단독
- **중대규모 (사용자 100명+)**: Nginx + Node.js

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
