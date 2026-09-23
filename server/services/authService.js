import User from '../models/userModel.js'
import { hashPassword } from '../utils/password.js'

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
