-- =====================================================
-- RSMS_VUE 스키마 생성
-- =====================================================
-- 설명: Vue + Node.js + PostgreSQL 파일럿 프로젝트
-- 작성일: 2025-10-30
-- 목적: 직책관리, 조직관리 CRUD 구현
-- =====================================================

-- 스키마 생성
CREATE SCHEMA IF NOT EXISTS rsms_vue;

-- 현재 스키마 확인
SELECT current_schema();

-- 스키마 설명
COMMENT ON SCHEMA rsms_vue IS 'RSMS Vue.js 파일럿 프로젝트 스키마';

-- =====================================================
-- 공통 함수: updated_at 자동 갱신
-- =====================================================
CREATE OR REPLACE FUNCTION rsms_vue.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rsms_vue.update_updated_at_column() IS 'UPDATE 시 updated_at 컬럼 자동 갱신';

-- 스크립트 완료
