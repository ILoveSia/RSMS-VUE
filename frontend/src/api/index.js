/**
 * API 클라이언트
 * - Axios 인스턴스 생성 및 설정
 * - 에러 인터셉터를 통한 일관된 에러 처리
 * - 요청/응답 로깅
 */

import axios from 'axios'

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: '/api',
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터 - 요청 전 로깅 및 인증 토큰 추가
api.interceptors.request.use(
  (config) => {
    // 개발 환경에서는 요청 로깅
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`)
    }

    // 인증 토큰이 있다면 헤더에 추가 (추후 구현)
    // const token = localStorage.getItem('auth_token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 에러 처리 및 응답 로깅
api.interceptors.response.use(
  (response) => {
    // 개발 환경에서는 응답 로깅
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data)
    }
    return response
  },
  (error) => {
    // 개발 환경에서는 에러 로깅
    if (import.meta.env.DEV) {
      console.error('[API Error]', error)
    }

    // 401 에러 시 로그인 페이지로 리다이렉트 (추후 구현)
    // if (error.response?.status === 401) {
    //   window.location.href = '/login'
    // }

    return Promise.reject(error)
  }
)

// ============================================
// 조직 관리 API
// ============================================
export const organizationApi = {
  /**
   * 조직 목록 조회
   */
  getAll: () => api.get('/organizations'),

  /**
   * 조직 상세 조회
   * @param {string} orgCode - 조직 코드
   */
  getOne: (orgCode) => api.get(`/organizations/${orgCode}`),

  /**
   * 조직 생성
   * @param {object} data - 조직 데이터 { org_code, org_name, org_type }
   */
  create: (data) => api.post('/organizations', data),

  /**
   * 조직 수정
   * @param {string} orgCode - 조직 코드
   * @param {object} data - 수정할 조직 데이터
   */
  update: (orgCode, data) => api.put(`/organizations/${orgCode}`, data),

  /**
   * 조직 삭제
   * @param {string} orgCode - 조직 코드
   */
  delete: (orgCode) => api.delete(`/organizations/${orgCode}`)
}

// ============================================
// 직책 관리 API
// ============================================
export const positionApi = {
  /**
   * 직책 목록 조회
   */
  getAll: () => api.get('/positions'),

  /**
   * 직책 상세 조회
   * @param {number} positionId - 직책 ID
   */
  getOne: (positionId) => api.get(`/positions/${positionId}`),

  /**
   * 직책 생성
   * @param {object} data - 직책 데이터 { position_code, position_name, org_code }
   */
  create: (data) => api.post('/positions', data),

  /**
   * 직책 수정
   * @param {number} positionId - 직책 ID
   * @param {object} data - 수정할 직책 데이터
   */
  update: (positionId, data) => api.put(`/positions/${positionId}`, data),

  /**
   * 직책 삭제
   * @param {number} positionId - 직책 ID
   */
  delete: (positionId) => api.delete(`/positions/${positionId}`)
}

export default api
