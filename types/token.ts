import { SignOptions } from 'jsonwebtoken'

export interface AccessTokenDetails {
  payload: {
    sub: string,
    context: {
      roles: [{
        company: any,
        role: string
      }]
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
