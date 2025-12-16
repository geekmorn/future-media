export interface JwtPayload {
  sub: string;
  name: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  name: string;
}

export interface GoogleProfile {
  googleId: string;
  email: string;
  displayName: string;
}
