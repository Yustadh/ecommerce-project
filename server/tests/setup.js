import 'dotenv/config'
import mongoose from 'mongoose'

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})