import { usersModel } from "./models/users.model.js"

export class SessionManagerDB {
    constructor() {
        this.model = usersModel
    }

    // Signup
    async registerUser(signupForm) {
        try {
            const result = await this.model.create(signupForm)
            return result
        } catch (error) {
            console.log("registerUser: ", error.message)
            throw new Error ("Error al completar el registro")
        }
    }

    // Login
    async loginUser(email) {
        try {
            const result = await this.model.findOne({ email })
            return result
        } catch (error) {
            console.log("loginUser: ", error.message)
            throw new Error ("Error al iniciar sesión. Volve a ingresar los datos")
        }
    }

    // Obtener un usuario por ID
    async getUserById(id){
        try {
            const result = await this.model.findById(id)
            return result
        } catch (error) {
            console.log("getUserById: ", error.message)
            throw new Error("Error al obtener el usuario")
        }
    }
}