import { registerUser } from '../services/authService.js'

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body)

    return res.status(201).json({
      message: 'Registration successful',
      user,
    })
  } catch (error) {
    next(error)
  }
}
