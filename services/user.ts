import { FilterQuery, QueryOptions, UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose'
import { CreateUserInterface, ROLES } from '../types/user'
import UserModel from '../models/user'

export const checkUserExistsWithIdNumber = async (idNumber: string) => UserModel.exists({ idNumber })

export const getUserWithId = async (id: string, projection: Record<string, any> = {}, options: QueryOptions | null = null) => UserModel.findById(id, projection, options)

export const getUserWithEmail = async (email: string, projection: Record<string, any> = {}, options: QueryOptions | null = null) => UserModel.findOne({ email }, projection, options).populate('roles.company')

export const getUserPasswordHash = async (email: string) => UserModel.findOne({ email }, { password: 1, _id: 0 })

export const createUser = async (data: CreateUserInterface) => UserModel.create(data)

export const assignUserRole = async (userId: string, companyId: string, role: ROLES) => UserModel.updateOne({ _id: userId }, { $addToSet: { roles: { company: companyId, role } } })

/**
 * Updates a document without returning the updated document, supposedly faster than findOneAndUpdate.
 */
export const updateOneUser = async (query: FilterQuery<any>, update: UpdateQuery<any> | UpdateWithAggregationPipeline, options: QueryOptions | null = null) => UserModel.updateOne(query, update, options)

/**
 * Updates a document and returns the updated document.
 */
export const findAndUpdateUser = async (query: FilterQuery<any>, update: UpdateQuery<any> | UpdateWithAggregationPipeline, options: QueryOptions | null = null) => UserModel.findOneAndUpdate(query, update, { ...options, new: true })

export const getUserInfo = async (query: FilterQuery<any>, projection: Record<string, any> = {}) => UserModel.findOne(query, projection)

/**
 * Uses mongodb's full text search. email field is indexed in /models/user
 * @param email - string
 * @returns array of users
 */
export const searchUsersWithEmail = async (email: string, projection: Record<string, any> = { email: 1 }, sort = {}, limit = 2) => {
  return UserModel.find(
    { $text: { $search: email } },
    projection,
    { limit, sort: { ...sort, score: { $meta: 'textScore' } } }
  )
}
