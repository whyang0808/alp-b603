import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { BaseController } from './base'
import { validateJWT, generateJWT } from '../utils/auth'

const { JWT_SECRET } = process.env

export default class AuthController extends BaseController {
  /**
   * 1) Check if refresh token is in http-only cookie
   * 2) Validate refresh token
   * 3) Generate new access token
   */
  refreshAccessToken(req: Request, res:Response) {
    const { rt } = req.cookies
    if (!rt) return this.unauthorized(res)
    if (!JWT_SECRET) return this.internalServerError(res)

    try {
      validateJWT(rt, JWT_SECRET)
    } catch (error) {
      return this.unauthorized(res)
    }

    try {
      // TODO: change payload and expires in
      const newAccessToken = generateJWT({ hello: 'world' }, JWT_SECRET, { expiresIn: '1000s' })
      return this.ok(res, { token: newAccessToken })
    } catch (error) {
      console.log(error, 'jwt generate error')
      return this.internalServerError(res)
    }
  }
}
