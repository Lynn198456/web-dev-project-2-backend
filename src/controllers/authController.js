import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

function normalizeNotificationPreferences(value) {
  const source = value && typeof value === 'object' ? value : {}
  return {
    appointmentReminders: source.appointmentReminders ?? true,
    vaccinationReminders: source.vaccinationReminders ?? true,
    medicalRecordUpdates: source.medicalRecordUpdates ?? true,
    promotionalUpdates: source.promotionalUpdates ?? false,
    appointmentRequestAlerts: source.appointmentRequestAlerts ?? true,
    paymentConfirmationAlerts: source.paymentConfirmationAlerts ?? true,
    doctorScheduleChanges: source.doctorScheduleChanges ?? true,
    weeklyPerformanceSummary: source.weeklyPerformanceSummary ?? false,
  }
}

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    address: user.address || '',
    preferredContact: user.preferredContact || 'Email',
    notificationPreferences: normalizeNotificationPreferences(user.notificationPreferences),
    twoFactorEnabled: Boolean(user.twoFactorEnabled),
    workingDays: user.workingDays || '',
    workingHours: user.workingHours || '',
    breakTime: user.breakTime || '',
    profilePhoto: user.profilePhoto || '',
  }
}

export async function register(req, res) {
  const { name, email, password, role } = req.body
  const normalizedEmail = normalizeEmail(email)

  if (!name || !normalizedEmail || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' })
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' })
  }

  const existingUser = await User.findOne({ email: normalizedEmail })
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash,
    role,
  })

  return res.status(201).json({ user: serializeUser(user) })
}

export async function login(req, res) {
  const { email, password, role } = req.body
  const normalizedEmail = normalizeEmail(email)

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  const user = await User.findOne({ email: normalizedEmail })
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  if (role && role !== user.role) {
    return res.status(403).json({ message: 'Selected role does not match this account.' })
  }

  return res.status(200).json({ user: serializeUser(user) })
}
