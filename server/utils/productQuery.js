const allowedProductFields = ['name', 'price', 'category', 'stock']

export const parseProductFields = (fields) => {
  if (fields === undefined) {
    return undefined
  }

  const requestedFields = fields
    .split(',')
    .map((field) => field.trim())
    .filter(Boolean)

  if (requestedFields.length === 0) {
    const error = new Error('Invalid fields')
    error.statusCode = 400
    throw error
  }

  const invalidFields = requestedFields.filter(
    (field) => !allowedProductFields.includes(field),
  )

  if (invalidFields.length > 0) {
    const error = new Error('Invalid fields')
    error.statusCode = 400
    throw error
  }

  return requestedFields.join(' ')
}
