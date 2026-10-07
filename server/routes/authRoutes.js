import express from 'express'
import {
  getCurrentUser,
  login,
  register,
} from '../controllers/authController.js'
import {
  validateLogin,
  validateRegister,
} from '../middleware/authValidationMiddleware.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.get('/me', authenticate, getCurrentUser)

export default router
