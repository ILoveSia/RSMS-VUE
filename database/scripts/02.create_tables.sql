-- =====================================================
-- RSMS_VUE 기본 테이블 생성 (파일럿용)
-- =====================================================

-- 1. 조직 테이블
CREATE TABLE rsms_vue.organizations (
  org_code VARCHAR(20) PRIMARY KEY,
  org_name VARCHAR(100) NOT NULL,
  org_type VARCHAR(10) NOT NULL, -- 'head', 'dept', 'branch'
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. 직책 테이블
CREATE TABLE rsms_vue.positions (
  position_id SERIAL PRIMARY KEY,
  position_code VARCHAR(20) NOT NULL UNIQUE,
  position_name VARCHAR(100) NOT NULL,
  org_code VARCHAR(20) REFERENCES rsms_vue.organizations(org_code),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 트리거
CREATE TRIGGER trigger_orgs_updated_at
  BEFORE UPDATE ON rsms_vue.organizations
  FOR EACH ROW
  EXECUTE FUNCTION rsms_vue.update_updated_at_column();

CREATE TRIGGER trigger_positions_updated_at
  BEFORE UPDATE ON rsms_vue.positions
  FOR EACH ROW
  EXECUTE FUNCTION rsms_vue.update_updated_at_column();

-- 샘플 데이터
INSERT INTO rsms_vue.organizations (org_code, org_name, org_type) VALUES
  ('HEAD001', '경영전략본부', 'head'),
  ('DEPT001', '경영전략부', 'dept'),
  ('DEPT002', '리스크관리부', 'dept');

INSERT INTO rsms_vue.positions (position_code, position_name, org_code) VALUES
  ('POS001', '본부장', 'HEAD001'),
  ('POS002', '부서장', 'DEPT001'),
  ('POS003', '팀장', 'DEPT002');
