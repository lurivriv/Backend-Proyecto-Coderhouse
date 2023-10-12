import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Base de datos conectada con éxito")
    } catch {
        console.log("Error al conectar la base de datos: ", error.message)
    }
}