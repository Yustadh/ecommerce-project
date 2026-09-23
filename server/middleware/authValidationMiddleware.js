const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof email !== 'string' ||
    !email.trim() ||
    !emailPattern.test(email.trim()) ||
    typeof password !== 'string' ||
    password.length < 8
  ) {
    return res.status(400).json({
      message: 'Name, email, and password are required',
    })
  }

  req.body.name = name.trim()
  req.body.email = email.trim().toLowerCase()

  next()
}
