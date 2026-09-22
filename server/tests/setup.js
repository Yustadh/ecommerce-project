import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/userModel.js'

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST)
})

beforeEach(async () => {
  await mongoose.connection.dropDatabase()
  await User.syncIndexes()
})

afterAll(async () => {
  await mongoose.connection.close()
})
