import { Router } from 'express'
import UserController from '../controllers/user'
import AuthMiddleware from '../middlewares/auth'

const router = Router()
const auth = new AuthMiddleware()
const user = new UserController()

router.post('/create', user.create)

router.post('/login', user.logIn)

router.post('/update', auth.verifyJWT, user.update)

router.post('/forgot-password', user.generateForgotPasswordLink)

router.get('/verify-hashed-reset-password-token', user.verifyHashedResetPasswordToken)

router.post('/reset-password', user.resetPassword)

router.get('/get-user-info/:userId', auth.verifyJWT, user.info)

router.post('/update-password', auth.verifyJWT, user.updatePassword)

router.get('/find-users', auth.verifyJWT, user.findUsersWithEmail)

router.post('/assign-role', auth.verifyJWT, user.assignUserRole)

export default router
