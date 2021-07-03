import CaseModel from "../models/case"

export const createCase = (data: Record<string, any>) => CaseModel.create(data)

export const findCase = (caseId: string, projection = {}, populate?: string, populateProjection = {}) => populate ? CaseModel.findById(caseId, projection).populate(populate, populateProjection) : CaseModel.findById(caseId, projection)
