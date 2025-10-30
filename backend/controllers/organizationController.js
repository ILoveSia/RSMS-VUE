/**
 * 조직 Controller
 * - HTTP 요청/응답 처리
 * - Service 계층 호출 및 응답 형식 표준화
 */

const organizationService = require('../services/organizationService');

/**
 * 조직 Controller 클래스
 */
class OrganizationController {
  /**
   * 조직 목록 조회
   * @route GET /api/organizations
   */
  async getAll(req, res, next) {
    try {
      const data = await organizationService.getAllOrganizations();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 조직 상세 조회
   * @route GET /api/organizations/:orgCode
   */
  async getOne(req, res, next) {
    try {
      const { orgCode } = req.params;
      const data = await organizationService.getOrganizationByCode(orgCode);
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 조직 유형별 조회
   * @route GET /api/organizations/type/:orgType
   */
  async getByType(req, res, next) {
    try {
      const { orgType } = req.params;
      const data = await organizationService.getOrganizationsByType(orgType);
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 조직 통계 조회
   * @route GET /api/organizations/stats
   */
  async getStats(req, res, next) {
    try {
      const data = await organizationService.getOrganizationStats();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 조직 생성
   * @route POST /api/organizations
   */
  async create(req, res, next) {
    try {
      const data = await organizationService.createOrganization(req.body);
      res.status(201).json({
        success: true,
        data,
        message: '조직이 생성되었습니다'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 조직 수정
   * @route PUT /api/organizations/:orgCode
   */
  async update(req, res, next) {
    try {
      const { orgCode } = req.params;
      const data = await organizationService.updateOrganization(orgCode, req.body);
      res.json({
        success: true,
        data,
        message: '조직이 수정되었습니다'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 조직 삭제
   * @route DELETE /api/organizations/:orgCode
   */
  async delete(req, res, next) {
    try {
      const { orgCode } = req.params;
      const result = await organizationService.deleteOrganization(orgCode);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrganizationController();
