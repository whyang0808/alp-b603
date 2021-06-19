import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { AccessTokenDetails, RefreshTokenDetails } from '../types/token'
import { generateJWT } from '../utils/auth'
import { updateOneUser } from './user'

dotenv.config()
const { JWT_SECRET } = process.env

/**
 * Generates both access token and refresh token, then save new hashed refresh token in user db.
 * @param accessTokenDetails - An object containing access token payload and options.
 * @param refreshTokenPayload - An object containing refresh token payload and options.
 * @returns An object containing the access token and refresh token.
 */
export const generateAccessAndRefreshToken = async (accessTokenDetails: AccessTokenDetails, refreshTokenPayload: RefreshTokenDetails, userId: string) => {
  if (!JWT_SECRET) throw 'secret missing'
  let accessToken: string, refreshToken: string
  try {
    accessToken = generateJWT(accessTokenDetails.payload, JWT_SECRET, accessTokenDetails.options)
    refreshToken = generateJWT(refreshTokenPayload.payload, JWT_SECRET, refreshTokenPayload.options)
  } catch (generateError) {
    throw generateError
  }

  let refreshTokenHash
  try {
    refreshTokenHash = await bcrypt.hash(refreshToken, 10)
  } catch (hashError) {
    throw hashError
  }

  try {
    await updateOneUser({ _id: userId }, { refreshToken: refreshTokenHash })
  } catch (userError) {
    throw userError
  }

  return { accessToken, refreshToken }
}
