/**
 * 에러 처리 유틸리티
 * - API 에러를 사용자 친화적인 메시지로 변환
 * - 에러 로깅 및 모니터링
 */

import { ElMessage, ElNotification } from 'element-plus'

/**
 * API 에러를 분석하고 사용자 친화적인 메시지 반환
 */
export const getErrorMessage = (error) => {
  // 네트워크 에러 (서버 연결 실패)
  if (!error.response) {
    return '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.'
  }

  const status = error.response.status
  const message = error.response.data?.message

  // HTTP 상태 코드별 메시지
  switch (status) {
    case 400:
      return message || '잘못된 요청입니다. 입력 내용을 확인해주세요.'
    case 401:
      return '인증이 필요합니다. 다시 로그인해주세요.'
    case 403:
      return '접근 권한이 없습니다.'
    case 404:
      return '요청한 데이터를 찾을 수 없습니다.'
    case 409:
      return message || '이미 존재하는 데이터입니다.'
    case 422:
      return message || '입력값이 올바르지 않습니다.'
    case 500:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    case 503:
      return '서비스를 일시적으로 사용할 수 없습니다.'
    default:
      return message || `오류가 발생했습니다. (${status})`
  }
}

/**
 * 에러 메시지 표시 (ElMessage 사용)
 */
export const showError = (error) => {
  const message = getErrorMessage(error)
  ElMessage.error(message)

  // 개발 환경에서는 콘솔에도 출력
  if (import.meta.env.DEV) {
    console.error('API Error:', error)
  }
}

/**
 * 에러 알림 표시 (ElNotification 사용 - 더 눈에 띄는 알림)
 */
export const showErrorNotification = (error, title = '오류') => {
  const message = getErrorMessage(error)
  ElNotification.error({
    title,
    message,
    duration: 5000,
    position: 'top-right'
  })

  // 개발 환경에서는 콘솔에도 출력
  if (import.meta.env.DEV) {
    console.error('API Error:', error)
  }
}

/**
 * 성공 메시지 표시
 */
export const showSuccess = (message) => {
  ElMessage.success(message)
}

/**
 * 경고 메시지 표시
 */
export const showWarning = (message) => {
  ElMessage.warning(message)
}

/**
 * 정보 메시지 표시
 */
export const showInfo = (message) => {
  ElMessage.info(message)
}

/**
 * 에러 로깅 (실제 프로젝트에서는 외부 모니터링 서비스로 전송)
 */
export const logError = (error, context = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: getErrorMessage(error),
    status: error.response?.status,
    url: error.config?.url,
    method: error.config?.method,
    context,
    stack: error.stack
  }

  // 개발 환경에서는 콘솔 출력
  if (import.meta.env.DEV) {
    console.error('Error Log:', errorLog)
  }

  // 운영 환경에서는 외부 모니터링 서비스로 전송
  // 예: Sentry, LogRocket, Datadog 등
  // sendToMonitoringService(errorLog)
}
