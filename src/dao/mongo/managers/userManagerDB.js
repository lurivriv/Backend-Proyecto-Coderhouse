import { usersModel } from "../models/users.model.js"

export class UserManagerDB {
    constructor() {
        this.model = usersModel
    }

    // Signup
    async registerUser(signupForm) {
        try {
            const result = await this.model.create(signupForm)
            return result
        } catch (error) {
            throw new Error ("Error al completar el registro")
        }
    }

    // Login
    async loginUser(loginIdentifier, isGithubLogin = false) {
        try {
            if (isGithubLogin) {
                const result = await this.model.findOne({ github_username: loginIdentifier })
                return result
            } else {
                const result = await this.model.findOne({ email: loginIdentifier })
                return result
            }
        } catch (error) {
            throw new Error ("Error al iniciar sesión")
        }
    }

    // Obtener todos los usuarios
    async getUsers() {
        try {
            const result = await this.model.find().lean()
            return result
        } catch (error) {
            throw new Error("Error al obtener los usuarios")
        }
    }

    // Obtener un usuario por ID
    async getUserById(userId){
        try {
            const result = await this.model.findById(userId).lean()

            if (!result) {
                throw error
            }

            return result
        } catch (error) {
            throw new Error("Error al obtener el usuario")
        }
    }
}