import { SignOptions } from "jsonwebtoken";

export interface AccessTokenDetails {
  payload: {
    sub: string,
    context: {
      roles: string[]
    }
  },
  options: SignOptions
}

export interface RefreshTokenDetails {
  payload: {
    sub: string
  },
  options: SignOptions
}
