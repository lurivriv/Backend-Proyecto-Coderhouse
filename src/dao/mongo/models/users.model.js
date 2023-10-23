import mongoose from "mongoose"

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
        type: String,
    },
    githubUsername: {
        type: String,
    }
})

export const usersModel = mongoose.model(usersCollection, userSchema)