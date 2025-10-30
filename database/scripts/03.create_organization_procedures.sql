/**
 * 조직 관리 Stored Procedures
 * - 조직 CRUD 및 유틸리티 프로시저
 */

-- ============================================
-- 1. 조직 전체 조회
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_get_organizations()
RETURNS TABLE (
  org_code VARCHAR(20),
  org_name VARCHAR(100),
  org_type VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT o.org_code, o.org_name, o.org_type, o.is_active, o.created_at, o.updated_at
  FROM rsms_vue.organizations o
  ORDER BY o.org_code;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_get_organizations() IS '조직 전체 목록 조회';

-- ============================================
-- 2. 조직 상세 조회 (조직 코드)
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_get_organization(
  p_org_code VARCHAR(20)
)
RETURNS TABLE (
  org_code VARCHAR(20),
  org_name VARCHAR(100),
  org_type VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT o.org_code, o.org_name, o.org_type, o.is_active, o.created_at, o.updated_at
  FROM rsms_vue.organizations o
  WHERE o.org_code = p_org_code;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_get_organization(VARCHAR) IS '조직 상세 조회';

-- ============================================
-- 3. 조직 유형별 조회
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_get_organizations_by_type(
  p_org_type VARCHAR(20)
)
RETURNS TABLE (
  org_code VARCHAR(20),
  org_name VARCHAR(100),
  org_type VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT o.org_code, o.org_name, o.org_type, o.is_active, o.created_at, o.updated_at
  FROM rsms_vue.organizations o
  WHERE o.org_type = p_org_type
  ORDER BY o.org_code;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_get_organizations_by_type(VARCHAR) IS '조직 유형별 조회';

-- ============================================
-- 4. 활성화 상태별 조회
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_get_organizations_by_status(
  p_is_active BOOLEAN
)
RETURNS TABLE (
  org_code VARCHAR(20),
  org_name VARCHAR(100),
  org_type VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT o.org_code, o.org_name, o.org_type, o.is_active, o.created_at, o.updated_at
  FROM rsms_vue.organizations o
  WHERE o.is_active = p_is_active
  ORDER BY o.org_code;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_get_organizations_by_status(BOOLEAN) IS '활성화 상태별 조직 조회';

-- ============================================
-- 5. 조직 생성
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_create_organization(
  p_org_code VARCHAR(20),
  p_org_name VARCHAR(100),
  p_org_type VARCHAR(20)
)
RETURNS TABLE (
  org_code VARCHAR(20),
  org_name VARCHAR(100),
  org_type VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO rsms_vue.organizations (org_code, org_name, org_type)
  VALUES (p_org_code, p_org_name, p_org_type)
  RETURNING organizations.org_code, organizations.org_name, organizations.org_type,
            organizations.is_active, organizations.created_at, organizations.updated_at;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_create_organization(VARCHAR, VARCHAR, VARCHAR) IS '조직 생성';

-- ============================================
-- 6. 조직 수정
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_update_organization(
  p_org_code VARCHAR(20),
  p_org_name VARCHAR(100),
  p_org_type VARCHAR(20),
  p_is_active BOOLEAN
)
RETURNS TABLE (
  org_code VARCHAR(20),
  org_name VARCHAR(100),
  org_type VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  UPDATE rsms_vue.organizations
  SET org_name = p_org_name,
      org_type = p_org_type,
      is_active = p_is_active,
      updated_at = CURRENT_TIMESTAMP
  WHERE organizations.org_code = p_org_code
  RETURNING organizations.org_code, organizations.org_name, organizations.org_type,
            organizations.is_active, organizations.created_at, organizations.updated_at;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_update_organization(VARCHAR, VARCHAR, VARCHAR, BOOLEAN) IS '조직 수정';

-- ============================================
-- 7. 조직 삭제
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_delete_organization(
  p_org_code VARCHAR(20)
)
RETURNS TABLE (
  org_code VARCHAR(20),
  org_name VARCHAR(100),
  org_type VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  DELETE FROM rsms_vue.organizations
  WHERE organizations.org_code = p_org_code
  RETURNING organizations.org_code, organizations.org_name, organizations.org_type,
            organizations.is_active, organizations.created_at, organizations.updated_at;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_delete_organization(VARCHAR) IS '조직 삭제';

-- ============================================
-- 8. 조직 존재 여부 확인
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_check_organization_exists(
  p_org_code VARCHAR(20)
)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM rsms_vue.organizations
    WHERE org_code = p_org_code
  ) INTO v_exists;

  RETURN v_exists;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_check_organization_exists(VARCHAR) IS '조직 존재 여부 확인';

-- ============================================
-- 9. 조직에 속한 직책 수 조회
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_count_positions_by_org(
  p_org_code VARCHAR(20)
)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM rsms_vue.positions
  WHERE org_code = p_org_code;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_count_positions_by_org(VARCHAR) IS '조직에 속한 직책 수 조회';

-- ============================================
-- 테스트 쿼리
-- ============================================

-- 전체 조회 테스트
-- SELECT * FROM rsms_vue.sp_get_organizations();

-- 상세 조회 테스트
-- SELECT * FROM rsms_vue.sp_get_organization('HEAD001');

-- 유형별 조회 테스트
-- SELECT * FROM rsms_vue.sp_get_organizations_by_type('dept');

-- 존재 여부 확인 테스트
-- SELECT rsms_vue.sp_check_organization_exists('HEAD001');

-- 직책 수 조회 테스트
-- SELECT rsms_vue.sp_count_positions_by_org('HEAD001');
