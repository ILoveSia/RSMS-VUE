# RSMS_VUE 프로젝트 구조

## 📁 전체 디렉토리 구조

```
RSMS_VUE/
├── backend/                          # Node.js + Express Backend
│   ├── config/                       # 설정 관리
│   │   ├── index.js                  # 전역 설정
│   │   └── database.js               # DB 연결 풀
│   ├── routes/                       # 라우트 정의
│   │   ├── index.js                  # 라우트 통합
│   │   ├── organizationRoutes.js    # 조직 라우트
│   │   └── positionRoutes.js         # 직책 라우트
│   ├── controllers/                  # 요청/응답 처리
│   │   ├── organizationController.js # 조직 컨트롤러
│   │   └── positionController.js     # 직책 컨트롤러
│   ├── services/                     # 비즈니스 로직
│   │   ├── organizationService.js    # 조직 서비스
│   │   └── positionService.js        # 직책 서비스
│   ├── repositories/                 # 데이터 접근
│   │   ├── organizationRepository.js # 조직 리포지토리
│   │   └── positionRepository.js     # 직책 리포지토리
│   ├── middleware/                   # 미들웨어
│   │   ├── errorHandler.js           # 에러 처리
│   │   └── validation.js             # 유효성 검증
│   ├── utils/                        # 유틸리티 (향후 확장)
│   ├── node_modules/                 # npm 패키지 (자동 생성)
│   ├── .env                          # 환경변수 (직접 생성 필요)
│   ├── .env.example                  # 환경변수 예시
│   ├── .gitignore                    # Git 제외 파일
│   ├── package.json                  # npm 설정
│   ├── db.js.backup                  # 기존 DB 파일 (백업)
│   └── server.js                     # Express 서버 진입점
│
├── frontend/                         # Vue.js Frontend
│   ├── node_modules/                 # npm 패키지 (자동 생성)
│   ├── dist/                         # 빌드 결과물 (자동 생성)
│   ├── src/                          # 소스 코드
│   │   ├── api/                      # API 호출 함수
│   │   │   └── index.js              # organizationApi, positionApi
│   │   ├── components/               # 공통 컴포넌트 (향후 확장)
│   │   ├── stores/                   # Pinia 상태 관리 (향후 확장)
│   │   ├── views/                    # 페이지 컴포넌트
│   │   │   ├── OrganizationList.vue # 조직관리 화면
│   │   │   └── PositionList.vue      # 직책관리 화면
│   │   ├── App.vue                   # 루트 컴포넌트
│   │   ├── main.js                   # 진입점
│   │   └── router.js                 # Vue Router 설정
│   ├── .gitignore                    # Git 제외 파일
│   ├── index.html                    # HTML 템플릿
│   ├── package.json                  # npm 설정
│   └── vite.config.js                # Vite 빌드 설정
│
├── database/                         # PostgreSQL Scripts
│   └── scripts/
│       ├── 01.create_schema.sql      # 스키마 생성
│       ├── 02.create_tables.sql      # 테이블 생성
│       ├── 03.create_organization_procedures.sql  # 조직 Stored Procedures
│       └── 04.create_position_procedures.sql      # 직책 Stored Procedures
│
├── README.md                         # 프로젝트 개요
├── SETUP_GUIDE.md                    # 설치 및 실행 가이드
├── PROJECT_STRUCTURE.md              # 이 파일
├── ARCHITECTURE_REFACTORING.md       # Backend 아키텍처 리팩토링 보고서
└── STORED_PROCEDURES_GUIDE.md        # Stored Procedures 가이드
```

## 📄 주요 파일 설명

### Backend

Backend는 **계층형 아키텍처(Layered Architecture)**를 따라 구성되어 있으며, 각 계층은 명확한 책임을 가집니다:

```
Routes → Controllers → Services → Repositories → Database
```

#### **Config 계층** (설정 관리)

**`config/index.js`** - 전역 설정 관리
- 환경 변수 로드 및 검증
- 서버, 데이터베이스, CORS, 로깅 설정 통합 관리
- 환경별 설정 분리 (development, production)

**`config/database.js`** - 데이터베이스 연결
- PostgreSQL Connection Pool 생성
- 연결 성공/실패 이벤트 핸들링
- 설정 기반 연결 관리

#### **Routes 계층** (라우트 정의)

**`routes/index.js`** - 라우트 통합
- 모든 라우트를 통합하여 내보냄
- 헬스체크 및 API 루트 엔드포인트

**`routes/organizationRoutes.js`** - 조직 라우트
- 조직 CRUD 엔드포인트 정의
- 유효성 검증 미들웨어 적용

