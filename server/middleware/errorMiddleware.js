export const errorMiddleware = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map((error) => error.message),
    })
  }

  if (err.name === 'CastError' && err.path === '_id') {
    return res.status(400).json({
      message: 'Invalid product ID',
    })
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'Invalid JSON',
    })
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Duplicate resource',
    })
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
    })
  }
  res.status(500).json({
    message: 'Internal server error',
  })
}
