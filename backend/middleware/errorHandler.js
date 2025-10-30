/**
 * 에러 처리 미들웨어
 * - 전역 에러 핸들러
 * - 에러 로깅 및 응답 형식 표준화
 */

/**
 * 404 에러 핸들러 (라우트를 찾을 수 없음)
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`요청한 경로를 찾을 수 없습니다 - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * 전역 에러 핸들러
 */
const errorHandler = (err, req, res, next) => {
  // 상태 코드 설정 (기본값: 500)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // 에러 로깅
  console.error(`[Error ${statusCode}] ${err.message}`);
  console.error(err.stack);

  // PostgreSQL 에러 처리
  if (err.code) {
    return handleDatabaseError(err, res);
  }

  // 클라이언트로 에러 응답
  res.json({
    success: false,
    message: err.message,
    // 개발 환경에서만 스택 트레이스 노출
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

/**
 * PostgreSQL 데이터베이스 에러 처리
 */
const handleDatabaseError = (err, res) => {
  const errorMessages = {
    // 고유 제약 조건 위반
    '23505': {
      status: 409,
      message: '이미 존재하는 데이터입니다.'
    },
    // 외래 키 제약 조건 위반
    '23503': {
      status: 400,
      message: '참조하는 데이터가 존재하지 않습니다.'
    },
    // NOT NULL 제약 조건 위반
    '23502': {
      status: 400,
      message: '필수 입력값이 누락되었습니다.'
    },
    // 데이터 타입 불일치
    '22P02': {
      status: 400,
      message: '잘못된 데이터 형식입니다.'
    }
  };

  const errorInfo = errorMessages[err.code] || {
    status: 500,
    message: '데이터베이스 오류가 발생했습니다.'
  };

  res.status(errorInfo.status).json({
    success: false,
    message: errorInfo.message,
    detail: process.env.NODE_ENV === 'development' ? err.detail : undefined
  });
};

/**
 * 비동기 라우트 핸들러 래퍼 (try-catch 자동 처리)
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  notFoundHandler,
  errorHandler,
  asyncHandler
};
