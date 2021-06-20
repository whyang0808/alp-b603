import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import { BaseController } from '../controllers/base'
import { ErrorMessage } from '../interfaces/error'
import { validateJWT } from '../utils/auth'
import { AccessTokenDetails } from '../interfaces/token'

dotenv.config()
const { JWT_SECRET } = process.env

export default class AuthMiddleware extends BaseController {
  /**
   * Middleware to verify if access token is valid. This middleware should be present on most if not all endpoints.
   */
  public verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    if (!JWT_SECRET) return this.internalServerError(res)
    const authorizationHeader = req.header('Authorization') || req.header('authorization')
    if (!authorizationHeader) return this.unauthorized(res, ErrorMessage.MISSING_TOKEN)
    const jwtToken = authorizationHeader.split(' ')[1]
    if (!jwtToken) return this.unauthorized(res, ErrorMessage.MISSING_TOKEN)
    try {
      const payload = validateJWT(jwtToken, JWT_SECRET)
      if (!payload) throw 'payload undefined'
      res.locals.userId = (payload as AccessTokenDetails["payload"]).sub
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') return this.unauthorized(res, ErrorMessage.TOKEN_EXPIRED)
      return this.unauthorized(res)
    }
    return next()
  }
}
