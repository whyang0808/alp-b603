import { Router } from 'express'
import UserController from '../controllers/user'
import AuthMiddleware from '../middlewares/auth'

const router = Router()
const auth = new AuthMiddleware()
const user = new UserController()

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - birthDate
 *         - idType
 *         - idNumber
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         firstName:
 *           type: string
 *           description: The first name
 *         lastName:
 *           type: string
 *           description: The last name
 *         email:
 *           type: string
 *           description: The email
 *         birthDate:
 *           type: string
 *           description: The birth date
 *         idType:
 *           type: string
 *           description: The identity type
 *         idNumber:
 *           type: string
 *           description: The identity number
 *         password:
 *           type: string
 *           description: The password
 *       example:
 *         id: d5fE_asz
 *         firstName: Xiaoping
 *         lastName: Li
 *         email: xpingli@gmail.com
 *         birthDate: 08/08/1988
 *         idType: IC
 *         idNumber: 880808101234
 *         password: abcd1234
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The login password
 */

 /**
  * @swagger
  * tags:
  *   name: User
  *   description: The user managing API
  */

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create an user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: Created
 */
router.route('/create').post((req, res) => user.create(req, res))

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login an user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       '200':
 *         description: Logged in
 */
router.route('/login').post((req, res) => user.logIn(req, res))

export default router
