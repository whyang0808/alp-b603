import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { BaseController } from './base'
import { checkUserExistsWithIdNumber, getUserWithEmail, createUser } from '../services/user'
import { validateObject } from '../utils/form'
import { CreateUserInterface } from '../interfaces/user'
import { ErrorMessage } from '../interfaces/error'
import { generateAccessAndRefreshToken } from '../services/auth'
import { AccessTokenDetails, RefreshTokenDetails } from '../interfaces/token'
import { validateHash } from '../utils/auth'

const { NODE_ENV } = process.env

export default class UserController extends BaseController {
  /**
   * Creates a user.
   * 1) Validate the request to make sure all fields are not undefined.
   * 2) Check if the user exists.
   * 3) Hash the password before saving to db.
   * 4) Create the user if all is smooth.
   */
  public create = async (req: Request, res: Response) => {
    const { 
      firstName,
      lastName,
      email,
      birthDate,
      idType,
      idNumber,
      password
    } = req.body
    const createUserData: CreateUserInterface = { firstName, lastName, email, birthDate, idNumber, idType, password }
    try {
      validateObject(createUserData, [])
    } catch (validateError) {
      return this.clientError(res)
    }

    try {
      const userExists = await checkUserExistsWithIdNumber(createUserData.idNumber)
      if (userExists) return this.clientError(res, ErrorMessage.USER_EXISTS)
    } catch (userExistsError) {
      console.log(userExistsError, 'check user exists error')
      return this.internalServerError(res)
    }

    try {
      createUserData.password = await bcrypt.hash(password, 10)
    } catch (hashError) {
      console.log(hashError, 'hash password error')
      return this.internalServerError(res)
    }
 
    try {
      const response = await createUser(createUserData)
      response.password = undefined
      response.__v = undefined
      return this.ok(res, response)
    } catch (createUserError) {
      console.log(createUserError, 'create user error')
      return this.internalServerError(res)
    }
  }

  /**
   * Logs a user in.
   * 1) Validate email and password.
   * 2) Check if user with email exists.
   * 3) Compare password with hash in db.
   * 4) Generate access and refresh token.
   * 5) Set refresh token as http-only cookie and return access token in response body.
   */
  public logIn = async (req: Request, res: Response) => {
    if (!NODE_ENV) return this.internalServerError(res)
    const { email, password } = req.body
    try {
      validateObject({ email, password }, [])
    } catch (validateError) {
      return this.clientError(res)
    }

    let user: Record<string, any>
    try {
      user = await getUserWithEmail(email,  { email: 1, password: 1 })
      if (!user) return this.clientError(res, ErrorMessage.EMAIL_OR_PASSWORD_WRONG)
    } catch (userExistsError) {
      console.log(userExistsError, 'check user exists error')
      return this.internalServerError(res)
    }

    try {
      const passwordMatch = await validateHash(password, user.password)
      if (!passwordMatch) return this.clientError(res, ErrorMessage.EMAIL_OR_PASSWORD_WRONG)
    } catch (compareError) {
      console.log(compareError, 'password compare error')
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
      res.cookie('rt', refreshToken, { httpOnly: true, sameSite: true, secure: NODE_ENV === 'production' ? true : false })
      return this.ok(res, { token: accessToken })
    } catch (tokenError) {
      console.log(tokenError, 'failed to generate access and refresh token')
      return this.internalServerError(res)
    }
  }
}
