export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  mustChangePassword?: boolean;
  groupId?: string;
  groupRole?: string; // 'admin' | 'member'
  emailLanguage?: string; // 'de' | 'en'
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string; // Jetzt optional, da bei step 1 noch kein Token kommt
  user?: User;
  require2fa?: boolean; // Neu
}

export interface TotpSetup {
  secret: string;
  qrCodeUrl: string;
}

export interface Group {
  id: string;
  name: string;
}
