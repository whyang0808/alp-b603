import { Request, Response } from 'express'
import { BaseController } from './base'
import { validateJWT, validateHash } from '../utils/auth'
import { getUserWithId } from '../services/user'
import { AccessTokenDetails, RefreshTokenDetails } from '../interfaces/token'
import { generateAccessAndRefreshToken } from '../services/auth'

const { JWT_SECRET, NODE_ENV } = process.env

export default class AuthController extends BaseController {
  /**
   * 1) Check if refresh token is in http-only cookie.
   * 2) Validate refresh token.
   * 3) Compare refresh token with hash in db.
   * 4) Generate new refresh and access token.
   */
  public refreshAccessToken = async (req: Request, res:Response) => {
    if (!req.cookies) return this.unauthorized(res)
    const { rt } = req.cookies
    if (!rt) return this.unauthorized(res)
    if (!JWT_SECRET || !NODE_ENV) return this.internalServerError(res)

    let payload: Record<string, any> | string
    try {
      payload = validateJWT(rt, JWT_SECRET)
      if (!payload.sub) return this.unauthorized(res)
    } catch (error) {
      return this.unauthorized(res)
    }

    let user
    try {
      user = await getUserWithId(payload.sub, { _id: 1, roles: 1, refreshToken: 1 })
      if (!user) return this.unauthorized(res)
    } catch (getUserError) {
      console.log(getUserError)
      return this.internalServerError(res)
    }

    try {
      const match = await validateHash(rt, user.refreshToken)
      if (!match) return this.unauthorized(res)
    } catch (compareError) {
      return this.internalServerError(res)
    }

    const accessTokenDetails: AccessTokenDetails = {
      payload: {
        sub: user._id,
        context: {
          roles: user.roles
        }
      },
      options: {
        expiresIn: '1000s'
      }
    }
    const refreshTokenDetails: RefreshTokenDetails = {
      payload: {
        sub: user._id
      },
      options: {
        expiresIn: '30d'
      }
    }
    try {
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(accessTokenDetails, refreshTokenDetails, user._id)
      res.cookie('rt', refreshToken, { httpOnly: true, sameSite: true, secure: NODE_ENV === 'production' })
      return this.ok(res, { token: accessToken })
    } catch (tokenError) {
      console.log(tokenError, 'failed to generate access and refresh token')
      return this.internalServerError(res)
    }
  }
}
