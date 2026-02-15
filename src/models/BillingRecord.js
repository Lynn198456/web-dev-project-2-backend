import mongoose from 'mongoose'

export const billingRecordSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    appointmentId: {
      type: String,
      trim: true,
      default: '',
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    petName: {
      type: String,
      required: true,
      trim: true,
    },
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    consultationFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    serviceCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    medicineCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    labCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: '',
    },
    paymentDate: {
      type: String,
      trim: true,
      default: '',
    },
    referenceNumber: {
      type: String,
      trim: true,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
    collection: 'billing_payment_data',
  }
)
