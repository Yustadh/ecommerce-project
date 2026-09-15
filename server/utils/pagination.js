export const parsePagination = (page, limit) => {
  const parsedPage = Number(page ?? 1)
  const parsedLimit = Number(limit ?? 10)

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    const error = new Error('Invalid page')
    error.statusCode = 400
    throw error
  }

  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    const error = new Error('Invalid limit')
    error.statusCode = 400
    throw error
  }

  return {
    page: parsedPage,
    limit: parsedLimit,
  }
}
