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
        enum: ["usuario", "admin", "premium"],
        default: "usuario"
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    documents: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                reference: {
                    type: String,
                    required: true
                }
            }
        ],
        default: []
    },
    last_connection: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        required: true,
        enum: ["pendiente", "incompleto", "completo"],
        default: "pendiente"
    },
    avatar: {
        type: String,
        default: "noImgProfile-profile.jpg"
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
        logger.error(`new cart user error: Error al asignar un carrito al nuevo usuario: ${error}`)
        next(error)
    }
})

export const usersModel = mongoose.model(usersCollection, userSchema)