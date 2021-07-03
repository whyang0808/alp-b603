import CaseModel from "../models/case"

export const createCase = (data: Record<string, any>) => CaseModel.create(data)
