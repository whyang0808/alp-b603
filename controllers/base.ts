import * as express from 'express'

export abstract class BaseController {
  /*
    This class contains reusable methods to handle errors and responses,
    can be extended by other classes.
  */

  public static jsonResponse (
    res: express.Response, code: number, message: string
  ) {
    return res.status(code).json({ message })
  }

  public ok<T> (res: express.Response, dto?: T) {
    if (dto) {
      res.type('application/json')
      return res.status(200).json(dto)
    } else {
      return res.sendStatus(200)
    }
  }

  public created (res: express.Response) {
    return res.sendStatus(201)
  }

  public internalServerError (res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 500, message || 'Internal server error')
  }

  public clientError (res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 400, message || 'Details are incorrect')
  }

  public unauthorized (res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 401, message || 'Unauthorized')
  }

  public paymentRequired (res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 402, message || 'Payment required')
  }

  public forbidden (res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 403, message || 'Forbidden')
  }

  public notFound (res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 404, message || 'Not found')
  }

  public conflict (res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 409, message || 'Conflict')
  }

  public tooMany (res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 429, message || 'Too many requests')
  }

  public fail (res: express.Response, error: Error | string) {
    console.log(error)
    return res.status(500).json({
      message: error.toString()
    })
  }
}
