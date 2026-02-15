import { Appointment } from '../models/Appointment.js'

export async function createAppointment(req, res) {
  const { petName, doctorName, appointmentDate, appointmentTime, reason } = req.body

  if (!petName || !doctorName || !appointmentDate || !appointmentTime || !reason) {
    return res.status(400).json({
      message: 'Pet, doctor, date, time, and reason are required.',
    })
  }

  const appointment = await Appointment.create({
    petName: String(petName).trim(),
    doctorName: String(doctorName).trim(),
    appointmentDate: String(appointmentDate).trim(),
    appointmentTime: String(appointmentTime).trim(),
    reason: String(reason).trim(),
  })

  return res.status(201).json({
    appointment: {
      id: appointment.id,
      petName: appointment.petName,
      doctorName: appointment.doctorName,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      reason: appointment.reason,
      status: appointment.status,
      createdAt: appointment.createdAt,
    },
  })
}

export async function listAppointments(_req, res) {
  const appointments = await Appointment.find().sort({ createdAt: -1 }).limit(100)

  return res.status(200).json({
    appointments: appointments.map((item) => ({
      id: item.id,
      petName: item.petName,
      doctorName: item.doctorName,
      appointmentDate: item.appointmentDate,
      appointmentTime: item.appointmentTime,
      reason: item.reason,
      status: item.status,
      createdAt: item.createdAt,
    })),
  })
}
