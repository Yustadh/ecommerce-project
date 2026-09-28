import express from 'express'
import { login, register } from '../controllers/authController.js'
import {
  validateLogin,
  validateRegister,
} from '../middleware/authValidationMiddleware.js'

const router = express.Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)

export default router
