/**
 * @file user.model.ts
 * @brief Models for users, authentication, and groups.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  mustChangePassword?: boolean;
  lastLoginAt?: string;
  groupId?: string;
  groupRole?: string; // 'admin' | 'member'
  emailLanguage?: string; // 'de' | 'en'
  language?: string; // 'de' | 'en'
  has2FA?: boolean;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  language?: string;
}

export interface AuthResponse {
  token?: string; // Now optional, as no token is sent in step 1
  user?: User;
  require2fa?: boolean;
}

export interface TotpSetup {
  secret: string;
  qrCodeUrl: string;
}

export interface Group {
  id: string;
  name: string;
}

export interface GroupMembership {
  id: string;
  name: string;
  role: string;
}