# PostgreSQL Stored Procedures 가이드

## 개요

RSMS Vue 프로젝트는 데이터 접근 로직을 **PostgreSQL Stored Procedures**를 통해 관리합니다.

### 적용 범위

- **조직 관리**: 9개 Stored Procedures
- **직책 관리**: 10개 Stored Procedures

## 아키텍처

### 데이터 흐름

```
Frontend (Vue.js)
    ↓ API 호출
Backend Routes
    ↓ 라우트 매핑
Backend Controllers
    ↓ 요청/응답 처리
Backend Services
    ↓ 비즈니스 로직
Backend Repositories
    ↓ Stored Procedure 호출
PostgreSQL Database
    ↓ Procedure 실행
    ↓ SQL 쿼리 실행
결과 반환
```

### Repository 구현 방식

```javascript
// backend/repositories/organizationRepository.js
class OrganizationRepository {
  async findAll() {
    // Stored Procedure 호출
    const result = await pool.query(
      `SELECT * FROM rsms_vue.sp_get_organizations()`
    );
    return result.rows;
  }
}
```

## 조직 관리 Stored Procedures

### 1. sp_get_organizations()
**목적**: 전체 조직 목록 조회

**사용 위치**: `organizationRepository.findAll()`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_get_organizations();
```

**반환 컬럼**:
- `org_code` VARCHAR(20)
- `org_name` VARCHAR(100)
- `org_type` VARCHAR(20)
- `is_active` BOOLEAN
- `created_at` TIMESTAMP
- `updated_at` TIMESTAMP

**예제**:
```javascript
// Repository
async findAll() {
  const result = await pool.query(`SELECT * FROM rsms_vue.sp_get_organizations()`);
  return result.rows;
}
```

---

### 2. sp_get_organization(p_org_code)
**목적**: 특정 조직 상세 조회

**파라미터**:
- `p_org_code` VARCHAR(20) - 조직 코드

**사용 위치**: `organizationRepository.findByCode(orgCode)`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_get_organization('HEAD001');
```

**예제**:
```javascript
// Repository
async findByCode(orgCode) {
  const result = await pool.query(
    `SELECT * FROM rsms_vue.sp_get_organization($1)`,
    [orgCode]
  );
  return result.rows[0] || null;
}
```

---

### 3. sp_get_organizations_by_type(p_org_type)
**목적**: 조직 유형별 조회

**파라미터**:
- `p_org_type` VARCHAR(20) - 조직 유형 (head, dept, branch)

**사용 위치**: `organizationRepository.findByType(orgType)`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_get_organizations_by_type('dept');
```

---

### 4. sp_get_organizations_by_status(p_is_active)
**목적**: 활성화 상태별 조회

**파라미터**:
- `p_is_active` BOOLEAN - 활성화 상태

**사용 위치**: `organizationRepository.findByActiveStatus(isActive)`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_get_organizations_by_status(true);
```

---

### 5. sp_create_organization(p_org_code, p_org_name, p_org_type)
**목적**: 조직 생성

**파라미터**:
- `p_org_code` VARCHAR(20) - 조직 코드
- `p_org_name` VARCHAR(100) - 조직명
- `p_org_type` VARCHAR(20) - 조직 유형

**사용 위치**: `organizationRepository.create(data)`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_create_organization('DEPT004', '재무부', 'dept');
```

**예제**:
```javascript
// Repository
async create(data) {
  const result = await pool.query(
    `SELECT * FROM rsms_vue.sp_create_organization($1, $2, $3)`,
    [data.org_code, data.org_name, data.org_type]
  );
  return result.rows[0];
}
```

---

### 6. sp_update_organization(p_org_code, p_org_name, p_org_type, p_is_active)
**목적**: 조직 수정

**파라미터**:
- `p_org_code` VARCHAR(20) - 조직 코드
- `p_org_name` VARCHAR(100) - 조직명
- `p_org_type` VARCHAR(20) - 조직 유형
- `p_is_active` BOOLEAN - 활성화 상태

**사용 위치**: `organizationRepository.update(orgCode, data)`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_update_organization('DEPT004', '재무관리부', 'dept', true);
```

---

### 7. sp_delete_organization(p_org_code)
**목적**: 조직 삭제

**파라미터**:
- `p_org_code` VARCHAR(20) - 조직 코드

