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
  token?: string; // Jetzt optional, da bei step 1 noch kein Token kommt
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
