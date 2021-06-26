import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { FilterQuery, QueryOptions, UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose'
import { AccessTokenDetails, RefreshTokenDetails } from '../interfaces/token'
import { generateJWT } from '../utils/auth'
import { updateOneUser } from './user'
import { CreateForgotPasswordInterface } from '../interfaces/auth'
import ForgotPasswordModel from '../models/forgotPassword'

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

export const createForgotPassword = async (data: CreateForgotPasswordInterface) => ForgotPasswordModel.create(data)

export const getForgotPassword = async (query: FilterQuery<any>, projection: Record<string, any> = {}, options: QueryOptions | null = null) => ForgotPasswordModel.findOne(query, projection, options)

 export const updateForgotPassword = async (query: FilterQuery<any>, update: UpdateQuery<any> | UpdateWithAggregationPipeline, options: QueryOptions | null = null) =>  ForgotPasswordModel.updateOne(query, update, options)
