/**
 * RSMS Vue Backend API Server
 * - Express 기반 REST API 서버
 * - PostgreSQL 데이터베이스 연동
 * - 계층형 아키텍처 (Routes → Controllers → Services → Repositories)
 */

const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// ============================================
// 전역 미들웨어
// ============================================
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅 (개발 환경)
if (config.isDevelopment && config.logging.enabled) {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
  });
}

// ============================================
// 라우트 등록
// ============================================
app.use('/', routes);

// ============================================
// 에러 핸들러 (마지막에 배치)
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// 서버 시작
// ============================================
const startServer = () => {
  app.listen(config.server.port, () => {
    console.log('='.repeat(50));
    console.log(`🚀 RSMS Vue Backend API Server 시작됨`);
    console.log(`📍 URL: http://${config.server.host}:${config.server.port}`);
    console.log(`🌍 Environment: ${config.env}`);
    console.log(`🗄️  Database: ${config.database.host}:${config.database.port}/${config.database.name}`);
    console.log(`💚 Health Check: http://${config.server.host}:${config.server.port}/health`);
    console.log(`📚 API Root: http://${config.server.host}:${config.server.port}/api`);
    console.log('='.repeat(50));
  });
};

// 서버 시작
startServer();

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM 신호를 받았습니다. 서버를 종료합니다...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT 신호를 받았습니다. 서버를 종료합니다...');
  process.exit(0);
});

module.exports = app;
