import { Router } from 'express'
import CompanyController from '../controllers/company'
import AuthMiddleware from '../middlewares/auth'

const router = Router()
const auth = new AuthMiddleware()
const company = new CompanyController()

router.post('/create', auth.verifyJWT, company.create)

router.get('/:id', auth.verifyJWT, company.find)

router.post('/update', auth.verifyJWT, company.update)

export default router
