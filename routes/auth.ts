import { Router } from 'express'
import AuthController from '../controllers/auth'

const router = Router()
const auth = new AuthController()

router.route('/refresh').post(auth.refreshAccessToken)

export default router
