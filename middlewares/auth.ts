import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import { BaseController } from '../controllers/base'
import { ErrorMessage } from '../types/error'
import { validateJWT } from '../utils/auth'
import { ROLES } from '../types/user'
import { getUserWithId } from '../services/user'
import { AccessTokenDetails } from '../types/token'
import { intersects } from '../utils/helpers'

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
      res.locals.payload = payload
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') return this.unauthorized(res, ErrorMessage.TOKEN_EXPIRED)
      return this.unauthorized(res)
    }
    return next()
  }
}