**`routes/positionRoutes.js`** - 직책 라우트
- 직책 CRUD 엔드포인트 정의
- 유효성 검증 미들웨어 적용

#### **Controllers 계층** (요청/응답 처리)

**`controllers/organizationController.js`**
- HTTP 요청 처리 및 응답 형식 표준화
- Service 계층 호출
- 에러 처리를 next()로 위임

**`controllers/positionController.js`**
- HTTP 요청 처리 및 응답 형식 표준화
- Service 계층 호출
- 에러 처리를 next()로 위임

#### **Services 계층** (비즈니스 로직)

**`services/organizationService.js`**
- 조직 관련 비즈니스 로직
- 데이터 검증 및 변환
- 중복 확인, 하위 데이터 존재 확인 등

**`services/positionService.js`**
- 직책 관련 비즈니스 로직
- 데이터 검증 및 변환
- 조직 존재 여부 확인, 중복 확인 등

#### **Repositories 계층** (데이터 접근)

**`repositories/organizationRepository.js`**
- 조직 데이터 접근 로직
- PostgreSQL Stored Procedure 호출
- CRUD 및 검색, 통계 메서드
- 프로시저: sp_get_organizations(), sp_create_organization(), sp_update_organization(), sp_delete_organization() 등

**`repositories/positionRepository.js`**
- 직책 데이터 접근 로직
- PostgreSQL Stored Procedure 호출
- CRUD 및 검색, 통계 메서드
- 프로시저: sp_get_positions(), sp_create_position(), sp_update_position(), sp_delete_position() 등

#### **Middleware** (미들웨어)

**`middleware/errorHandler.js`**
- 전역 에러 핸들러
- PostgreSQL 에러 처리
- 에러 로깅 및 응답 형식 표준화

**`middleware/validation.js`**
- 요청 데이터 유효성 검증
- 필수 필드 확인 및 형식 검증

#### **API 엔드포인트**

```javascript
// 헬스체크
GET    /health                      // 서버 상태 확인
GET    /api                         // API 정보

// 조직 관리
GET    /api/organizations           // 목록 조회
GET    /api/organizations/:orgCode  // 상세 조회
GET    /api/organizations/type/:orgType  // 유형별 조회
GET    /api/organizations/stats     // 통계 조회
POST   /api/organizations           // 생성
PUT    /api/organizations/:orgCode  // 수정
DELETE /api/organizations/:orgCode  // 삭제

// 직책 관리
GET    /api/positions               // 목록 조회
GET    /api/positions/:positionId   // 상세 조회
GET    /api/positions/organization/:orgCode  // 조직별 조회
GET    /api/positions/stats         // 통계 조회
POST   /api/positions               // 생성
PUT    /api/positions/:positionId   // 수정
DELETE /api/positions/:positionId   // 삭제
```

#### **환경 설정**

**`.env`** (환경변수)
```env
# 데이터베이스 설정
DB_HOST=172.21.174.2
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_SCHEMA=rsms_vue

# 서버 설정
PORT=3000
HOST=localhost
NODE_ENV=development

# CORS 설정
CORS_ORIGIN=*
CORS_CREDENTIALS=false

# 로깅 설정
LOG_LEVEL=debug
LOG_ENABLED=true
```

### Frontend

#### `src/main.js` (진입점)
- Vue 앱 생성
- Pinia 상태 관리 등록
- Vue Router 등록
- Element Plus UI 라이브러리 등록

#### `src/router.js` (라우팅)
```javascript
/                    → /organizations로 리다이렉트
/organizations       → OrganizationList.vue
/positions           → PositionList.vue
```

#### `src/App.vue` (루트 컴포넌트)
- 헤더: "RSMS Vue 파일럿"
- 좌측 메뉴: 조직관리, 직책관리
- 메인 영역: <router-view> (현재 페이지)

#### `src/api/index.js` (API 클라이언트)
- Axios 인스턴스 생성
- `organizationApi`: 조직 CRUD 함수
- `positionApi`: 직책 CRUD 함수

#### `src/views/OrganizationList.vue` (조직관리)
**기능:**
- 조직 목록 조회 및 테이블 표시
- 조직 등록 다이얼로그
- 조직 수정 다이얼로그
- 조직 삭제 (단일/다중)
- 체크박스 선택

**사용 컴포넌트:**
- el-table (데이터 테이블)
- el-dialog (등록/수정 모달)
- el-form (폼 입력)
- el-button (액션 버튼)

