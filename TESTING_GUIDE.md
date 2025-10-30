# 🧪 RSMS_VUE 테스트 가이드

## API 테스트 (Postman / curl)

### 1. 헬스체크
```bash
# GET /health
curl http://localhost:3000/health

# 예상 응답:
{
  "success": true,
  "message": "RSMS Vue Backend API Server is running",
  "timestamp": "2025-01-21T10:30:00.000Z",
  "environment": "development"
}
```

---

## 조직관리 API 테스트

### 1. 조직 목록 조회
```bash
# GET /api/organizations
curl http://localhost:3000/api/organizations

# 예상 응답:
{
  "success": true,
  "data": [
    {
      "org_code": "HEAD1010",
      "org_name": "경영본부",
      "org_type": "head",
      "is_active": true,
      "created_at": "2025-01-21T00:00:00.000Z",
      "updated_at": "2025-01-21T00:00:00.000Z"
    }
  ]
}
```

### 2. 조직 생성
```bash
# POST /api/organizations
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "org_code": "DEPT1020",
    "org_name": "IT개발팀",
    "org_type": "dept"
  }'

# 예상 응답:
{
  "success": true,
  "data": {
    "org_code": "DEPT1020",
    "org_name": "IT개발팀",
    "org_type": "dept",
    "is_active": true,
    "created_at": "2025-01-21T10:35:00.000Z",
    "updated_at": "2025-01-21T10:35:00.000Z"
  }
}
```

### 3. 조직 생성 실패 (유효성 검사)
```bash
# 조직코드 누락
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "org_name": "테스트부서",
    "org_type": "dept"
  }'

# 예상 응답:
{
  "success": false,
  "message": "조직코드, 조직명, 조직유형은 필수 입력값입니다."
}
```

```bash
# 조직코드 형식 오류 (소문자 사용)
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type": application/json" \
  -d '{
    "org_code": "dept1030",
    "org_name": "테스트부서",
    "org_type": "dept"
  }'

# 예상 응답:
{
  "success": false,
  "message": "조직코드는 영문 대문자와 숫자만 사용할 수 있습니다."
}
```

```bash
# 조직유형 값 오류
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "org_code": "DEPT1030",
    "org_name": "테스트부서",
    "org_type": "invalid"
  }'

# 예상 응답:
{
  "success": false,
  "message": "조직유형은 head, dept, branch 중 하나여야 합니다."
}
```

### 4. 조직 수정
```bash
# PUT /api/organizations/:orgCode
curl -X PUT http://localhost:3000/api/organizations/DEPT1020 \
  -H "Content-Type: application/json" \
  -d '{
    "org_name": "IT개발팀 (수정)",
    "org_type": "dept",
    "is_active": false
  }'

# 예상 응답:
{
  "success": true,
  "data": {
    "org_code": "DEPT1020",
    "org_name": "IT개발팀 (수정)",
    "org_type": "dept",
    "is_active": false,
    "created_at": "2025-01-21T10:35:00.000Z",
    "updated_at": "2025-01-21T10:40:00.000Z"
  }
}
```

### 5. 조직 삭제
```bash
# DELETE /api/organizations/:orgCode
curl -X DELETE http://localhost:3000/api/organizations/DEPT1020

# 예상 응답:
{
  "success": true,
  "message": "조직이 삭제되었습니다"
}
```

### 6. 조직 상세 조회 (존재하지 않음)
```bash
# GET /api/organizations/:orgCode
curl http://localhost:3000/api/organizations/NOTEXIST

# 예상 응답:
{
  "success": false,
  "message": "조직을 찾을 수 없습니다"
}
```

---

## 직책관리 API 테스트

### 1. 직책 목록 조회
```bash
# GET /api/positions
curl http://localhost:3000/api/positions

# 예상 응답:
{
  "success": true,
  "data": [
    {
      "position_id": 1,
      "position_code": "CEO",
      "position_name": "대표이사",
      "org_code": "HEAD1010",
      "org_name": "경영본부",
      "is_active": true,
      "created_at": "2025-01-21T00:00:00.000Z",
      "updated_at": "2025-01-21T00:00:00.000Z"
    }
  ]
}
```

