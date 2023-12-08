import mongoose from "mongoose"
import { CartsService } from "../../../services/carts.service.js"
import { logger } from "../../../helpers/logger.js"

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
        unique: true,
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
        unique: true
    }
})

// Asignar carrito al nuevo usuario
userSchema.pre("save", async function(next) {
    try {
        const newCartUser = await CartsService.createCart()
        this.cart = newCartUser._id
    } catch (error) {
        logger.error("new cart user: Error al asignar un carrito al nuevo usuario")
        next(error)
    }
})

export const usersModel = mongoose.model(usersCollection, userSchema)