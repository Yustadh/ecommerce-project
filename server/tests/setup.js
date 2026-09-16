import 'dotenv/config'

import mongoose from 'mongoose'

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST)
})

beforeEach(async () => {
  await mongoose.connection.dropDatabase()
})

afterAll(async () => {
  await mongoose.connection.close()
})
