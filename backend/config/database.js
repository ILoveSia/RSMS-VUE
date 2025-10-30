/**
 * 데이터베이스 설정
 * - PostgreSQL 연결 풀 설정
 * - 환경 변수 기반 구성
 */

const { Pool } = require('pg');
const config = require('./index');

/**
 * PostgreSQL 연결 풀 생성
 * @returns {Pool} PostgreSQL 연결 풀 인스턴스
 */
const createPool = () => {
  const pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
    max: config.database.poolMax,
    idleTimeoutMillis: config.database.idleTimeout,
    connectionTimeoutMillis: config.database.connectionTimeout,
  });

  // 연결 성공 이벤트
  pool.on('connect', () => {
    console.log('✅ PostgreSQL 연결 성공');
  });

  // 연결 에러 이벤트
  pool.on('error', (err) => {
    console.error('❌ PostgreSQL 연결 오류:', err.message);
    process.exit(1);
  });

  return pool;
};

module.exports = createPool();
