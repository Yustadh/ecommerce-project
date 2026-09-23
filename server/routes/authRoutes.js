import express from 'express'
import { register } from '../controllers/authController.js'
import { validateRegister } from '../middleware/authValidationMiddleware.js'

const router = express.Router()

router.post('/register', validateRegister, register)

export default router
