const allowedSortFields = ['createdAt', 'name', 'price', 'stock']
const allowedSortOrders = ['asc', 'desc']

export const parseSort = (sort, order) => {
  const sortField = sort ?? 'createdAt'
  const sortOrder = order ?? 'desc'

  if (!allowedSortFields.includes(sortField)) {
    const error = new Error('Invalid sort field')
    error.statusCode = 400
    throw error
  }

  if (!allowedSortOrders.includes(sortOrder)) {
    const error = new Error('Invalid sort order')
    error.statusCode = 400
    throw error
  }

  return {
    [sortField]: sortOrder === 'asc' ? 1 : -1,
    _id: -1,
  }
}
