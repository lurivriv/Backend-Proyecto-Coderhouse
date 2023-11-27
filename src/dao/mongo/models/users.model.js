import mongoose from "mongoose"
import { CartsService } from "../../../services/carts.service.js"

const usersCollection = "users"

const userSchema = new mongoose.Schema({
    full_name: {
        type: String
    },
    first_name: {
        type: String,
        required: function() {
            return !this.github_user
        }
    },
    last_name: {
        type: String,
        required: function() {
            return !this.github_user
        }
    },
    email: {
        type: String,
        unique: [true, "El email ingresado ya tiene una cuenta"],
        required: function() {
            return !this.github_user
        }
    },
    age: {
        type: Number,
        required: function() {
            return !this.github_user
        }
    },
    password: {
        type: String,
        required: function() {
            return !this.github_user
        }
    },
    role: {
        type: String,
        enum: ["usuario", "admin"],
        default: "usuario"
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    github_user: {
        type: Boolean,
        default: false
    },
    github_name: {
        type: String
    },
    github_username: {
        type: String,
        unique: [true, "El usuario de GitHub ingresado ya tiene una cuenta"]
    }
})

// Asignar carrito al nuevo usuario
userSchema.pre("save", async function(next) {
    try {
        const newCartUser = await CartsService.createCart()
        this.cart = newCartUser._id
    } catch (error) {
        next(error)
    }
})

export const usersModel = mongoose.model(usersCollection, userSchema)