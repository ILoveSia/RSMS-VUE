/**
 * 조직 관리 라우트
 * - 조직 CRUD API 엔드포인트 정의
 */

const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const { validateOrganizationCreate, validateOrganizationUpdate } = require('../middleware/validation');

/**
 * @route GET /api/organizations/stats
 * @desc 조직 통계 조회
 * @access Public
 */
router.get('/stats', organizationController.getStats);

/**
 * @route GET /api/organizations/type/:orgType
 * @desc 조직 유형별 조회
 * @access Public
 */
router.get('/type/:orgType', organizationController.getByType);

/**
 * @route GET /api/organizations
 * @desc 조직 목록 조회
 * @access Public
 */
router.get('/', organizationController.getAll);

/**
 * @route GET /api/organizations/:orgCode
 * @desc 조직 상세 조회
 * @access Public
 */
router.get('/:orgCode', organizationController.getOne);

/**
 * @route POST /api/organizations
 * @desc 조직 생성
 * @access Public
 */
router.post('/', validateOrganizationCreate, organizationController.create);

/**
 * @route PUT /api/organizations/:orgCode
 * @desc 조직 수정
 * @access Public
 */
router.put('/:orgCode', validateOrganizationUpdate, organizationController.update);

/**
 * @route DELETE /api/organizations/:orgCode
 * @desc 조직 삭제
 * @access Public
 */
router.delete('/:orgCode', organizationController.delete);

module.exports = router;
