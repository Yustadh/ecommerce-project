import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = 5000

connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
