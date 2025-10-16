// Register types
export interface RegisterRequest {
  phone: string;
  fName: string;
  lName: string;
  password: string;
}

export interface RegisterResult {
  phone: string;
  codeExpiration: string;
  code: string;
}

export interface RegisterResponse {
  result: RegisterResult;
  success: boolean;
  message: string;
  code: number;
}

// Login types (phone-only login)
export interface LoginRequest {
  phone: string;
}

export interface LoginResult {
  phone: string;
  codeExpiration: string;
  code: string;
}

export interface LoginResponse {
  result: LoginResult;
  success: boolean;
  message: string;
  code: number;
}

// Verify Code types (updated with refresh token)
export interface VerifyCodeRequest {
  phone: string;
  code: string;
  password?: string; // Optional for login flow
}

export interface VerifyCodeResult {
  token: string;
  refreshToken: string;
  expiration: string;
  refreshTokenExpiration: string;
}

export interface VerifyCodeResponse {
  result: VerifyCodeResult;
  success: boolean;
  message: string;
  code: number;
}

// Refresh Token types
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  result: VerifyCodeResult;
  success: boolean;
  message: string;
  code: number;
}

// User type for authentication
export interface User {
  phone: string;
  fName?: string;
  lName?: string;
  token: string;
  refreshToken: string;
  expiration: string;
  refreshTokenExpiration: string;
}

// User info from profile endpoint
export interface UserInfo {
  fName: string | null;
  lName: string | null;
  id: string;
  isRemoved: boolean;
  inserTime: string;
  lastUpdate: string;
  removeTime: string | null;
  phone: string;
  avatar: string | null;
  role: string | null;
}

export interface GetUserInfoResult {
  user: UserInfo;
}

// Generic API response wrapper that can be reused
export interface ApiResponse<T> {
  result: T;
  success: boolean;
  message: string;
  code: number;
}

// Token management types
export interface TokenData {
  token: string;
  refreshToken: string;
  expiration: string; // required
  refreshTokenExpiration: string; // required
}


export interface UpdatePersonalInfoRequest {
  fName: string;
  lName: string;
}

export interface UpdatePersonalInfoResponse {
  success: boolean;
  message: string;
  code: number;
}

// --- Change Password ---
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  code: number;
}

// --- forget password ---
export interface ForgetPasswordRequest {
  phone: string;
}

export interface ForgetResult {
  phone: string;
  codeExpiration: string;
  code: null;
}

export interface ForgetPasswordResponse {
  result: ForgetResult;
  success: boolean;
  message: string;
  code: number;
}

export interface VerifyForgetPassRequest {
  phone: string;
  code: string;
  newPassword: string;
}

export interface VerifyForgetPassResponse {
  success: boolean;
  message: string;
  code: number;
}

export interface ContactUsRequest {
  fullName: string;
  phone: string;
  message: string;
}

export interface ContactUsResponse {
  "success": boolean,
  "message": string,
  "code": number
}
