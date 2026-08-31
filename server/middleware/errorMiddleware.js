export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      error: err.message,
    })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid product ID',
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