import { hashPassword, verifyPassword } from '../utils/password.js'

describe('Password utility', () => {
  test('should hash a password', async () => {
    const password = 'password123'

    const hashedPassword = await hashPassword(password)

    expect(hashedPassword).not.toBe(password)
    expect(hashedPassword).toMatch(/^\$2[aby]\$/)
  })

  test('should generate different hashes for the same password', async () => {
    const password = 'password123'

    const firstHash = await hashPassword(password)
    const secondHash = await hashPassword(password)

    expect(firstHash).not.toBe(secondHash)
  })

  test('should verify the correct password', async () => {
    const password = 'password123'
    const hashedPassword = await hashPassword(password)

    await expect(verifyPassword(password, hashedPassword)).resolves.toBe(true)
  })

  test('should reject an incorrect password', async () => {
    const password = 'password123'
    const wrongPassword = 'wrongpassword'
    const hashedPassword = await hashPassword(password)

    await expect(verifyPassword(wrongPassword, hashedPassword)).resolves.toBe(
      false,
    )
  })

  test('should reject an empty password', async () => {
    await expect(hashPassword('')).rejects.toThrow()
  })

  test('should return false for an empty password during verification', async () => {
    const hashedPassword = await hashPassword('password123')

    await expect(verifyPassword('', hashedPassword)).resolves.toBe(false)
  })
})
