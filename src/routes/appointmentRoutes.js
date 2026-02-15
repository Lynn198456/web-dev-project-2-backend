import { Router } from 'express'
import { createAppointment, listAppointments } from '../controllers/appointmentController.js'

const appointmentRouter = Router()

appointmentRouter.get('/', listAppointments)
appointmentRouter.post('/', createAppointment)

export { appointmentRouter }
