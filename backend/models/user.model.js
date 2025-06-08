import { model, Schema } from 'mongoose'

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePicture: {
      type: String,
      default: '',
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'x'],
    },
  },
  {
    timestamps: true,
  }
)

export default model('User', UserSchema)