#### `src/views/PositionList.vue` (직책관리)
**기능:**
- 직책 목록 조회 및 테이블 표시
- 직책 등록 다이얼로그
- 직책 수정 다이얼로그
- 직책 삭제 (단일/다중)
- 조직 선택 (Select)

**사용 컴포넌트:**
- el-table (데이터 테이블)
- el-dialog (등록/수정 모달)
- el-form (폼 입력)
- el-select (조직 선택)
- el-button (액션 버튼)

#### `vite.config.js` (Vite 설정)
```javascript
{
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'  // Backend API 프록시
    }
  }
}
```

### Database

#### `01.create_schema.sql`
- `rsms_vue` 스키마 생성
- `update_updated_at_column()` 공통 함수 생성

#### `02.create_tables.sql`
**테이블:**
1. **organizations** (조직)
   - org_code (PK)
   - org_name
   - org_type (head/dept/branch)
   - is_active
   - created_at, updated_at

2. **positions** (직책)
   - position_id (PK, SERIAL)
   - position_code (UNIQUE)
   - position_name
   - org_code (FK → organizations)
   - is_active
   - created_at, updated_at

**샘플 데이터:**
- 조직 3개
- 직책 3개

#### `03.create_organization_procedures.sql`
**조직 관리 Stored Procedures (9개):**
- `sp_get_organizations()` - 조직 전체 목록 조회
- `sp_get_organization_by_code(p_org_code)` - 특정 조직 조회
- `sp_get_organizations_by_type(p_org_type)` - 유형별 조직 조회
- `sp_get_organization_stats()` - 조직 통계 조회
- `sp_create_organization(p_org_code, p_org_name, p_org_type, p_is_active)` - 조직 생성
- `sp_update_organization(p_org_code, p_org_name, p_org_type, p_is_active)` - 조직 수정
- `sp_delete_organization(p_org_code)` - 조직 삭제
- `sp_check_org_code_exists(p_org_code)` - 조직 코드 존재 확인
- `sp_count_positions_by_org(p_org_code)` - 조직별 직책 개수 조회

#### `04.create_position_procedures.sql`
**직책 관리 Stored Procedures (10개):**
- `sp_get_positions()` - 직책 전체 목록 조회
- `sp_get_position_by_id(p_position_id)` - 특정 직책 조회
- `sp_get_positions_by_org(p_org_code)` - 조직별 직책 조회
- `sp_get_position_stats()` - 직책 통계 조회
- `sp_create_position(p_position_code, p_position_name, p_org_code, p_is_active)` - 직책 생성
- `sp_update_position(p_position_id, p_position_code, p_position_name, p_org_code, p_is_active)` - 직책 수정
- `sp_delete_position(p_position_id)` - 직책 삭제
- `sp_check_position_code_exists(p_position_code)` - 직책 코드 존재 확인
- `sp_check_position_code_exists_exclude_self(p_position_id, p_position_code)` - 직책 코드 중복 확인 (자기 자신 제외)
- `sp_check_org_exists(p_org_code)` - 조직 존재 확인

**사용 방법:**
자세한 사용 방법 및 예제는 [STORED_PROCEDURES_GUIDE.md](STORED_PROCEDURES_GUIDE.md)를 참조하세요.

## 🏗️ Backend 아키텍처

### 계층형 아키텍처 (Layered Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Vue.js)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP Request
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Routes Layer                             │
│  - organizationRoutes.js                                     │
│  - positionRoutes.js                                         │
│  ✓ URL 매핑 및 미들웨어 적용                                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Controllers Layer                          │
│  - organizationController.js                                 │
│  - positionController.js                                     │
│  ✓ HTTP 요청/응답 처리                                        │
│  ✓ 데이터 변환 및 검증                                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Services Layer                            │
│  - organizationService.js                                    │
│  - positionService.js                                        │
│  ✓ 비즈니스 로직 실행                                         │
│  ✓ 데이터 검증 및 변환                                        │
│  ✓ 트랜잭션 관리                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 Repositories Layer                           │
│  - organizationRepository.js                                 │
│  - positionRepository.js                                     │
│  ✓ 데이터 접근 로직                                           │
│  ✓ Stored Procedure 호출                                     │
│  ✓ 결과 매핑                                                  │
└──────────────────────────┬──────────────────────────────────┘
                           │ Stored Procedure 호출
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                PostgreSQL Database                           │
│  - Tables: organizations, positions                          │
│  - Procedures: sp_get_*, sp_create_*, sp_update_*, etc.      │
└─────────────────────────────────────────────────────────────┘
```

### 계층별 책임

| 계층 | 책임 | 예시 |
|-----|------|------|
| **Routes** | URL 매핑, 미들웨어 적용 | `GET /api/organizations` → `organizationController.getAll` |
| **Controllers** | HTTP 요청/응답 처리 | `req.body` 추출, `res.json()` 응답 |
| **Services** | 비즈니스 로직 | 중복 확인, 데이터 검증, 하위 데이터 확인 |
| **Repositories** | 데이터 접근 | Stored Procedure 호출, 결과 매핑 |
| **Database** | 데이터 저장 및 처리 | Stored Procedure 실행, 데이터 반환 |

### 장점

1. **관심사 분리 (Separation of Concerns)**: 각 계층이 명확한 책임을 가짐
2. **테스트 용이성**: 각 계층을 독립적으로 테스트 가능
3. **유지보수성**: 변경 시 해당 계층만 수정하면 됨
4. **재사용성**: Service와 Repository는 다른 Controller에서도 사용 가능
5. **확장성**: 새로운 기능 추가 시 일관된 구조 유지

## 🔄 데이터 흐름

### 조회 (Read)
```
사용자
  ↓ 클릭
