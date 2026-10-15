import jwt from 'jsonwebtoken'

export const createAuthToken = ({
  id = 'test-user-id',
  role = 'customer',
} = {}) => {
  return jwt.sign(
    {
      sub: id,
      role,
    },
    process.env.JWT_SECRET,
  )
}
