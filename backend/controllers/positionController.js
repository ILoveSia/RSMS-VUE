/**
 * 직책 Controller
 * - HTTP 요청/응답 처리
 * - Service 계층 호출 및 응답 형식 표준화
 */

const positionService = require('../services/positionService');

/**
 * 직책 Controller 클래스
 */
class PositionController {
  /**
   * 직책 목록 조회
   * @route GET /api/positions
   */
  async getAll(req, res, next) {
    try {
      const data = await positionService.getAllPositions();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 직책 상세 조회
   * @route GET /api/positions/:positionId
   */
  async getOne(req, res, next) {
    try {
      const { positionId } = req.params;
      const data = await positionService.getPositionById(parseInt(positionId, 10));
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 조직별 직책 조회
   * @route GET /api/positions/organization/:orgCode
   */
  async getByOrganization(req, res, next) {
    try {
      const { orgCode } = req.params;
      const data = await positionService.getPositionsByOrganization(orgCode);
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 직책 통계 조회
   * @route GET /api/positions/stats
   */
  async getStats(req, res, next) {
    try {
      const data = await positionService.getPositionStats();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 직책 생성
   * @route POST /api/positions
   */
  async create(req, res, next) {
    try {
      const data = await positionService.createPosition(req.body);
      res.status(201).json({
        success: true,
        data,
        message: '직책이 생성되었습니다'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 직책 수정
   * @route PUT /api/positions/:positionId
   */
  async update(req, res, next) {
    try {
      const { positionId } = req.params;
      const data = await positionService.updatePosition(
        parseInt(positionId, 10),
        req.body
      );
      res.json({
        success: true,
        data,
        message: '직책이 수정되었습니다'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 직책 삭제
   * @route DELETE /api/positions/:positionId
   */
  async delete(req, res, next) {
    try {
      const { positionId } = req.params;
      const result = await positionService.deletePosition(parseInt(positionId, 10));
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PositionController();
