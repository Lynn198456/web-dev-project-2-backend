import { Router } from 'express'
import { createAppointment, listAppointments, updateAppointment } from '../controllers/appointmentController.js'

const appointmentRouter = Router()

appointmentRouter.get('/', listAppointments)
appointmentRouter.post('/', createAppointment)
appointmentRouter.put('/:appointmentId', updateAppointment)

export { appointmentRouter }
