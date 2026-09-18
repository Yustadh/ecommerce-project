const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const parseProductFilters = (query = {}) => {
  const filters = {}

  if (query.category) {
    filters.category = query.category
  }

  if (query.search) {
    filters.name = {
      $regex: escapeRegex(query.search),
      $options: 'i',
    }
  }

  if (query.minPrice !== undefined) {
    const minPrice = Number(query.minPrice)

    if (Number.isNaN(minPrice) || minPrice < 0) {
      const error = new Error('Invalid minPrice')
      error.statusCode = 400
      throw error
    }

    filters.price = {
      ...filters.price,
      $gte: minPrice,
    }
  }

  if (query.maxPrice !== undefined) {
    const maxPrice = Number(query.maxPrice)

    if (Number.isNaN(maxPrice) || maxPrice < 0) {
      const error = new Error('Invalid maxPrice')
      error.statusCode = 400
      throw error
    }

    filters.price = {
      ...filters.price,
      $lte: maxPrice,
    }
  }

  if (
    filters.price?.$gte !== undefined &&
    filters.price?.$lte !== undefined &&
    filters.price.$gte > filters.price.$lte
  ) {
    const error = new Error('minPrice cannot be greater than maxPrice')
    error.statusCode = 400
    throw error
  }

  return filters
}
