import { Router } from 'express'
import UserController from '../controllers/user'
import AuthMiddleware from '../middlewares/auth'

const router = Router()
const auth = new AuthMiddleware()
const user = new UserController()

router.route('/create').post((req, res) => user.create(req, res))

router.route('/login').post((req, res) => user.logIn(req, res))

export default router
