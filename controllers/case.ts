import { Request, Response } from 'express'
import { createCase, findCase } from '../services/case';
import { BaseController } from "./base";

export default class CaseController extends BaseController {
  public create = async (req: Request, res: Response) => {
    // TODO: check if FE returns "user" or "userId"
    const user = req.body.userId
    delete req.body.userId
    const caseObject = { ...req.body, user }
    try {
      await createCase(caseObject)
      return this.ok(res)
    } catch (createError) {
      return this.internalServerError(res)
    }
  }

  public find = async (req: Request, res: Response) => {
    const { caseId } = req.params
    if (!caseId) return this.clientError(res)
    try {
      const caseData = await findCase(caseId)
      if (!caseData) return this.notFound(res)
      return this.ok(res, caseData)
    } catch (getError) {
      return this.internalServerError(res)
    }
  }
}
