import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

export const hashPassword = async (password) => {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Password is required')
  }

  return bcrypt.hash(password, SALT_ROUNDS)
}

export const verifyPassword = async (password, hashedPassword) => {
  if (typeof password !== 'string' || password.length === 0) {
    return false
  }

  return bcrypt.compare(password, hashedPassword)
}
