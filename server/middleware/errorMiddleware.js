export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      error: err.message,
    })
  }

  res.status(500).json({
    message: 'Internal server error',
  })
}