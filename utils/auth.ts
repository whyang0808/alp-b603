import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const validatePassword = async (password: string, hash: string) => bcrypt.compare(password, hash)

export const validateJWT = async (jwtToken: string, secret: string) => jwt.verify(jwtToken, secret)

/**
 * This function generates a new JWT token and must be used cautiously.
 * Currently using when user sign in and refreshAccessToken in auth controller.
 * @param payload - payload object for JWT
 * @param secret - JWT secret
 * @param options - JWT sign options
 * @returns JWT token
 */
export const generateJWT = async (payload: object, secret: string, options: jwt.SignOptions) => jwt.sign(payload, secret, options)