### 2. 직책 생성
```bash
# POST /api/positions
curl -X POST http://localhost:3000/api/positions \
  -H "Content-Type: application/json" \
  -d '{
    "position_code": "DEV_MGR",
    "position_name": "개발팀장",
    "org_code": "HEAD1010"
  }'

# 예상 응답:
{
  "success": true,
  "data": {
    "position_id": 4,
    "position_code": "DEV_MGR",
    "position_name": "개발팀장",
    "org_code": "HEAD1010",
    "is_active": true,
    "created_at": "2025-01-21T10:50:00.000Z",
    "updated_at": "2025-01-21T10:50:00.000Z"
  }
}
```

### 3. 직책 생성 실패 (유효성 검사)
```bash
# 직책코드 형식 오류 (소문자 사용)
curl -X POST http://localhost:3000/api/positions \
  -H "Content-Type: application/json" \
  -d '{
    "position_code": "dev_mgr",
    "position_name": "개발팀장",
    "org_code": "HEAD1010"
  }'

# 예상 응답:
{
  "success": false,
  "message": "직책코드는 영문 대문자, 숫자, 언더스코어만 사용할 수 있습니다."
}
```

### 4. 직책 수정
```bash
# PUT /api/positions/:positionId
curl -X PUT http://localhost:3000/api/positions/4 \
  -H "Content-Type: application/json" \
  -d '{
    "position_code": "DEV_MGR",
    "position_name": "개발팀장 (수정)",
    "org_code": "HEAD1010",
    "is_active": false
  }'

# 예상 응답:
{
  "success": true,
  "data": {
    "position_id": 4,
    "position_code": "DEV_MGR",
    "position_name": "개발팀장 (수정)",
    "org_code": "HEAD1010",
    "is_active": false,
    "created_at": "2025-01-21T10:50:00.000Z",
    "updated_at": "2025-01-21T10:55:00.000Z"
  }
}
```

### 5. 직책 삭제
```bash
# DELETE /api/positions/:positionId
curl -X DELETE http://localhost:3000/api/positions/4

# 예상 응답:
{
  "success": true,
  "message": "직책이 삭제되었습니다"
}
```

---

## Frontend 기능 테스트

### 조직관리 화면 (http://localhost:5173/organizations)

#### 1. 조직 목록 조회
- [x] 페이지 로드 시 자동으로 조직 목록 표시
- [x] 조직코드, 조직명, 조직유형, 활성화, 생성일시 컬럼 표시
- [x] 조직유형이 한글로 표시 (head → 본부, dept → 부서, branch → 지점)

#### 2. 조직 등록
- [x] "조직 등록" 버튼 클릭 → 다이얼로그 열림
- [x] 조직코드, 조직명, 조직유형 입력
- [x] "확인" 버튼 클릭 → 조직 생성 성공 메시지
- [x] 다이얼로그 닫힘 → 목록 새로고침

#### 3. 조직 수정
- [x] 특정 조직의 "수정" 버튼 클릭 → 다이얼로그 열림
- [x] 기존 데이터 표시
- [x] 조직명, 조직유형, 활성화 상태 수정 가능
- [x] 조직코드는 비활성화 (수정 불가)
- [x] "확인" 버튼 클릭 → 수정 성공 메시지

#### 4. 조직 삭제 (단일)
- [x] 특정 조직의 "삭제" 버튼 클릭 → 확인 다이얼로그
- [x] "확인" 클릭 → 삭제 성공 메시지
- [x] 목록 새로고침

#### 5. 조직 삭제 (다중)
- [x] 체크박스로 여러 조직 선택
- [x] "선택 삭제" 버튼 활성화
- [x] "선택 삭제" 클릭 → 확인 다이얼로그
- [x] "확인" 클릭 → 선택된 모든 조직 삭제

#### 6. 에러 처리
- [x] 네트워크 에러 시 에러 메시지 표시
- [x] 서버 에러 시 에러 메시지 표시
- [x] 유효성 검사 실패 시 에러 메시지 표시

---

### 직책관리 화면 (http://localhost:5173/positions)

#### 1. 직책 목록 조회
- [x] 페이지 로드 시 자동으로 직책 목록 표시
- [x] ID, 직책코드, 직책명, 소속조직, 활성화, 생성일시 컬럼 표시
- [x] 소속조직명이 조인되어 표시

#### 2. 직책 등록
- [x] "직책 등록" 버튼 클릭 → 다이얼로그 열림
- [x] 직책코드, 직책명 입력
- [x] 소속조직 드롭다운에서 선택
- [x] "확인" 버튼 클릭 → 직책 생성 성공 메시지

