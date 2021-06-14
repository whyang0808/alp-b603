import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const validateHash = async (value: string, hash: string) => bcrypt.compare(value, hash)

export const validateJWT = (jwtToken: string, secret: string) => jwt.verify(jwtToken, secret)

/**
 * This function generates a new JWT token and must be used cautiously.
 * Currently using when user sign in and refreshAccessToken in auth controller.
 * @param payload - payload object for JWT
 * @param secret - JWT secret
 * @param options - JWT sign options
 * @returns JWT token
 */
export const generateJWT = (payload: Record<string, any>, secret: string, options: jwt.SignOptions) => jwt.sign(payload, secret, options)
