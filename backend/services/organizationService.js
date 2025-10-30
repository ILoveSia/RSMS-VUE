/**
 * 조직 Service
 * - 조직 관련 비즈니스 로직
 * - 데이터 검증 및 변환
 */

const organizationRepository = require('../repositories/organizationRepository');

/**
 * 조직 Service 클래스
 */
class OrganizationService {
  /**
   * 모든 조직 조회
   * @returns {Promise<Array>} 조직 목록
   */
  async getAllOrganizations() {
    return await organizationRepository.findAll();
  }

  /**
   * 조직 상세 조회
   * @param {string} orgCode - 조직 코드
   * @returns {Promise<Object>} 조직 객체
   * @throws {Error} 조직을 찾을 수 없을 경우
   */
  async getOrganizationByCode(orgCode) {
    const organization = await organizationRepository.findByCode(orgCode);

    if (!organization) {
      const error = new Error('조직을 찾을 수 없습니다');
      error.statusCode = 404;
      throw error;
    }

    return organization;
  }

  /**
   * 조직 유형별 조회
   * @param {string} orgType - 조직 유형 (head|dept|branch)
   * @returns {Promise<Array>} 조직 목록
   */
  async getOrganizationsByType(orgType) {
    const validTypes = ['head', 'dept', 'branch'];
    if (!validTypes.includes(orgType)) {
      const error = new Error(`조직유형은 ${validTypes.join(', ')} 중 하나여야 합니다`);
      error.statusCode = 400;
      throw error;
    }

    return await organizationRepository.findByType(orgType);
  }

  /**
   * 활성화 상태별 조회
   * @param {boolean} isActive - 활성화 상태
   * @returns {Promise<Array>} 조직 목록
   */
  async getOrganizationsByStatus(isActive) {
    return await organizationRepository.findByActiveStatus(isActive);
  }

  /**
   * 조직 생성
   * @param {Object} data - 조직 데이터
   * @returns {Promise<Object>} 생성된 조직
   * @throws {Error} 중복된 조직 코드일 경우
   */
  async createOrganization(data) {
    // 중복 확인
    const exists = await organizationRepository.exists(data.org_code);
    if (exists) {
      const error = new Error('이미 존재하는 조직코드입니다');
      error.statusCode = 409;
      throw error;
    }

    return await organizationRepository.create(data);
  }

  /**
   * 조직 수정
   * @param {string} orgCode - 조직 코드
   * @param {Object} data - 수정할 데이터
   * @returns {Promise<Object>} 수정된 조직
   * @throws {Error} 조직을 찾을 수 없을 경우
   */
  async updateOrganization(orgCode, data) {
    // 존재 여부 확인
    const exists = await organizationRepository.exists(orgCode);
    if (!exists) {
      const error = new Error('조직을 찾을 수 없습니다');
      error.statusCode = 404;
      throw error;
    }

    const updated = await organizationRepository.update(orgCode, data);
    return updated;
  }

  /**
   * 조직 삭제
   * @param {string} orgCode - 조직 코드
   * @returns {Promise<Object>} 삭제 결과
   * @throws {Error} 조직을 찾을 수 없거나 하위 직책이 있을 경우
   */
  async deleteOrganization(orgCode) {
    // 존재 여부 확인
    const exists = await organizationRepository.exists(orgCode);
    if (!exists) {
      const error = new Error('조직을 찾을 수 없습니다');
      error.statusCode = 404;
      throw error;
    }

    // 하위 직책 확인
    const positionCount = await organizationRepository.countPositions(orgCode);
    if (positionCount > 0) {
      const error = new Error(
        `해당 조직에 ${positionCount}개의 직책이 존재합니다. 먼저 직책을 삭제해주세요`
      );
      error.statusCode = 400;
      throw error;
    }

    const deleted = await organizationRepository.delete(orgCode);
    return { message: '조직이 삭제되었습니다', data: deleted };
  }

  /**
   * 조직 통계 조회
   * @returns {Promise<Object>} 조직 통계
   */
  async getOrganizationStats() {
    const allOrganizations = await organizationRepository.findAll();

    const stats = {
      total: allOrganizations.length,
      active: allOrganizations.filter(org => org.is_active).length,
      inactive: allOrganizations.filter(org => !org.is_active).length,
      byType: {
        head: allOrganizations.filter(org => org.org_type === 'head').length,
        dept: allOrganizations.filter(org => org.org_type === 'dept').length,
        branch: allOrganizations.filter(org => org.org_type === 'branch').length,
      }
    };

    return stats;
  }
}

module.exports = new OrganizationService();
