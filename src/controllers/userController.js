import { User } from '../models/User.js'

export async function listUsers(req, res) {
  const role = String(req.query.role || '').trim()
  const query = role ? { role } : {}
  const users = await User.find(query).sort({ name: 1 }).limit(500)

  return res.status(200).json({
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      preferredContact: user.preferredContact || 'Email',
    })),
  })
}

export async function getUserProfile(req, res) {
  const { userId } = req.params

  const user = await User.findById(userId)
  if (!user) {
    return res.status(404).json({ message: 'User not found.' })
  }

  return res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      preferredContact: user.preferredContact || 'Email',
    },
  })
}

export async function updateUserProfile(req, res) {
  const { userId } = req.params
  const { name, phone, address, preferredContact } = req.body

  const updates = {}
  if (name !== undefined) {
    updates.name = String(name).trim()
  }
  if (phone !== undefined) {
    updates.phone = String(phone).trim()
  }
  if (address !== undefined) {
    updates.address = String(address).trim()
  }
  if (preferredContact !== undefined) {
    updates.preferredContact = preferredContact
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found.' })
  }

  return res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      preferredContact: user.preferredContact || 'Email',
    },
  })
}