**사용 위치**: `organizationRepository.delete(orgCode)`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_delete_organization('DEPT004');
```

---

### 8. sp_check_organization_exists(p_org_code)
**목적**: 조직 존재 여부 확인

**파라미터**:
- `p_org_code` VARCHAR(20) - 조직 코드

**반환**: BOOLEAN

**사용 위치**: `organizationRepository.exists(orgCode)`

**호출 방법**:
```sql
SELECT rsms_vue.sp_check_organization_exists('HEAD001');
```

**예제**:
```javascript
// Repository
async exists(orgCode) {
  const result = await pool.query(
    `SELECT rsms_vue.sp_check_organization_exists($1) as exists`,
    [orgCode]
  );
  return result.rows[0].exists;
}
```

---

### 9. sp_count_positions_by_org(p_org_code)
**목적**: 조직에 속한 직책 수 조회

**파라미터**:
- `p_org_code` VARCHAR(20) - 조직 코드

**반환**: INTEGER

**사용 위치**: `organizationRepository.countPositions(orgCode)`

**호출 방법**:
```sql
SELECT rsms_vue.sp_count_positions_by_org('HEAD001');
```

## 직책 관리 Stored Procedures

### 1. sp_get_positions()
**목적**: 전체 직책 목록 조회 (조직명 포함)

**사용 위치**: `positionRepository.findAll()`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_get_positions();
```

**반환 컬럼**:
- `position_id` INTEGER
- `position_code` VARCHAR(20)
- `position_name` VARCHAR(100)
- `org_code` VARCHAR(20)
- `org_name` VARCHAR(100) - JOIN된 조직명
- `is_active` BOOLEAN
- `created_at` TIMESTAMP
- `updated_at` TIMESTAMP

---

### 2. sp_get_position(p_position_id)
**목적**: 특정 직책 상세 조회

**파라미터**:
- `p_position_id` INTEGER - 직책 ID

**사용 위치**: `positionRepository.findById(positionId)`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_get_position(1);
```

---

### 3. sp_get_position_by_code(p_position_code)
**목적**: 직책 코드로 조회

**파라미터**:
- `p_position_code` VARCHAR(20) - 직책 코드

**사용 위치**: `positionRepository.findByCode(positionCode)`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_get_position_by_code('POS001');
```

---

### 4. sp_get_positions_by_org(p_org_code)
**목적**: 조직별 직책 조회

**파라미터**:
- `p_org_code` VARCHAR(20) - 조직 코드

**사용 위치**: `positionRepository.findByOrganization(orgCode)`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_get_positions_by_org('HEAD001');
```

---

### 5. sp_get_positions_by_status(p_is_active)
**목적**: 활성화 상태별 직책 조회

**파라미터**:
- `p_is_active` BOOLEAN - 활성화 상태

**사용 위치**: `positionRepository.findByActiveStatus(isActive)`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_get_positions_by_status(true);
```

---

### 6. sp_create_position(p_position_code, p_position_name, p_org_code)
**목적**: 직책 생성

**파라미터**:
- `p_position_code` VARCHAR(20) - 직책 코드
- `p_position_name` VARCHAR(100) - 직책명
- `p_org_code` VARCHAR(20) - 조직 코드 (NULL 가능)

**사용 위치**: `positionRepository.create(data)`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_create_position('POS004', '과장', 'DEPT001');
```

---

### 7. sp_update_position(p_position_id, p_position_code, p_position_name, p_org_code, p_is_active)
**목적**: 직책 수정

**파라미터**:
- `p_position_id` INTEGER - 직책 ID
- `p_position_code` VARCHAR(20) - 직책 코드
- `p_position_name` VARCHAR(100) - 직책명
- `p_org_code` VARCHAR(20) - 조직 코드
- `p_is_active` BOOLEAN - 활성화 상태

**사용 위치**: `positionRepository.update(positionId, data)`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_update_position(4, 'POS004', '과장급', 'DEPT001', true);
```

---

### 8. sp_delete_position(p_position_id)
**목적**: 직책 삭제

**파라미터**:
- `p_position_id` INTEGER - 직책 ID

**사용 위치**: `positionRepository.delete(positionId)`

**호출 방법**:
```sql
SELECT * FROM rsms_vue.sp_delete_position(4);
```

---

### 9. sp_check_position_exists(p_position_id)
**목적**: 직책 ID 존재 여부 확인

