/**
 * 라우트 인덱스
 * - 모든 라우트를 통합하여 내보냄
 */

const express = require('express');
const router = express.Router();

const organizationRoutes = require('./organizationRoutes');
const positionRoutes = require('./positionRoutes');

/**
 * 헬스체크 API
 * @route GET /health
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'RSMS Vue Backend API Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * API 루트
 * @route GET /api
 */
router.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'RSMS Vue API',
    version: '1.0.0',
    endpoints: {
      organizations: '/api/organizations',
      positions: '/api/positions',
      health: '/health'
    }
  });
});

// API 라우트 등록
router.use('/api/organizations', organizationRoutes);
router.use('/api/positions', positionRoutes);

module.exports = router;
