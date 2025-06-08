import mongoose from 'mongoose'

export default async function () {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)

    console.log(`---- MONGODB CONNECTED: ${conn.connection.name} ----`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