**파라미터**:
- `p_position_id` INTEGER - 직책 ID

**반환**: BOOLEAN

**사용 위치**: `positionRepository.exists(positionId)`

**호출 방법**:
```sql
SELECT rsms_vue.sp_check_position_exists(1);
```

---

### 10. sp_check_position_code_exists(p_position_code, p_exclude_id)
**목적**: 직책 코드 중복 확인

**파라미터**:
- `p_position_code` VARCHAR(20) - 직책 코드
- `p_exclude_id` INTEGER - 제외할 직책 ID (NULL 가능, 수정 시 사용)

**반환**: BOOLEAN

**사용 위치**: `positionRepository.codeExists(positionCode, excludeId)`

**호출 방법**:
```sql
-- 신규 생성 시
SELECT rsms_vue.sp_check_position_code_exists('POS001', NULL);

-- 수정 시 (자기 자신 제외)
SELECT rsms_vue.sp_check_position_code_exists('POS001', 1);
```

**예제**:
```javascript
// Repository
async codeExists(positionCode, excludeId = null) {
  const result = await pool.query(
    `SELECT rsms_vue.sp_check_position_code_exists($1, $2) as exists`,
    [positionCode, excludeId]
  );
  return result.rows[0].exists;
}
```

## Stored Procedure 설치

### 설치 순서

1. **스키마 및 테이블 생성** (기존)
```bash
psql -h HOST -p PORT -U USER -d DATABASE -f database/scripts/01.create_schema.sql
psql -h HOST -p PORT -U USER -d DATABASE -f database/scripts/02.create_tables.sql
```

2. **조직 관리 Procedures 생성**
```bash
psql -h HOST -p PORT -U USER -d DATABASE -f database/scripts/03.create_organization_procedures.sql
```

3. **직책 관리 Procedures 생성**
```bash
psql -h HOST -p PORT -U USER -d DATABASE -f database/scripts/04.create_position_procedures.sql
```

### 예제 (실제 환경)
```bash
# 환경 변수 설정
export PGPASSWORD="your_password"
export DB_HOST="172.21.174.2"
export DB_PORT="5432"
export DB_USER="postgres"
export DB_NAME="postgres"

# Procedures 생성
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME \
  -f database/scripts/03.create_organization_procedures.sql

psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME \
  -f database/scripts/04.create_position_procedures.sql
```

## Stored Procedure 테스트

### PostgreSQL에서 직접 테스트

```sql
-- 조직 전체 조회
SELECT * FROM rsms_vue.sp_get_organizations();

-- 조직 상세 조회
SELECT * FROM rsms_vue.sp_get_organization('HEAD001');

-- 조직 생성
SELECT * FROM rsms_vue.sp_create_organization('TEST001', '테스트부서', 'dept');

-- 조직 존재 확인
SELECT rsms_vue.sp_check_organization_exists('TEST001');

-- 조직 삭제
SELECT * FROM rsms_vue.sp_delete_organization('TEST001');

-- 직책 전체 조회
SELECT * FROM rsms_vue.sp_get_positions();

-- 직책 생성
SELECT * FROM rsms_vue.sp_create_position('TEST_POS', '테스트직책', 'HEAD001');
```

### API를 통한 테스트

```bash
# 조직 목록 조회
curl http://localhost:3000/api/organizations

# 조직 상세 조회
curl http://localhost:3000/api/organizations/HEAD001

# 조직 생성
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{"org_code":"TEST001","org_name":"테스트부서","org_type":"dept"}'

# 직책 목록 조회
curl http://localhost:3000/api/positions

# 직책 생성
curl -X POST http://localhost:3000/api/positions \
  -H "Content-Type: application/json" \
  -d '{"position_code":"TEST_POS","position_name":"테스트직책","org_code":"HEAD001"}'
```

## 장점

### 1. 성능 향상
- **쿼리 계획 캐싱**: PostgreSQL이 Procedure의 실행 계획을 캐시
- **네트워크 왕복 감소**: 복잡한 쿼리도 한 번의 호출로 처리
- **컴파일 최적화**: Procedure가 사전 컴파일되어 실행 속도 향상

### 2. 보안 강화
- **직접 테이블 접근 차단**: 애플리케이션은 Procedure만 호출 가능
- **권한 관리 간소화**: Procedure에만 EXECUTE 권한 부여
- **SQL Injection 방지**: 파라미터화된 쿼리 사용

