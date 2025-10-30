/**
 * 직책 관리 라우트
 * - 직책 CRUD API 엔드포인트 정의
 */

const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const { validatePositionCreate, validatePositionUpdate } = require('../middleware/validation');

/**
 * @route GET /api/positions/stats
 * @desc 직책 통계 조회
 * @access Public
 */
router.get('/stats', positionController.getStats);

/**
 * @route GET /api/positions/organization/:orgCode
 * @desc 조직별 직책 조회
 * @access Public
 */
router.get('/organization/:orgCode', positionController.getByOrganization);

/**
 * @route GET /api/positions
 * @desc 직책 목록 조회
 * @access Public
 */
router.get('/', positionController.getAll);

/**
 * @route GET /api/positions/:positionId
 * @desc 직책 상세 조회
 * @access Public
 */
router.get('/:positionId', positionController.getOne);

/**
 * @route POST /api/positions
 * @desc 직책 생성
 * @access Public
 */
router.post('/', validatePositionCreate, positionController.create);

/**
 * @route PUT /api/positions/:positionId
 * @desc 직책 수정
 * @access Public
 */
router.put('/:positionId', validatePositionUpdate, positionController.update);

/**
 * @route DELETE /api/positions/:positionId
 * @desc 직책 삭제
 * @access Public
 */
router.delete('/:positionId', positionController.delete);

module.exports = router;
