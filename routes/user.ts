import { Router } from 'express'
import UserController from '../controllers/user'
import AuthMiddleware from '../middlewares/auth'

const router = Router()
const auth = new AuthMiddleware()
const user = new UserController()

router.route('/create').post(user.create)

router.route('/login').post(user.logIn)

router.route('/update').post(auth.verifyJWT, user.update)

router.route('/forgot-password').post(user.generateForgotPasswordLink)

router.route('/reset-password').post(user.resetPassword)

export default router