### 3. 유지보수 향상
- **중앙 관리**: 비즈니스 로직이 DB에 집중
- **재사용성**: 다른 애플리케이션에서도 동일 Procedure 사용 가능
- **버전 관리**: SQL 스크립트로 버전 관리 용이

### 4. 일관성 보장
- **트랜잭션 관리**: Procedure 내에서 트랜잭션 처리
- **데이터 무결성**: DB 레벨에서 제약 조건 적용
- **에러 처리**: 표준화된 에러 처리

## 새로운 Stored Procedure 추가하기

### 1. SQL 파일 작성

```sql
-- database/scripts/05.create_custom_procedures.sql

CREATE OR REPLACE FUNCTION rsms_vue.sp_custom_function(
  p_param1 VARCHAR(20)
)
RETURNS TABLE (
  column1 VARCHAR(20),
  column2 VARCHAR(100)
) AS $$
BEGIN
  RETURN QUERY
  SELECT col1, col2
  FROM rsms_vue.your_table
  WHERE condition = p_param1;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_custom_function(VARCHAR) IS '사용자 정의 함수 설명';
```

### 2. PostgreSQL에 적용

```bash
psql -h HOST -p PORT -U USER -d DATABASE -f database/scripts/05.create_custom_procedures.sql
```

### 3. Repository에 메서드 추가

```javascript
// repositories/yourRepository.js
async customMethod(param1) {
  const result = await pool.query(
    `SELECT * FROM ${SCHEMA}.sp_custom_function($1)`,
    [param1]
  );
  return result.rows;
}
```

### 4. Service에서 호출

```javascript
// services/yourService.js
async getCustomData(param1) {
  return await yourRepository.customMethod(param1);
}
```

## 문제 해결

### Procedure가 실행되지 않을 때

```sql
-- Procedure 존재 확인
\df rsms_vue.sp_get_organizations

-- Procedure 삭제 후 재생성
DROP FUNCTION IF EXISTS rsms_vue.sp_get_organizations();
```

### 권한 오류 발생 시

```sql
-- Procedure 실행 권한 부여
GRANT EXECUTE ON FUNCTION rsms_vue.sp_get_organizations() TO postgres;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA rsms_vue TO postgres;
```

### Procedure 수정 시

```sql
-- CREATE OR REPLACE 사용
CREATE OR REPLACE FUNCTION rsms_vue.sp_get_organizations()
RETURNS TABLE (...) AS $$
BEGIN
  -- 수정된 로직
END;
$$ LANGUAGE plpgsql;
```

## 마이그레이션 가이드

### 기존 프로젝트에 Stored Procedures 적용하기

1. **Procedure SQL 파일 작성**
2. **PostgreSQL에 Procedure 생성**
3. **Repository 메서드 하나씩 변경**
4. **각 메서드별로 테스트**
5. **모든 메서드 변경 완료 후 통합 테스트**

### 롤백 방법

```sql
-- Procedure 삭제
DROP FUNCTION IF EXISTS rsms_vue.sp_get_organizations();
DROP FUNCTION IF EXISTS rsms_vue.sp_create_organization(VARCHAR, VARCHAR, VARCHAR);
-- ... 모든 Procedures 삭제

-- Repository에서 다시 SQL 쿼리 직접 작성
```

## 모범 사례

### 1. Naming Convention

- **Procedure 이름**: `sp_` 접두사 사용
- **파라미터**: `p_` 접두사 사용
- **변수**: `v_` 접두사 사용

### 2. 주석 작성

```sql
COMMENT ON FUNCTION rsms_vue.sp_get_organizations() IS '조직 전체 목록 조회';
```

### 3. 에러 처리

```sql
BEGIN
  -- 로직
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION '중복된 코드입니다';
  WHEN foreign_key_violation THEN
    RAISE EXCEPTION '참조하는 데이터가 존재하지 않습니다';
END;
```

### 4. 트랜잭션 관리

```sql
BEGIN
  -- 여러 작업
  INSERT ...
  UPDATE ...

  -- 성공 시 자동 커밋
  -- 실패 시 자동 롤백
END;
```

---

**작성일**: 2025-10-30
**작성자**: Claude Code Assistant
**프로젝트**: RSMS Vue
**버전**: 1.2.0
