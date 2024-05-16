export enum ErrorMsg {
  // 共用錯誤

  // Auth 登入相關

  ERR_AUTH_SIGNUP_USER_CONFLICT = '11002 已註冊使用者',
  ERR_AUTH_SIGNIN_NOT_EXIST = '11003 尚未註冊使用者',
  ERR_AUTH_SIGNIN_PASSWORD = '11004 密碼錯誤',
  ERR_AUTH_SIGNUP_PASSWORD_CONFIRMED = '11005 確認密碼錯誤',
  ERR_AUTH_REFRESH_TOKEN_INVALID = '11006 無效刷新令牌',

  // User 相關錯誤

  // 系統核心錯誤 相關錯誤
  ERR_CORE_UNKNOWN_ERROR = '99001 非預期系統錯誤',
}
