import { Router } from 'express'
import CaseController from '../controllers/case'
import AuthMiddleware from '../middlewares/auth'

const router = Router()
const auth = new AuthMiddleware()
const cases = new CaseController()

router.post('/create', auth.verifyJWT, cases.create)

router.get('/:caseId', auth.verifyJWT, cases.find)

export default router
