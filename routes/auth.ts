import { Router } from 'express'
import AuthController from '../controllers/auth'

const router = Router()
const auth = new AuthController()

router.route('/refresh').post((req, res) => auth.refreshAccessToken(req, res))

export default router
