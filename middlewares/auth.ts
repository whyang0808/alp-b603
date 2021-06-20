import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import { BaseController } from '../controllers/base'
import { ErrorMessage } from '../types/error'
import { validateJWT } from '../utils/auth'
import { AccessTokenDetails } from '../types/token'

dotenv.config()
const { JWT_SECRET } = process.env

export default class AuthMiddleware extends BaseController {
  /**
   * Middleware to verify jwt.
   */
  public verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    if (!JWT_SECRET) return this.internalServerError(res)
    const authorizationHeader = req.header('Authorization') || req.header('authorization')
    if (!authorizationHeader) return this.unauthorized(res)
    const jwtToken = authorizationHeader.split(' ')[1]
    let payload
    try {
      payload = validateJWT(jwtToken, JWT_SECRET)
      if (!payload) throw 'payload undefined'
      res.locals.userId = (payload as AccessTokenDetails["payload"]).sub
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') return this.unauthorized(res, ErrorMessage.TOKEN_EXPIRED)
      return this.unauthorized(res)
    }
    return next()
  }
}
