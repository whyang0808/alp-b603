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
   * Middleware to verify if access token is valid and checks if user has proper roles.
   * This middleware should be present on most if not all endpoints.
   * TODO: Check to see if user without roles is allowed to use the application, if so, need to split up jwt and role checking.
   */
  public authenticate = (roles?: ROLES[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!JWT_SECRET) return this.internalServerError(res)
      const authorizationHeader = req.header('Authorization') || req.header('authorization')
      if (!authorizationHeader) return this.unauthorized(res)
      const jwtToken = authorizationHeader.split(' ')[1]
      let payload
      try {
        payload = validateJWT(jwtToken, JWT_SECRET)
        if (!payload) throw 'payload undefined'
      } catch (jwtError) {
        if (jwtError.name === 'TokenExpiredError') return this.unauthorized(res, ErrorMessage.TOKEN_EXPIRED)
        return this.unauthorized(res)
      }
  
      if (roles && roles.length) {
        try {
          const user = await getUserWithId((payload as AccessTokenDetails["payload"]).sub, { password: 0, refreshToken: 0, __v: 0 })
          // TODO: check to see if user without roles is allowed to use the application, then uncomment/remove below code
          // if (!user.roles && roles.length) throw ErrorMessage.MISSING_ROLES
          // if (!intersects(user.roles, roles)) throw ErrorMessage.MISSING_ROLES
          res.locals.user = user
        } catch (userError) {
          return this.forbidden(res, userError)
        }
      }
      return next()
    }
  }
}