#### 3. 직책 수정
- [x] 특정 직책의 "수정" 버튼 클릭 → 다이얼로그 열림
- [x] 기존 데이터 표시
- [x] 직책코드, 직책명, 소속조직, 활성화 상태 수정 가능
- [x] "확인" 버튼 클릭 → 수정 성공 메시지

#### 4. 직책 삭제 (단일/다중)
- [x] 조직관리와 동일한 삭제 기능

---

## 데이터베이스 테스트

### 1. 스키마 확인
```sql
-- PostgreSQL 접속 후 실행
\dn

-- 예상 결과:
-- rsms_vue 스키마 존재
```

### 2. 테이블 확인
```sql
-- rsms_vue 스키마의 테이블 목록
\dt rsms_vue.*

-- 예상 결과:
-- rsms_vue.organizations
-- rsms_vue.positions
```

### 3. 샘플 데이터 확인
```sql
-- 조직 데이터
SELECT * FROM rsms_vue.organizations;

-- 예상 결과: 3개 조직 (HEAD1010, DEPT2010, BRANCH3010)

-- 직책 데이터
SELECT * FROM rsms_vue.positions;

-- 예상 결과: 3개 직책 (CEO, CFO, DEV_MANAGER)
```

### 4. 트리거 테스트 (updated_at 자동 업데이트)
```sql
-- 조직 수정
UPDATE rsms_vue.organizations
SET org_name = '테스트 수정'
WHERE org_code = 'HEAD1010';

-- updated_at 확인
SELECT org_code, org_name, created_at, updated_at
FROM rsms_vue.organizations
WHERE org_code = 'HEAD1010';

-- 예상 결과: updated_at이 현재 시간으로 자동 업데이트
```

---

## 성능 테스트

### 1. 응답 시간 테스트
```bash
# 조직 목록 조회 (10회 반복)
for i in {1..10}; do
  time curl -s http://localhost:3000/api/organizations > /dev/null
done

# 예상 결과: 평균 응답 시간 < 100ms
```

### 2. 동시 요청 테스트
```bash
# Apache Bench 사용 (설치 필요: apt install apache2-utils)
ab -n 100 -c 10 http://localhost:3000/api/organizations

# 예상 결과:
# - Requests per second: > 100
# - 모든 요청 성공 (Failed requests: 0)
```

---

## 에러 시나리오 테스트

### 1. Backend 서버 중지 시
- [ ] Frontend에서 "서버에 연결할 수 없습니다" 메시지 표시
- [ ] 브라우저 콘솔에 네트워크 에러 로그 표시

### 2. 데이터베이스 연결 실패 시
- [ ] Backend에서 데이터베이스 연결 실패 로그 표시
- [ ] Frontend에서 "서버 오류가 발생했습니다" 메시지 표시

### 3. 유효성 검사 실패 시
- [ ] Backend에서 400 에러 응답
- [ ] Frontend에서 구체적인 에러 메시지 표시

---

## 회귀 테스트 체크리스트

프로젝트 수정 후 항상 확인해야 할 항목:

### Backend
- [ ] `npm start` 실행 → 서버 정상 시작
- [ ] Health Check API 정상 응답
- [ ] 조직 CRUD 정상 동작
- [ ] 직책 CRUD 정상 동작
- [ ] 유효성 검사 정상 동작
- [ ] 에러 핸들러 정상 동작

### Frontend
- [ ] `npm run dev` 실행 → 개발 서버 정상 시작
- [ ] 조직관리 화면 정상 표시
- [ ] 직책관리 화면 정상 표시
- [ ] CRUD 기능 정상 동작
- [ ] 에러 메시지 정상 표시

### Database
- [ ] 스키마 존재
- [ ] 테이블 존재
- [ ] 샘플 데이터 존재
- [ ] 트리거 정상 동작

---

## 버그 리포트 템플릿

버그 발견 시 다음 정보를 포함하여 리포트:

```
제목: [버그] 간단한 버그 설명

환경:
- OS:
- Node.js 버전:
- PostgreSQL 버전:

재현 단계:
1.
2.
3.

예상 동작:


실제 동작:


스크린샷:


에러 로그:

```

---

## 문의

테스트 중 문제가 발생하면 다음을 확인하세요:
1. QUICK_START.md - 빠른 시작 가이드
2. SETUP_GUIDE.md - 상세 설치 가이드
3. PROJECT_STRUCTURE.md - 프로젝트 구조 설명
