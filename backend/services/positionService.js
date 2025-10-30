/**
 * 직책 Service
 * - 직책 관련 비즈니스 로직
 * - 데이터 검증 및 변환
 */

const positionRepository = require('../repositories/positionRepository');
const organizationRepository = require('../repositories/organizationRepository');

/**
 * 직책 Service 클래스
 */
class PositionService {
  /**
   * 모든 직책 조회
   * @returns {Promise<Array>} 직책 목록
   */
  async getAllPositions() {
    return await positionRepository.findAll();
  }

  /**
   * 직책 상세 조회
   * @param {number} positionId - 직책 ID
   * @returns {Promise<Object>} 직책 객체
   * @throws {Error} 직책을 찾을 수 없을 경우
   */
  async getPositionById(positionId) {
    const position = await positionRepository.findById(positionId);

    if (!position) {
      const error = new Error('직책을 찾을 수 없습니다');
      error.statusCode = 404;
      throw error;
    }

    return position;
  }

  /**
   * 조직별 직책 조회
   * @param {string} orgCode - 조직 코드
   * @returns {Promise<Array>} 직책 목록
   */
  async getPositionsByOrganization(orgCode) {
    // 조직 존재 여부 확인
    const orgExists = await organizationRepository.exists(orgCode);
    if (!orgExists) {
      const error = new Error('조직을 찾을 수 없습니다');
      error.statusCode = 404;
      throw error;
    }

    return await positionRepository.findByOrganization(orgCode);
  }

  /**
   * 활성화 상태별 조회
   * @param {boolean} isActive - 활성화 상태
   * @returns {Promise<Array>} 직책 목록
   */
  async getPositionsByStatus(isActive) {
    return await positionRepository.findByActiveStatus(isActive);
  }

  /**
   * 직책 생성
   * @param {Object} data - 직책 데이터
   * @returns {Promise<Object>} 생성된 직책
   * @throws {Error} 중복된 직책 코드이거나 조직이 없을 경우
   */
  async createPosition(data) {
    // 조직 존재 여부 확인
    if (data.org_code) {
      const orgExists = await organizationRepository.exists(data.org_code);
      if (!orgExists) {
        const error = new Error('존재하지 않는 조직입니다');
        error.statusCode = 400;
        throw error;
      }
    }

    // 직책 코드 중복 확인
    const codeExists = await positionRepository.codeExists(data.position_code);
    if (codeExists) {
      const error = new Error('이미 존재하는 직책코드입니다');
      error.statusCode = 409;
      throw error;
    }

    return await positionRepository.create(data);
  }

  /**
   * 직책 수정
   * @param {number} positionId - 직책 ID
   * @param {Object} data - 수정할 데이터
   * @returns {Promise<Object>} 수정된 직책
   * @throws {Error} 직책을 찾을 수 없거나 중복된 코드일 경우
   */
  async updatePosition(positionId, data) {
    // 존재 여부 확인
    const exists = await positionRepository.exists(positionId);
    if (!exists) {
      const error = new Error('직책을 찾을 수 없습니다');
      error.statusCode = 404;
      throw error;
    }

    // 조직 존재 여부 확인
    if (data.org_code) {
      const orgExists = await organizationRepository.exists(data.org_code);
      if (!orgExists) {
        const error = new Error('존재하지 않는 조직입니다');
        error.statusCode = 400;
        throw error;
      }
    }

    // 직책 코드 중복 확인 (자신 제외)
    if (data.position_code) {
      const codeExists = await positionRepository.codeExists(
        data.position_code,
        positionId
      );
      if (codeExists) {
        const error = new Error('이미 존재하는 직책코드입니다');
        error.statusCode = 409;
        throw error;
      }
    }

    const updated = await positionRepository.update(positionId, data);
    return updated;
  }

  /**
   * 직책 삭제
   * @param {number} positionId - 직책 ID
   * @returns {Promise<Object>} 삭제 결과
   * @throws {Error} 직책을 찾을 수 없을 경우
   */
  async deletePosition(positionId) {
    // 존재 여부 확인
    const exists = await positionRepository.exists(positionId);
    if (!exists) {
      const error = new Error('직책을 찾을 수 없습니다');
      error.statusCode = 404;
      throw error;
    }

    const deleted = await positionRepository.delete(positionId);
    return { message: '직책이 삭제되었습니다', data: deleted };
  }

  /**
   * 직책 통계 조회
   * @returns {Promise<Object>} 직책 통계
   */
  async getPositionStats() {
    const allPositions = await positionRepository.findAll();

    // 조직별 직책 수 계산
    const byOrganization = allPositions.reduce((acc, position) => {
      const orgCode = position.org_code || 'unassigned';
      acc[orgCode] = (acc[orgCode] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      total: allPositions.length,
      active: allPositions.filter(pos => pos.is_active).length,
      inactive: allPositions.filter(pos => !pos.is_active).length,
      assigned: allPositions.filter(pos => pos.org_code).length,
      unassigned: allPositions.filter(pos => !pos.org_code).length,
      byOrganization
    };

    return stats;
  }
}

module.exports = new PositionService();
