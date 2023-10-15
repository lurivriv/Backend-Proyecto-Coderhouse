import mongoose from "mongoose"

const usersCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    last_name: {
        type: String,
        required: [true, "El apellido es obligatorio"]
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: [true, "El email ingresado ya tiene una cuenta"]
    },
    age: {
        type: Number,
        required: [true, "La edad es obligatoria"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    },
    role: {
        type: String,
        enum: ["usuario", "admin"],
        default: "usuario"
    }
})

export const usersModel = mongoose.model(usersCollection, userSchema)