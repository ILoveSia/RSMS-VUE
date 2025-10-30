/**
 * 애플리케이션 설정
 * - 환경 변수 로드 및 검증
 * - 설정 값 중앙 관리
 */

require('dotenv').config();

/**
 * 필수 환경 변수 검증
 * @param {string[]} keys - 필수 환경 변수 키 배열
 * @throws {Error} 필수 환경 변수가 없을 경우
 */
const validateEnv = (keys) => {
  const missing = keys.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`필수 환경 변수가 설정되지 않았습니다: ${missing.join(', ')}`);
  }
};

// 필수 환경 변수 검증
validateEnv(['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']);

/**
 * 애플리케이션 설정 객체
 */
const config = {
  // 환경 정보
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',

  // 서버 설정
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || 'localhost',
  },

  // 데이터베이스 설정
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    schema: process.env.DB_SCHEMA || 'rsms_vue',
    poolMax: parseInt(process.env.DB_POOL_MAX, 10) || 10,
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT, 10) || 30000,
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10) || 2000,
  },

  // CORS 설정
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  // 로깅 설정
  logging: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    enabled: process.env.LOG_ENABLED !== 'false',
  },
};

module.exports = config;
