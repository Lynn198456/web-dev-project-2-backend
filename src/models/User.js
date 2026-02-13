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
  },
  {
    timestamps: true,
    collection: 'UserData',
  }
)

export const User = mongoose.model('User', userSchema)
