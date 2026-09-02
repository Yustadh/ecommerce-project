export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map((error) => error.message),
    })
  }

  if (err.name === 'CastError') {
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

  res.status(500).json({
    message: 'Internal server error',
  })
}