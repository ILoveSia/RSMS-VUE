/**
 * 조직 Repository
 * - 조직 데이터 접근 로직
 * - PostgreSQL Stored Procedure 호출
 */

const pool = require('../config/database');
const config = require('../config');

const SCHEMA = config.database.schema;

/**
 * 조직 Repository 클래스
 * - 모든 데이터 접근은 Stored Procedure를 통해 이루어짐
 */
class OrganizationRepository {
  /**
   * 모든 조직 조회
   * @returns {Promise<Array>} 조직 목록
   */
  async findAll() {
    const result = await pool.query(`SELECT * FROM ${SCHEMA}.sp_get_organizations()`);
    return result.rows;
  }

  /**
   * 조직 코드로 조회
   * @param {string} orgCode - 조직 코드
   * @returns {Promise<Object|null>} 조직 객체 또는 null
   */
  async findByCode(orgCode) {
    const result = await pool.query(
      `SELECT * FROM ${SCHEMA}.sp_get_organization($1)`,
      [orgCode]
    );
    return result.rows[0] || null;
  }

  /**
   * 조직 유형으로 조회
   * @param {string} orgType - 조직 유형 (head|dept|branch)
   * @returns {Promise<Array>} 조직 목록
   */
  async findByType(orgType) {
    const result = await pool.query(
      `SELECT * FROM ${SCHEMA}.sp_get_organizations_by_type($1)`,
      [orgType]
    );
    return result.rows;
  }

  /**
   * 활성화 상태로 조회
   * @param {boolean} isActive - 활성화 상태
   * @returns {Promise<Array>} 조직 목록
   */
  async findByActiveStatus(isActive) {
    const result = await pool.query(
      `SELECT * FROM ${SCHEMA}.sp_get_organizations_by_status($1)`,
      [isActive]
    );
    return result.rows;
  }

  /**
   * 조직 생성
   * @param {Object} data - 조직 데이터
   * @param {string} data.org_code - 조직 코드
   * @param {string} data.org_name - 조직명
   * @param {string} data.org_type - 조직 유형
   * @returns {Promise<Object>} 생성된 조직
   */
  async create(data) {
    const result = await pool.query(
      `SELECT * FROM ${SCHEMA}.sp_create_organization($1, $2, $3)`,
      [data.org_code, data.org_name, data.org_type]
    );
    return result.rows[0];
  }

  /**
   * 조직 수정
   * @param {string} orgCode - 조직 코드
   * @param {Object} data - 수정할 데이터
   * @returns {Promise<Object|null>} 수정된 조직 또는 null
   */
  async update(orgCode, data) {
    const result = await pool.query(
      `SELECT * FROM ${SCHEMA}.sp_update_organization($1, $2, $3, $4)`,
      [orgCode, data.org_name, data.org_type, data.is_active]
    );
    return result.rows[0] || null;
  }

  /**
   * 조직 삭제
   * @param {string} orgCode - 조직 코드
   * @returns {Promise<Object|null>} 삭제된 조직 또는 null
   */
  async delete(orgCode) {
    const result = await pool.query(
      `SELECT * FROM ${SCHEMA}.sp_delete_organization($1)`,
      [orgCode]
    );
    return result.rows[0] || null;
  }

  /**
   * 조직 코드 존재 여부 확인
   * @param {string} orgCode - 조직 코드
   * @returns {Promise<boolean>} 존재 여부
   */
  async exists(orgCode) {
    const result = await pool.query(
      `SELECT ${SCHEMA}.sp_check_organization_exists($1) as exists`,
      [orgCode]
    );
    return result.rows[0].exists;
  }

  /**
   * 조직에 속한 직책 수 조회
   * @param {string} orgCode - 조직 코드
   * @returns {Promise<number>} 직책 수
   */
  async countPositions(orgCode) {
    const result = await pool.query(
      `SELECT ${SCHEMA}.sp_count_positions_by_org($1) as count`,
      [orgCode]
    );
    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = new OrganizationRepository();
