export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
}

export interface AuthResponse {
  token?: string; // Jetzt optional, da bei step 1 noch kein Token kommt
  user?: User;
  require2fa?: boolean; // Neu
}

// Für später (TOTP)
export interface TotpSetup {
  secret: string;
  qrCodeUrl: string; // Wenn wir das im Backend generieren
}
