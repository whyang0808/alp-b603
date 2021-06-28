import { FilterQuery, QueryOptions, UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose'
import CompanyModel from '../models/company'
import { CreateCompanyInterface } from '../types/company'

export const getCompanyWithId = async (id: string, projection: Record<string, any> = {}, options: QueryOptions | null = null) => CompanyModel.findById(id, projection, options)

export const findOneCompany = async (query: FilterQuery<any>, projection: Record<string, any> = {}, options: QueryOptions | null = null) => CompanyModel.findOne(query, projection, options)

export const createCompany = async (data: CreateCompanyInterface) => CompanyModel.create(data)

/**
 * Updates a document without returning the updated document, supposedly faster than findOneAndUpdate.
 */
export const updateOneCompany = async (query: FilterQuery<any>, update: UpdateQuery<any> | UpdateWithAggregationPipeline, options: QueryOptions | null = null) => CompanyModel.updateOne(query, update, options)
