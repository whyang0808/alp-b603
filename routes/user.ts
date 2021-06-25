import { Router } from 'express'
import UserController from '../controllers/user'
import AuthMiddleware from '../middlewares/auth'

const router = Router()
const auth = new AuthMiddleware()
const user = new UserController()

router.route('/create').post(user.create)

router.route('/login').post(user.logIn)

router.route('/update').post(auth.verifyJWT, user.update)

/**
 * ????
 * const { userId } = res.locals from auth.verifyJWT
 * SYNTAX 1: router.get('/get-user-info', auth.verifyJWT, user.info)
 * ----- OR -----
 *
 * const { userId } = req.params
 * router.get('/get-user-info/:userId', auth.verifyJWT, user.info)
 */
router.get('/get-user-info/:userId', auth.verifyJWT, user.info)

router.post('/update-password', auth.verifyJWT, user.updatePassword)

export default router
