/**
 * 직책 관리 Stored Procedures
 * - 직책 CRUD 및 유틸리티 프로시저
 */

-- ============================================
-- 1. 직책 전체 조회 (조직명 포함)
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_get_positions()
RETURNS TABLE (
  position_id INTEGER,
  position_code VARCHAR(20),
  position_name VARCHAR(100),
  org_code VARCHAR(20),
  org_name VARCHAR(100),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.position_id, p.position_code, p.position_name, p.org_code,
         o.org_name, p.is_active, p.created_at, p.updated_at
  FROM rsms_vue.positions p
  LEFT JOIN rsms_vue.organizations o ON p.org_code = o.org_code
  ORDER BY p.position_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_get_positions() IS '직책 전체 목록 조회';

-- ============================================
-- 2. 직책 상세 조회 (ID)
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_get_position(
  p_position_id INTEGER
)
RETURNS TABLE (
  position_id INTEGER,
  position_code VARCHAR(20),
  position_name VARCHAR(100),
  org_code VARCHAR(20),
  org_name VARCHAR(100),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.position_id, p.position_code, p.position_name, p.org_code,
         o.org_name, p.is_active, p.created_at, p.updated_at
  FROM rsms_vue.positions p
  LEFT JOIN rsms_vue.organizations o ON p.org_code = o.org_code
  WHERE p.position_id = p_position_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_get_position(INTEGER) IS '직책 상세 조회';

-- ============================================
-- 3. 직책 코드로 조회
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_get_position_by_code(
  p_position_code VARCHAR(20)
)
RETURNS TABLE (
  position_id INTEGER,
  position_code VARCHAR(20),
  position_name VARCHAR(100),
  org_code VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.position_id, p.position_code, p.position_name, p.org_code,
         p.is_active, p.created_at, p.updated_at
  FROM rsms_vue.positions p
  WHERE p.position_code = p_position_code;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_get_position_by_code(VARCHAR) IS '직책 코드로 조회';

-- ============================================
-- 4. 조직별 직책 조회
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_get_positions_by_org(
  p_org_code VARCHAR(20)
)
RETURNS TABLE (
  position_id INTEGER,
  position_code VARCHAR(20),
  position_name VARCHAR(100),
  org_code VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.position_id, p.position_code, p.position_name, p.org_code,
         p.is_active, p.created_at, p.updated_at
  FROM rsms_vue.positions p
  WHERE p.org_code = p_org_code
  ORDER BY p.position_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_get_positions_by_org(VARCHAR) IS '조직별 직책 조회';

-- ============================================
-- 5. 활성화 상태별 조회
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_get_positions_by_status(
  p_is_active BOOLEAN
)
RETURNS TABLE (
  position_id INTEGER,
  position_code VARCHAR(20),
  position_name VARCHAR(100),
  org_code VARCHAR(20),
  org_name VARCHAR(100),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.position_id, p.position_code, p.position_name, p.org_code,
         o.org_name, p.is_active, p.created_at, p.updated_at
  FROM rsms_vue.positions p
  LEFT JOIN rsms_vue.organizations o ON p.org_code = o.org_code
  WHERE p.is_active = p_is_active
  ORDER BY p.position_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_get_positions_by_status(BOOLEAN) IS '활성화 상태별 직책 조회';

-- ============================================
-- 6. 직책 생성
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_create_position(
  p_position_code VARCHAR(20),
  p_position_name VARCHAR(100),
  p_org_code VARCHAR(20) DEFAULT NULL
)
RETURNS TABLE (
  position_id INTEGER,
  position_code VARCHAR(20),
  position_name VARCHAR(100),
  org_code VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO rsms_vue.positions (position_code, position_name, org_code)
  VALUES (p_position_code, p_position_name, p_org_code)
  RETURNING positions.position_id, positions.position_code, positions.position_name,
            positions.org_code, positions.is_active, positions.created_at, positions.updated_at;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_create_position(VARCHAR, VARCHAR, VARCHAR) IS '직책 생성';

-- ============================================
-- 7. 직책 수정
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_update_position(
  p_position_id INTEGER,
  p_position_code VARCHAR(20),
  p_position_name VARCHAR(100),
  p_org_code VARCHAR(20),
  p_is_active BOOLEAN
)
RETURNS TABLE (
  position_id INTEGER,
  position_code VARCHAR(20),
  position_name VARCHAR(100),
  org_code VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  UPDATE rsms_vue.positions
  SET position_code = p_position_code,
      position_name = p_position_name,
      org_code = p_org_code,
      is_active = p_is_active,
      updated_at = CURRENT_TIMESTAMP
  WHERE positions.position_id = p_position_id
  RETURNING positions.position_id, positions.position_code, positions.position_name,
            positions.org_code, positions.is_active, positions.created_at, positions.updated_at;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_update_position(INTEGER, VARCHAR, VARCHAR, VARCHAR, BOOLEAN) IS '직책 수정';

-- ============================================
-- 8. 직책 삭제
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_delete_position(
  p_position_id INTEGER
)
RETURNS TABLE (
  position_id INTEGER,
  position_code VARCHAR(20),
  position_name VARCHAR(100),
  org_code VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  DELETE FROM rsms_vue.positions
  WHERE positions.position_id = p_position_id
  RETURNING positions.position_id, positions.position_code, positions.position_name,
            positions.org_code, positions.is_active, positions.created_at, positions.updated_at;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_delete_position(INTEGER) IS '직책 삭제';

-- ============================================
-- 9. 직책 ID 존재 여부 확인
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_check_position_exists(
  p_position_id INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM rsms_vue.positions
    WHERE position_id = p_position_id
  ) INTO v_exists;

  RETURN v_exists;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_check_position_exists(INTEGER) IS '직책 ID 존재 여부 확인';

-- ============================================
-- 10. 직책 코드 중복 확인
-- ============================================
CREATE OR REPLACE FUNCTION rsms_vue.sp_check_position_code_exists(
  p_position_code VARCHAR(20),
  p_exclude_id INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  IF p_exclude_id IS NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM rsms_vue.positions
      WHERE position_code = p_position_code
    ) INTO v_exists;
  ELSE
    SELECT EXISTS(
      SELECT 1 FROM rsms_vue.positions
      WHERE position_code = p_position_code
        AND position_id != p_exclude_id
    ) INTO v_exists;
  END IF;

  RETURN v_exists;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.sp_check_position_code_exists(VARCHAR, INTEGER) IS '직책 코드 중복 확인';

-- ============================================
-- 테스트 쿼리
-- ============================================

-- 전체 조회 테스트
-- SELECT * FROM rsms_vue.sp_get_positions();

-- 상세 조회 테스트
-- SELECT * FROM rsms_vue.sp_get_position(1);

-- 조직별 조회 테스트
-- SELECT * FROM rsms_vue.sp_get_positions_by_org('HEAD001');

-- 존재 여부 확인 테스트
-- SELECT rsms_vue.sp_check_position_exists(1);

-- 코드 중복 확인 테스트
-- SELECT rsms_vue.sp_check_position_code_exists('CEO', NULL);
-- SELECT rsms_vue.sp_check_position_code_exists('CEO', 1);
