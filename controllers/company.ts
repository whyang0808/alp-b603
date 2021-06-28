import { Request, Response } from 'express'
import { createCompany, findOneCompany, updateOneCompany } from '../services/company'
import { CreateCompanyInterface } from '../types/company'
import { ErrorMessage } from '../types/error'
import { BaseController } from './base'

export default class CompanyController extends BaseController {
  public create = async (req: Request, res: Response) => {
    const { registrationId, name, approved } = req.body
    if (!registrationId || !name) return this.clientError(res)
    // defaults "approved" to false
    const createCompanyData: CreateCompanyInterface = { registrationId, name, approved: !!approved }

    try {
      const companyExists = await findOneCompany({ registrationId }, { _id: 1 })
      if (companyExists) return this.clientError(res, ErrorMessage.COMPANY_EXISTS)
    } catch (companyExistsError) {
      return this.internalServerError(res)
    }

    try {
      const response = await createCompany(createCompanyData)
      return this.ok(res, response)
    } catch (createCompanyError) {
      return this.internalServerError(res)
    }
  }

  /**
   * Finds a company by mongodb id (not to be confused with registrationId)
   */
  public find = async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) return this.clientError(res)
    try {
      const company = await findOneCompany({ _id: id })
      return this.ok(res, company)
    } catch (findError) {
      return this.internalServerError(res)
    }
  }

  public update = async (req: Request, res: Response) => {
    const { registrationId, name, approved, id } = req.body
    if (!registrationId || !name || !approved || !id) return this.clientError(res)
    try {
      // check if company with existing registration number already exists (in case user wants to update company registration number)
      const companyExists = await findOneCompany({ registrationId }, { _id: 1 })
      if (companyExists && companyExists._id.toString() !== id) return this.clientError(res, ErrorMessage.COMPANY_EXISTS)
    } catch (companyExistsError) {
      return this.internalServerError(res)
    }

    try {
      await updateOneCompany(
        { _id: id },
        { registrationId, name, approved }
      )
      return this.ok(res)
    } catch (updateError) {
      return this.internalServerError(res)
    }
  }
}
