import { loginUser, registerUser } from '../services/authService.js'

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

export const login = async (req, res, next) => {
  try {
    const { token, user } = await loginUser(req.body)

    return res.status(200).json({
      message: 'Login successful',
      token,
      user,
    })
  } catch (error) {
    next(error)
  }
}

export const getCurrentUser = (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user.id,
      role: req.user.role,
    },
  })
}
