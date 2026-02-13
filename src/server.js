import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDatabase } from './config/db.js'
import { authRouter } from './routes/authRoutes.js'
import { healthRouter } from './routes/healthRoutes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

const app = express()
const port = Number(process.env.PORT) || 5000
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(
  cors({
    origin: frontendUrl,
  })
)
app.use(express.json())

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)

app.use(notFoundHandler)
app.use(errorHandler)

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error)
    process.exit(1)
  })
