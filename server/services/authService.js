import User from '../models/userModel.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { generateToken } from '../utils/token.js'

export const registerUser = async ({ name, email, password }) => {
  const hashedPassword = await hashPassword(password)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'customer',
  })

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    const error = new Error('Invalid email or password')
    error.statusCode = 401
    throw error
  }

  const passwordMatches = await verifyPassword(password, user.password)

  if (!passwordMatches) {
    const error = new Error('Invalid email or password')
    error.statusCode = 401
    throw error
  }

  const token = generateToken(user)

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}
