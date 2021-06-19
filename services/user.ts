import { FilterQuery, QueryOptions, UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose'
import { CreateUserInterface } from '../types/user'
import UserModel from '../models/user'

export const checkUserExistsWithIdNumber = async (idNumber: string) => UserModel.exists({ idNumber })

export const getUserWithId = async (id: string, projection: Record<string, any> = {}, options: QueryOptions | null = null) => UserModel.findById(id, projection, options)

export const getUserWithEmail = async (email: string, projection: Record<string, any> = {}, options: QueryOptions | null = null) => UserModel.findOne({ email }, projection, options)

export const getUserPasswordHash = async (email: string) => UserModel.findOne({ email }, { password: 1, _id: 0 })

export const createUser = async (data: CreateUserInterface) => UserModel.create(data)

export const updateOneUser = async (query: FilterQuery<any>, update: UpdateQuery<any> | UpdateWithAggregationPipeline, options: QueryOptions | null = null) =>  UserModel.updateOne(query, update, options)
