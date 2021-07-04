import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import moment from 'moment'
import { BaseController } from './base'
import { checkUserExistsWithIdNumber, getUserWithEmail, createUser, updateOneUser, getUserWithId, searchUsersWithEmail, assignUserRole } from '../services/user'
import { validateEmail, validateObject } from '../utils/helpers'
import { CreateUserInterface, ROLES } from '../types/user'
import { ErrorMessage } from '../types/error'
import { createForgotPassword, generateAccessAndRefreshToken, getForgotPassword, updateForgotPassword } from '../services/auth'
import { AccessTokenDetails, RefreshTokenDetails } from '../types/token'
import { generateUUID, validateHash } from '../utils/auth'

const { NODE_ENV, FRONTEND_BASE_URL } = process.env

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
    if (!validateEmail(email)) return this.clientError(res)

    try {
      const [idNumberExists, emailExists] = await Promise.all([checkUserExistsWithIdNumber(createUserData.idNumber), getUserWithEmail(createUserData.email)])
      if (idNumberExists || emailExists) return this.clientError(res, ErrorMessage.USER_EXISTS)
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
      user = await getUserWithEmail(email, { email: 1, password: 1, roles: 1 })
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
      res.cookie('rt', refreshToken, { httpOnly: true, sameSite: true, secure: NODE_ENV === 'production' })
      return this.ok(res, { token: accessToken, userId: user._id, roles: user.roles })
    } catch (tokenError) {
      console.log(tokenError, 'failed to generate access and refresh token')
      return this.internalServerError(res)
    }
  }

  /**
   * Update's a user's details and returns the updated user object
   */
  public update = async (req: Request, res: Response) => {
    const { firstName, lastName, birthDate } = req.body
    if (!firstName || !lastName || !birthDate) return this.clientError(res)
    const { userId } = res.locals
    if (!userId) return this.unauthorized(res)
    try {
      await updateOneUser(
        { _id: userId },
        { firstName, lastName, birthDate }
      )
      return this.ok(res)
    } catch (updateError) {
      return this.internalServerError(res)
    }
  }

  /**
   * 1) Check if user with email exists
   * 2) Check if user still has active forgot password link, if yes, then invalidate the previous link
   * 3) Generate and hash a token
   * 4) Create a forgotPassword object in db
   * 5) Generate reset password link and send to user email
   */
  public generateForgotPasswordLink = async (req: Request, res: Response) => {
    const { email } = req.body
    if (!email || !validateEmail(email)) return this.clientError(res)
    let userId: string
    try {
      const user = await getUserWithEmail(email, { _id: 1 })
      // user not found
      if (!user) return this.clientError(res)
      userId = user._id
    } catch (userError) {
      return this.internalServerError(res)
    }

    // Check if user still has active forgot password link, if yes, then invalidate the previous link
    let hasForgotPassword
    try {
      hasForgotPassword = await getForgotPassword({ userId, used: false })
    } catch (getForgotPasswordError) {
      return this.internalServerError(res)
    }
    if (hasForgotPassword) {
      try {
        await updateForgotPassword(
          { _id: hasForgotPassword._id },
          { used: true }
        )
      } catch (updateError) {
        return this.internalServerError(res)
      }
    }

    const token = generateUUID()
    let tokenHash: string
    try {
      tokenHash = await bcrypt.hash(token, 10)
    } catch (hashError) {
      return this.internalServerError(res)
    }

    try {
      const createdAt = new Date()
      const expirationDate = moment(createdAt).add(15, 'm').toDate()
      await createForgotPassword({
        userId,
        createdAt,
        tokenHash,
        expirationDate,
        used: false
      })
    } catch (createError) {
      return this.internalServerError(res)
    }

    // TODO: send email to user and remove resetLink from response
    const resetLink = `${FRONTEND_BASE_URL}/reset-password?email=${email}&token=${token}`
    return this.ok(res, { resetLink })
  }

  public verifyHashedResetPasswordToken = async (req: Request, res: Response) => {
    const { email, token } = req.query as {email: string, token: string}
    if (!email || !validateEmail(email) || !token) return this.clientError(res)

    let userId: string
    try {
      const user = await getUserWithEmail(email, { _id: 1 })
      // user not found
      if (!user) return this.clientError(res)
      userId = user._id
    } catch (userError) {
      return this.internalServerError(res)
    }

    let forgotPassword: Record<string, any>
    try {
      // get the one that has not been used
      forgotPassword = await getForgotPassword({ userId, used: false })
      if (!forgotPassword) return this.clientError(res)

      const currentDate = moment(new Date())
      // if token is used or expired
      if (forgotPassword.used || currentDate.isAfter(moment(forgotPassword.expirationDate))) return this.unauthorized(res)

      const tokenMatch = await validateHash(token, forgotPassword.tokenHash)
      if (!tokenMatch) return this.unauthorized(res, ErrorMessage.TOKEN_INVALID)
    } catch (getError) {
      return this.internalServerError(res)
    }

    return this.ok(res)
  }

  /**
   * 1) Check if user with email exists
   * 2) Check if reset token has been used or expired, then check if its a valid hash
   * 3) If all is good, set token to "used" so the reset password link is invalidated, then hash new password and update user in db.
   */
  public resetPassword = async (req: Request, res: Response) => {
    const { email, token, newPassword } = req.body
    if (!email || !validateEmail(email) || !token || !newPassword) return this.clientError(res)
    let userId: string
    try {
      const user = await getUserWithEmail(email, { _id: 1 })
      // user not found
      if (!user) return this.clientError(res)
      userId = user._id
    } catch (userError) {
      return this.internalServerError(res)
    }

    let forgotPassword: Record<string, any>
    try {
      // get the one that has not been used
      forgotPassword = await getForgotPassword({ userId, used: false })
      if (!forgotPassword) return this.clientError(res)
    } catch (getError) {
      return this.internalServerError(res)
    }

    const currentDate = moment(new Date())
    // if token is used or expired
    if (forgotPassword.used || currentDate.isAfter(moment(forgotPassword.expirationDate))) return this.unauthorized(res)

    try {
      const tokenMatch = await validateHash(token, forgotPassword.tokenHash)
      // Need special error message?
      if (!tokenMatch) return this.unauthorized(res)
    } catch (compareError) {
      return this.internalServerError(res)
    }

    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(newPassword, 10)
    } catch (hashError) {
      return this.internalServerError(res)
    }

    try {
      await updateForgotPassword(
        { _id: forgotPassword._id },
        { used: true }
      )
    } catch (updateForgotPasswordError) {
      return this.internalServerError(res)
    }

    try {
      const updatedUserPassword = await updateOneUser(
        { _id: userId },
        { password: hashedPassword },
        { projection: { password: 0 } }
      )
      return this.ok(res, updatedUserPassword)
    } catch (updateError) {
      return this.internalServerError(res)
    }
  }

  public info = async (req: Request, res: Response) => {
    const { userId } = req.params
    if (!userId) return this.unauthorized(res)
    try {
      const userInfo = await getUserWithId(
        userId,
        { password: 0, refreshToken: 0, __v: 0, _id: 0 }
      )
      return this.ok(res, userInfo)
    } catch (updateError) {
      return this.internalServerError(res)
    }
  }

  /**
   * Find the user by user id
   * Compare the current/old password with the hashPassword from the db
   * Hash newPassword & update password subsequently
   */
  public updatePassword = async (req: Request, res: Response) => {
    const { password, newPassword } = req.body
    if (!password || !newPassword) return this.clientError(res)

    const { userId } = res.locals
    if (!userId) return this.unauthorized(res)

    let user: Record<string, any>
    let hashedPassword: string

    try {
      user = await getUserWithId(userId, { password: 1 })
      if (!user) return this.unauthorized(res)
    } catch (getUserError) {
      console.log(getUserError)
      return this.internalServerError(res)
    }

    try {
      const passwordMatch = await validateHash(password, user.password)
      if (!passwordMatch) return this.clientError(res, ErrorMessage.EMAIL_OR_PASSWORD_WRONG)
    } catch (compareError) {
      console.log(compareError, 'password compare error')
      return this.internalServerError(res)
    }

    try {
      hashedPassword = await bcrypt.hash(newPassword, 10)
    } catch (hashError) {
      console.log(hashError, 'hash password error')
      return this.internalServerError(res)
    }

    try {
      const updatedUserPassword = await updateOneUser(
        { _id: userId },
        { password: hashedPassword },
        { projection: { password: 0 } }
      )
      return this.ok(res, updatedUserPassword)
    } catch (updateError) {
      return this.internalServerError(res)
    }
  }

  public findUsersWithEmail = async (req: Request, res: Response) => {
    const { email } = req.query
    if (!email) return this.clientError(res)
    try {
      const users = await searchUsersWithEmail(email.toString(), { email: 1 }, {}, 5)
      return this.ok(res, users)
    } catch (findError) {
      return this.internalServerError(res)
    }
  }

  /**
   * Push new role in to user's roles array
   */
  public assignUserRole = async (req: Request, res: Response) => {
    const { userId, companyId, role } = req.body
    // if role is not legit
    if (!userId || !companyId || !role || !Object.values(ROLES).includes(role)) return this.clientError(res)
    try {
      await assignUserRole(userId, companyId, role)
      return this.ok(res)
    } catch (roleError) {
      return this.internalServerError(res)
    }
  }
}
