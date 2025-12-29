// Interfaces für 2FA
export interface TwoFactorSetupResponse {
  secret: string;
  otpauth: string;
}
