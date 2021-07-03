import { Request, Response } from 'express'
import { createCase } from '../services/case';
import { BaseController } from "./base";

export default class CaseController extends BaseController {
  public create = async (req: Request, res: Response) => {
    // TODO: check if FE returns "user" or "userId"
    const caseObject = { ...req.body, user: req.body.userId }
    try {
      await createCase(caseObject)
      return this.ok(res)
    } catch (createError) {
      return this.internalServerError(res)
    }
  }
}
