/**
 * @file 2fa.model.ts
 * @brief Models for two-factor authentication.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
// Interfaces for 2FA
export interface TwoFactorSetupResponse {
  secret: string;
  otpauth: string;
}