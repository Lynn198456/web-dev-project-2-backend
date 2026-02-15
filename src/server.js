import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDatabase } from './config/db.js'
import { authRouter } from './routes/authRoutes.js'
import { healthRouter } from './routes/healthRoutes.js'
import { appointmentRouter } from './routes/appointmentRoutes.js'
import { petRouter } from './routes/petRoutes.js'
import { userRouter } from './routes/userRoutes.js'
import { consultationRouter } from './routes/consultationRoutes.js'
import { prescriptionRouter } from './routes/prescriptionRoutes.js'
import { doctorScheduleRouter } from './routes/doctorScheduleRoutes.js'
import { billingRouter } from './routes/billingRoutes.js'
import { reportRouter } from './routes/reportRoutes.js'
import { medicalRecordRouter } from './routes/medicalRecordRoutes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

const app = express()
const port = Number(process.env.PORT) || 5000
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(
  cors({
    origin: frontendUrl,
  })
)
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/appointments', appointmentRouter)
app.use('/api/pets', petRouter)
app.use('/api/users', userRouter)
app.use('/api/consultations', consultationRouter)
app.use('/api/prescriptions', prescriptionRouter)
app.use('/api/doctor-schedule', doctorScheduleRouter)
app.use('/api/billing', billingRouter)
app.use('/api/reports', reportRouter)
app.use('/api/medical-records', medicalRecordRouter)

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
