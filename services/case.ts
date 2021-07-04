import CaseModel from "../models/case"

export const createCase = (data: Record<string, any>) => CaseModel.create(data)

export const findCase = (caseId: string, projection = {}, populateUser = false, populateProjection = {}) => populateUser ? CaseModel.findById(caseId, projection).populate('user', populateProjection) : CaseModel.findById(caseId, projection)
