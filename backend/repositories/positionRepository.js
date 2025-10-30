/**
 * 직책 Repository
 * - 직책 데이터 접근 로직
 * - PostgreSQL Stored Procedure 호출
 */

const pool = require('../config/database');
const config = require('../config');

const SCHEMA = config.database.schema;

/**
 * 직책 Repository 클래스
 * - 모든 데이터 접근은 Stored Procedure를 통해 이루어짐
 */
class PositionRepository {
  /**
   * 모든 직책 조회 (조직명 포함)
   * @returns {Promise<Array>} 직책 목록
   */
  async findAll() {
    const result = await pool.query(`SELECT * FROM ${SCHEMA}.sp_get_positions()`);
    return result.rows;
  }

  /**
   * 직책 ID로 조회
   * @param {number} positionId - 직책 ID
   * @returns {Promise<Object|null>} 직책 객체 또는 null
   */
  async findById(positionId) {
    const result = await pool.query(
      `SELECT * FROM ${SCHEMA}.sp_get_position($1)`,
      [positionId]
    );
    return result.rows[0] || null;
  }

  /**
   * 직책 코드로 조회
   * @param {string} positionCode - 직책 코드
   * @returns {Promise<Object|null>} 직책 객체 또는 null
   */
  async findByCode(positionCode) {
    const result = await pool.query(
      `SELECT * FROM ${SCHEMA}.sp_get_position_by_code($1)`,
      [positionCode]
    );
    return result.rows[0] || null;
  }

  /**
   * 조직별 직책 조회
   * @param {string} orgCode - 조직 코드
   * @returns {Promise<Array>} 직책 목록
   */
  async findByOrganization(orgCode) {
    const result = await pool.query(
      `SELECT * FROM ${SCHEMA}.sp_get_positions_by_org($1)`,
      [orgCode]
    );
    return result.rows;
  }

  /**
   * 활성화 상태로 조회
   * @param {boolean} isActive - 활성화 상태
   * @returns {Promise<Array>} 직책 목록
   */
  async findByActiveStatus(isActive) {
    const result = await pool.query(
      `SELECT * FROM ${SCHEMA}.sp_get_positions_by_status($1)`,
      [isActive]
    );
    return result.rows;
  }

  /**
   * 직책 생성
   * @param {Object} data - 직책 데이터
   * @param {string} data.position_code - 직책 코드
   * @param {string} data.position_name - 직책명
   * @param {string} data.org_code - 조직 코드
   * @returns {Promise<Object>} 생성된 직책
   */
  async create(data) {
    const result = await pool.query(
      `SELECT * FROM ${SCHEMA}.sp_create_position($1, $2, $3)`,
      [data.position_code, data.position_name, data.org_code]
    );
    return result.rows[0];
  }

  /**
   * 직책 수정
   * @param {number} positionId - 직책 ID
   * @param {Object} data - 수정할 데이터
   * @returns {Promise<Object|null>} 수정된 직책 또는 null
   */
  async update(positionId, data) {
    const result = await pool.query(
      `SELECT * FROM ${SCHEMA}.sp_update_position($1, $2, $3, $4, $5)`,
      [positionId, data.position_code, data.position_name, data.org_code, data.is_active]
    );
    return result.rows[0] || null;
  }

  /**
   * 직책 삭제
   * @param {number} positionId - 직책 ID
   * @returns {Promise<Object|null>} 삭제된 직책 또는 null
   */
  async delete(positionId) {
    const result = await pool.query(
      `SELECT * FROM ${SCHEMA}.sp_delete_position($1)`,
      [positionId]
    );
    return result.rows[0] || null;
  }

  /**
   * 직책 ID 존재 여부 확인
   * @param {number} positionId - 직책 ID
   * @returns {Promise<boolean>} 존재 여부
   */
  async exists(positionId) {
    const result = await pool.query(
      `SELECT ${SCHEMA}.sp_check_position_exists($1) as exists`,
      [positionId]
    );
    return result.rows[0].exists;
  }

  /**
   * 직책 코드 존재 여부 확인
   * @param {string} positionCode - 직책 코드
   * @param {number} excludeId - 제외할 직책 ID (수정 시 사용)
   * @returns {Promise<boolean>} 존재 여부
   */
  async codeExists(positionCode, excludeId = null) {
    const result = await pool.query(
      `SELECT ${SCHEMA}.sp_check_position_code_exists($1, $2) as exists`,
      [positionCode, excludeId]
    );
    return result.rows[0].exists;
  }
}

module.exports = new PositionRepository();
