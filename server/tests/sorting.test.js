import { parseSort } from '../utils/sorting.js'

describe('parseSort', () => {
  test('should use default sorting', () => {
    expect(parseSort()).toEqual({
      createdAt: -1,
      _id: -1,
    })
  })

  test('should sort by name ascending', () => {
    expect(parseSort('name', 'asc')).toEqual({
      name: 1,
      _id: -1,
    })
  })

  test('should sort by price descending', () => {
    expect(parseSort('price', 'desc')).toEqual({
      price: -1,
      _id: -1,
    })
  })

  test('should sort by stock ascending', () => {
    expect(parseSort('stock', 'asc')).toEqual({
      stock: 1,
      _id: -1,
    })
  })

  test('should sort by createdAt ascending', () => {
    expect(parseSort('createdAt', 'asc')).toEqual({
      createdAt: 1,
      _id: -1,
    })
  })

  test('should reject an unknown sort field', () => {
    expect(() => parseSort('password', 'asc')).toThrow('Invalid sort field')
  })

  test('should reject an invalid sort order', () => {
    expect(() => parseSort('price', 'sideways')).toThrow('Invalid sort order')
  })

  test('should attach a 400 status code to sort field errors', () => {
    try {
      parseSort('password', 'asc')
    } catch (error) {
      expect(error.statusCode).toBe(400)
    }
  })

  test('should attach a 400 status code to sort order errors', () => {
    try {
      parseSort('price', 'sideways')
    } catch (error) {
      expect(error.statusCode).toBe(400)
    }
  })
})
