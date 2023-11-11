import mongoose from "mongoose"
import { CartsService } from "../../../services/carts.service.js"

const usersCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: function() {
            return !this.githubUser
        }
    },
    last_name: {
        type: String,
        required: function() {
            return !this.githubUser
        }
    },
    email: {
        type: String,
        unique: [true, "El email ingresado ya tiene una cuenta"],
        required: function() {
            return !this.githubUser
        }
    },
    age: {
        type: Number,
        required: function() {
            return !this.githubUser
        }
    },
    password: {
        type: String,
        required: function() {
            return !this.githubUser
        }
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    role: {
        type: String,
        enum: ["usuario", "admin"],
        default: "usuario"
    },
    githubUser: {
        type: Boolean,
        default: false
    },
    githubName: {
        type: String
    },
    githubUsername: {
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