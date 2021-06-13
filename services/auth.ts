import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { AccessTokenDetails, RefreshTokenDetails } from "../interfaces/token"
import { generateJWT } from "../utils/auth"
import { updateOneUser } from './user'

dotenv.config()
const { JWT_SECRET } = process.env

/**
 * Generates both access token and refresh token, then save new hashed refresh token in user db.
 * @param accessTokenDetails - An object containing access token payload and options.
 * @param refreshTokenPayload - An object containing refresh token payload and options.
 * @returns A promise of an array of string where by the first value is the access token and second value is the refresh token.
 */
export const generateAccessAndRefreshToken = async (accessTokenDetails: AccessTokenDetails, refreshTokenPayload: RefreshTokenDetails, userId: string) => {
  if (!JWT_SECRET) throw 'secret missing'
  let accessToken, refreshToken
  try {
    const tokens = await Promise.all([
      generateJWT(accessTokenDetails.payload, JWT_SECRET, accessTokenDetails.options),
      generateJWT(refreshTokenPayload.payload, JWT_SECRET, refreshTokenPayload.options)
    ])
    accessToken = tokens[0]
    refreshToken = tokens[1]
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
