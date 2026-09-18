import { parseProductFilters } from '../utils/productFilters.js'

describe('parseProductFilters', () => {
  test('should return empty filters when no query parameters are provided', () => {
    expect(parseProductFilters({})).toEqual({})
  })

  test('should filter by category', () => {
    expect(
      parseProductFilters({
        category: 'Electronics',
      }),
    ).toEqual({
      category: 'Electronics',
    })
  })

  test('should filter by search term case-insensitively', () => {
    expect(
      parseProductFilters({
        search: 'samsung',
      }),
    ).toEqual({
      name: {
        $regex: 'samsung',
        $options: 'i',
      },
    })
  })

  test('should treat regex special characters as literal search text', () => {
    expect(
      parseProductFilters({
        search: 'C++',
      }),
    ).toEqual({
      name: {
        $regex: 'C\\+\\+',
        $options: 'i',
      },
    })
  })

  test('should filter by minimum price', () => {
    expect(
      parseProductFilters({
        minPrice: '100',
      }),
    ).toEqual({
      price: {
        $gte: 100,
      },
    })
  })

  test('should filter by maximum price', () => {
    expect(
      parseProductFilters({
        maxPrice: '500',
      }),
    ).toEqual({
      price: {
        $lte: 500,
      },
    })
  })

  test('should combine minimum and maximum price filters', () => {
    expect(
      parseProductFilters({
        minPrice: '100',
        maxPrice: '500',
      }),
    ).toEqual({
      price: {
        $gte: 100,
        $lte: 500,
      },
    })
  })

  test('should combine category and price filters', () => {
    expect(
      parseProductFilters({
        category: 'Electronics',
        minPrice: '100',
        maxPrice: '500',
      }),
    ).toEqual({
      category: 'Electronics',
      price: {
        $gte: 100,
        $lte: 500,
      },
    })
  })

  test('should reject an invalid minimum price', () => {
    expect(() => parseProductFilters({ minPrice: 'abc' })).toThrow(
      'Invalid minPrice',
    )
  })

  test('should reject a negative minimum price', () => {
    expect(() => parseProductFilters({ minPrice: '-10' })).toThrow(
      'Invalid minPrice',
    )
  })

  test('should reject an invalid maximum price', () => {
    expect(() => parseProductFilters({ maxPrice: 'abc' })).toThrow(
      'Invalid maxPrice',
    )
  })

  test('should reject a negative maximum price', () => {
    expect(() => parseProductFilters({ maxPrice: '-10' })).toThrow(
      'Invalid maxPrice',
    )
  })

  test('should reject when minimum price is greater than maximum price', () => {
    expect(() =>
      parseProductFilters({
        minPrice: '500',
        maxPrice: '100',
      }),
    ).toThrow('minPrice cannot be greater than maxPrice')
  })

  test('should assign a 400 status code to invalid price errors', () => {
    try {
      parseProductFilters({ minPrice: 'abc' })
    } catch (error) {
      expect(error.statusCode).toBe(400)
    }
  })
})
