import { getPetDatabaseConnection } from '../config/petDb.js'
import { billingRecordSchema } from '../models/BillingRecord.js'

function normalizeText(value) {
  return String(value || '').trim()
}

function normalizeMoney(value) {
  const num = Number(value)
  if (!Number.isFinite(num) || num < 0) {
    return 0
  }
  return Math.round(num * 100) / 100
}

function toMoneyString(value) {
  const amount = normalizeMoney(value)
  return `฿${amount.toFixed(2)}`
}

function getBillingModel(connection) {
  return connection.models.BillingRecord || connection.model('BillingRecord', billingRecordSchema)
}

function calculateTotal(charges) {
  return normalizeMoney(charges.consultationFee) +
    normalizeMoney(charges.serviceCharges) +
    normalizeMoney(charges.medicineCharges) +
    normalizeMoney(charges.labCharges)
}

function serializeBillingRecord(item) {
  return {
    id: item.id,
    invoiceId: item.invoiceId,
    appointmentId: item.appointmentId || '',
    ownerName: item.ownerName,
    petName: item.petName,
    doctorName: item.doctorName || '',
    consultationFee: normalizeMoney(item.consultationFee),
    serviceCharges: normalizeMoney(item.serviceCharges),
    medicineCharges: normalizeMoney(item.medicineCharges),
    labCharges: normalizeMoney(item.labCharges),
    totalAmount: normalizeMoney(item.totalAmount),
    totalAmountDisplay: toMoneyString(item.totalAmount),
    paymentMethod: item.paymentMethod || '',
    paymentDate: item.paymentDate || '',
    referenceNumber: item.referenceNumber || '',
    paymentStatus: item.paymentStatus || 'Pending',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

function buildInvoiceId() {
  const stamp = Date.now().toString().slice(-7)
  return `INV-${stamp}`
}

export async function listBillingRecords(req, res) {
  const connection = await getPetDatabaseConnection()
  const BillingRecord = getBillingModel(connection)

  const status = normalizeText(req.query.status)
  const query = status ? { paymentStatus: status } : {}
  const records = await BillingRecord.find(query).sort({ createdAt: -1 }).limit(500)

  return res.status(200).json({
    records: records.map(serializeBillingRecord),
  })
}

export async function createBillingRecord(req, res) {
  const connection = await getPetDatabaseConnection()
  const BillingRecord = getBillingModel(connection)

  const invoiceId = normalizeText(req.body.invoiceId) || buildInvoiceId()
  const appointmentId = normalizeText(req.body.appointmentId)
  const ownerName = normalizeText(req.body.ownerName)
  const petName = normalizeText(req.body.petName)
  const doctorName = normalizeText(req.body.doctorName)
  const consultationFee = normalizeMoney(req.body.consultationFee)
  const serviceCharges = normalizeMoney(req.body.serviceCharges)
  const medicineCharges = normalizeMoney(req.body.medicineCharges)
  const labCharges = normalizeMoney(req.body.labCharges)

  if (!ownerName || !petName || !doctorName) {
    return res.status(400).json({ message: 'Owner name, pet name, and doctor are required.' })
  }

  const totalAmount = calculateTotal({ consultationFee, serviceCharges, medicineCharges, labCharges })
  const existing = await BillingRecord.findOne({ invoiceId })
  if (existing) {
    return res.status(409).json({ message: 'Invoice ID already exists.' })
  }

  const record = await BillingRecord.create({
    invoiceId,
    appointmentId,
    ownerName,
    petName,
    doctorName,
    consultationFee,
    serviceCharges,
    medicineCharges,
    labCharges,
    totalAmount,
    paymentStatus: 'Pending',
  })

  return res.status(201).json({ record: serializeBillingRecord(record) })
}

export async function updateBillingCharges(req, res) {
  const connection = await getPetDatabaseConnection()
  const BillingRecord = getBillingModel(connection)
  const { billingId } = req.params

  const updates = {}
  if (req.body.consultationFee !== undefined) {
    updates.consultationFee = normalizeMoney(req.body.consultationFee)
  }
  if (req.body.serviceCharges !== undefined) {
    updates.serviceCharges = normalizeMoney(req.body.serviceCharges)
  }
  if (req.body.medicineCharges !== undefined) {
    updates.medicineCharges = normalizeMoney(req.body.medicineCharges)
  }
  if (req.body.labCharges !== undefined) {
    updates.labCharges = normalizeMoney(req.body.labCharges)
  }

  const existing = await BillingRecord.findById(billingId)
  if (!existing) {
    return res.status(404).json({ message: 'Billing record not found.' })
  }

  const consultationFee = updates.consultationFee ?? existing.consultationFee
  const serviceCharges = updates.serviceCharges ?? existing.serviceCharges
  const medicineCharges = updates.medicineCharges ?? existing.medicineCharges
  const labCharges = updates.labCharges ?? existing.labCharges
  updates.totalAmount = calculateTotal({ consultationFee, serviceCharges, medicineCharges, labCharges })

  const record = await BillingRecord.findByIdAndUpdate(billingId, updates, { new: true, runValidators: true })

  return res.status(200).json({ record: serializeBillingRecord(record) })
}

export async function recordBillingPayment(req, res) {
  const connection = await getPetDatabaseConnection()
  const BillingRecord = getBillingModel(connection)
  const { billingId } = req.params

  const updates = {}
  if (req.body.paymentMethod !== undefined) {
    updates.paymentMethod = normalizeText(req.body.paymentMethod)
  }
  if (req.body.paymentDate !== undefined) {
    updates.paymentDate = normalizeText(req.body.paymentDate)
  }
  if (req.body.referenceNumber !== undefined) {
    updates.referenceNumber = normalizeText(req.body.referenceNumber)
  }
  if (req.body.paymentStatus !== undefined) {
    updates.paymentStatus = normalizeText(req.body.paymentStatus)
  }

  const record = await BillingRecord.findByIdAndUpdate(billingId, updates, { new: true, runValidators: true })
  if (!record) {
    return res.status(404).json({ message: 'Billing record not found.' })
  }

  return res.status(200).json({ record: serializeBillingRecord(record) })
}

export async function getBillingReceipt(req, res) {
  const connection = await getPetDatabaseConnection()
  const BillingRecord = getBillingModel(connection)
  const { billingId } = req.params
  const record = await BillingRecord.findById(billingId)
  if (!record) {
    return res.status(404).json({ message: 'Billing record not found.' })
  }

  return res.status(200).json({
    receipt: {
      billingId: record.id,
      invoiceId: record.invoiceId,
      ownerName: record.ownerName,
      petName: record.petName,
      doctorName: record.doctorName || '-',
      appointmentId: record.appointmentId || '',
      consultationFee: toMoneyString(record.consultationFee),
      serviceCharges: toMoneyString(record.serviceCharges),
      medicineCharges: toMoneyString(record.medicineCharges),
      labCharges: toMoneyString(record.labCharges),
      totalAmount: toMoneyString(record.totalAmount),
      paymentMethod: record.paymentMethod || '-',
      paymentDate: record.paymentDate || '-',
      referenceNumber: record.referenceNumber || '-',
      paymentStatus: record.paymentStatus || 'Pending',
      generatedAt: new Date().toISOString(),
    },
  })
}
