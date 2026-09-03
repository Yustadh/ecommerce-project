export const validateProduct = (req, res, next) => {
  const { name, price, category, stock } = req.body

  const errors = []

  if (typeof name !== 'string' || name.trim() === '') {
    errors.push('Name must be a non-empty string')
  }

  if (typeof price !== 'number' || price < 0) {
    errors.push('Price must be a non-negative number')
  }

  if (typeof category !== 'string' || category.trim() === '') {
    errors.push('Category must be a non-empty string')
  }

  if (typeof stock !== 'number' || stock < 0) {
    errors.push('Stock must be a non-negative number')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors,
    })
  }

  next()
}

export const validateUpdateProduct = (req, res, next) => {
  const errors = []

  if (Object.keys(req.body).length === 0) {
    errors.push('At least one field is required for an update')
  }

  const allowedFields = ['name', 'price', 'category', 'stock']

  for (const field of Object.keys(req.body)) {
    if (!allowedFields.includes(field)) {
      errors.push(`Unknown field: ${field}`)
    }
  }

  if (Object.hasOwn(req.body, 'name')) {
    if (typeof req.body.name !== 'string' || req.body.name.trim() === '') {
      errors.push('Name must be a non-empty string')
    }
  }

  if (Object.hasOwn(req.body, 'price')) {
    if (typeof req.body.price !== 'number' || req.body.price < 0) {
      errors.push('Price must be a non-negative number')
    }
  }

  if (Object.hasOwn(req.body, 'category')) {
    if (
      typeof req.body.category !== 'string' ||
      req.body.category.trim() === ''
    ) {
      errors.push('Category must be a non-empty string')
    }
  }

  if (Object.hasOwn(req.body, 'stock')) {
    if (typeof req.body.stock !== 'number' || req.body.stock < 0) {
      errors.push('Stock must be a non-negative number')
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors,
    })
  }

  next()
}
