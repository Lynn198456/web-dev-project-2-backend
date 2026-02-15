export function notFoundHandler(_req, res) {
  res.status(404).json({ message: 'Route not found.' })
}

export function errorHandler(error, _req, res, _next) {
  console.error(error)

  if (error?.name === 'ValidationError') {
    return res.status(400).json({ message: error.message })
  }

  if (error?.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Uploaded data is too large. Please use a smaller image.' })
  }

  if (error?.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid identifier format.' })
  }

  if (error?.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value error.' })
  }

  if (String(error?.code || '').includes('ECONNREFUSED') || String(error?.message || '').includes('querySrv')) {
    return res.status(503).json({ message: 'Database connection failed. Check MongoDB connection and try again.' })
  }

  return res.status(500).json({ message: 'Internal server error.' })
}