Vue 페이지 (OrganizationList.vue)
  ↓ fetchData()
API 함수 (organizationApi.getAll())
  ↓ GET /api/organizations
Routes (organizationRoutes.js)
  ↓ organizationController.getAll()
Controller
  ↓ organizationService.getAllOrganizations()
Service
  ↓ organizationRepository.findAll()
Repository
  ↓ SELECT * FROM rsms_vue.sp_get_organizations()
PostgreSQL Stored Procedure (sp_get_organizations)
  ↓ 결과 반환
Repository → Service → Controller → Vue → 화면 표시
```

### 생성 (Create)
```
사용자
  ↓ "조직 등록" 버튼 클릭
다이얼로그 열림
  ↓ 폼 입력 후 "확인" 클릭
API 함수 (organizationApi.create(data))
  ↓ POST /api/organizations
Routes → Controller → Service → Repository
  ↓ SELECT rsms_vue.sp_create_organization(...)
PostgreSQL Stored Procedure (sp_create_organization)
  ↓ 성공 메시지
다이얼로그 닫힘 → 목록 새로고침
```

### 수정 (Update)
```
사용자
  ↓ "수정" 버튼 클릭
다이얼로그 열림 (기존 데이터 로드)
  ↓ 폼 수정 후 "확인" 클릭
API 함수 (organizationApi.update(orgCode, data))
  ↓ PUT /api/organizations/:orgCode
Routes → Controller → Service → Repository
  ↓ SELECT rsms_vue.sp_update_organization(...)
PostgreSQL Stored Procedure (sp_update_organization)
  ↓ 성공 메시지
다이얼로그 닫힘 → 목록 새로고침
```

### 삭제 (Delete)
```
사용자
  ↓ "삭제" 버튼 클릭
확인 다이얼로그
  ↓ "확인" 클릭
API 함수 (organizationApi.delete(orgCode))
  ↓ DELETE /api/organizations/:orgCode
Routes → Controller → Service → Repository
  ↓ SELECT rsms_vue.sp_delete_organization(...)
PostgreSQL Stored Procedure (sp_delete_organization)
  ↓ 성공 메시지
목록 새로고침
```

## 🎨 UI 구성

### 레이아웃
```
┌─────────────────────────────────────┐
│ Header: RSMS Vue 파일럿             │
├───────┬─────────────────────────────┤
│ Menu  │ Main Content                │
│       │                             │
│ 조직  │ <router-view>               │
│ 관리  │  - OrganizationList.vue     │
│       │  - PositionList.vue         │
│ 직책  │                             │
│ 관리  │                             │
│       │                             │
└───────┴─────────────────────────────┘
```

### 페이지 구조 (공통)
```
┌─────────────────────────────────────┐
│ 제목 (h3)                           │
├─────────────────────────────────────┤
│ [등록] [선택 삭제]                  │
├─────────────────────────────────────┤
│ ☐ │ 코드  │ 명칭  │ ... │ [수정][삭제] │
│ ☐ │ ...   │ ...   │ ... │ ...         │
└─────────────────────────────────────┘
```

## 🔧 확장 가능성

### 추가 가능한 기능
- [ ] 페이지네이션
- [ ] 검색 필터
- [ ] 정렬 기능
- [ ] 엑셀 다운로드
- [ ] 로그인/인증
- [ ] 권한 관리
- [ ] 로딩 인디케이터
- [ ] 에러 바운더리

### 추가 가능한 페이지
- [ ] 대시보드
- [ ] 사용자 관리
- [ ] 설정 관리
- [ ] 로그 조회
