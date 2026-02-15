import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['pet-owner', 'doctor', 'staff'],
      default: 'pet-owner',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    preferredContact: {
      type: String,
      enum: ['Email', 'Phone', 'SMS'],
      default: 'Email',
    },
    notificationPreferences: {
      appointmentReminders: {
        type: Boolean,
        default: true,
      },
      vaccinationReminders: {
        type: Boolean,
        default: true,
      },
      medicalRecordUpdates: {
        type: Boolean,
        default: true,
      },
      promotionalUpdates: {
        type: Boolean,
        default: false,
      },
      appointmentRequestAlerts: {
        type: Boolean,
        default: true,
      },
      paymentConfirmationAlerts: {
        type: Boolean,
        default: true,
      },
      doctorScheduleChanges: {
        type: Boolean,
        default: true,
      },
      weeklyPerformanceSummary: {
        type: Boolean,
        default: false,
      },
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    workingDays: {
      type: String,
      trim: true,
      default: '',
    },
    workingHours: {
      type: String,
      trim: true,
      default: '',
    },
    breakTime: {
      type: String,
      trim: true,
      default: '',
    },
    profilePhoto: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'UserData',
  }
)

export const User = mongoose.model('User', userSchema)
