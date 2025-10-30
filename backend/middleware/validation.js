/**
 * 유효성 검사 미들웨어
 * - 요청 데이터 검증
 * - 필수 필드 확인
 */

/**
 * 조직 생성 유효성 검사
 */
const validateOrganizationCreate = (req, res, next) => {
  const { org_code, org_name, org_type } = req.body;

  // 필수 필드 확인
  if (!org_code || !org_name || !org_type) {
    return res.status(400).json({
      success: false,
      message: '조직코드, 조직명, 조직유형은 필수 입력값입니다.'
    });
  }

  // 조직코드 형식 검증 (영문 대문자 + 숫자)
  if (!/^[A-Z0-9]+$/.test(org_code)) {
    return res.status(400).json({
      success: false,
      message: '조직코드는 영문 대문자와 숫자만 사용할 수 있습니다.'
    });
  }

  // 조직코드 길이 검증
  if (org_code.length > 20) {
    return res.status(400).json({
      success: false,
      message: '조직코드는 20자를 초과할 수 없습니다.'
    });
  }

  // 조직명 길이 검증
  if (org_name.length > 100) {
    return res.status(400).json({
      success: false,
      message: '조직명은 100자를 초과할 수 없습니다.'
    });
  }

  // 조직유형 값 검증
  const validTypes = ['head', 'dept', 'branch'];
  if (!validTypes.includes(org_type)) {
    return res.status(400).json({
      success: false,
      message: `조직유형은 ${validTypes.join(', ')} 중 하나여야 합니다.`
    });
  }

  next();
};

/**
 * 조직 수정 유효성 검사
 */
const validateOrganizationUpdate = (req, res, next) => {
  const { org_name, org_type, is_active } = req.body;

  // 조직명 검증
  if (org_name && org_name.length > 100) {
    return res.status(400).json({
      success: false,
      message: '조직명은 100자를 초과할 수 없습니다.'
    });
  }

  // 조직유형 검증
  if (org_type) {
    const validTypes = ['head', 'dept', 'branch'];
    if (!validTypes.includes(org_type)) {
      return res.status(400).json({
        success: false,
        message: `조직유형은 ${validTypes.join(', ')} 중 하나여야 합니다.`
      });
    }
  }

  // 활성화 상태 검증
  if (is_active !== undefined && typeof is_active !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: '활성화 상태는 true 또는 false 여야 합니다.'
    });
  }

  next();
};

/**
 * 직책 생성 유효성 검사
 */
const validatePositionCreate = (req, res, next) => {
  const { position_code, position_name } = req.body;

  // 필수 필드 확인
  if (!position_code || !position_name) {
    return res.status(400).json({
      success: false,
      message: '직책코드, 직책명은 필수 입력값입니다.'
    });
  }

  // 직책코드 형식 검증 (영문 대문자 + 숫자 + 언더스코어)
  if (!/^[A-Z0-9_]+$/.test(position_code)) {
    return res.status(400).json({
      success: false,
      message: '직책코드는 영문 대문자, 숫자, 언더스코어만 사용할 수 있습니다.'
    });
  }

  // 직책코드 길이 검증
  if (position_code.length > 20) {
    return res.status(400).json({
      success: false,
      message: '직책코드는 20자를 초과할 수 없습니다.'
    });
  }

  // 직책명 길이 검증
  if (position_name.length > 100) {
    return res.status(400).json({
      success: false,
      message: '직책명은 100자를 초과할 수 없습니다.'
    });
  }

  next();
};

/**
 * 직책 수정 유효성 검사
 */
const validatePositionUpdate = (req, res, next) => {
  const { position_code, position_name, is_active } = req.body;

  // 직책코드 검증
  if (position_code) {
    if (!/^[A-Z0-9_]+$/.test(position_code)) {
      return res.status(400).json({
        success: false,
        message: '직책코드는 영문 대문자, 숫자, 언더스코어만 사용할 수 있습니다.'
      });
    }
    if (position_code.length > 20) {
      return res.status(400).json({
        success: false,
        message: '직책코드는 20자를 초과할 수 없습니다.'
      });
    }
  }

  // 직책명 검증
  if (position_name && position_name.length > 100) {
    return res.status(400).json({
      success: false,
      message: '직책명은 100자를 초과할 수 없습니다.'
    });
  }

  // 활성화 상태 검증
  if (is_active !== undefined && typeof is_active !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: '활성화 상태는 true 또는 false 여야 합니다.'
    });
  }

  next();
};

module.exports = {
  validateOrganizationCreate,
  validateOrganizationUpdate,
  validatePositionCreate,
  validatePositionUpdate
};
