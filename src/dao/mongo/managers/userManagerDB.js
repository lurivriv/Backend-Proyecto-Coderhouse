import { usersModel } from "../models/users.model.js"
import { logger } from "../../../helpers/logger.js"

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
            logger.error(`register user error: Error al completar el registro: ${error}`)
            throw new Error(`register user error: Error al completar el registro: ${error}`)
        }
    }

    // Login
    async loginUser(loginIdentifier, isGithubLogin = false) {
        try {
            if (isGithubLogin) {
                const result = await this.model.findOne({ github_username: loginIdentifier }).lean()
                return result
            } else {
                const result = await this.model.findOne({ email: loginIdentifier }).lean()
                return result
            }
        } catch (error) {
            logger.error(`login user error: Error al iniciar sesión: ${error}`)
            throw new Error(`login user error: Error al iniciar sesión: ${error}`)
        }
    }

    // Obtener todos los usuarios
    async getUsers() {
        try {
            const result = await this.model.find().lean()
            return result
        } catch (error) {
            logger.error(`get users error: Error al obtener los usuarios: ${error}`)
            throw new Error(`get users error: Error al obtener los usuarios: ${error}`)
        }
    }

    // Obtener un usuario por ID
    async getUserById(userId) {
        try {
            const result = await this.model.findById(userId).lean()

            if (!result) {
                throw error
            }

            return result
        } catch (error) {
            logger.error(`get user by id error: Error al obtener el usuario: ${error}`)
            throw new Error(`get user by id error: Error al obtener el usuario: ${error}`)
        }
    }

    // Actualizar un usuario
    async updateUser(userId, user) {
        try {
            const result = await this.model.findByIdAndUpdate(userId, user, { new: true })

            if (!result) {
                throw error
            }
            
            return result
        } catch (error) {
            logger.error(`update user error: Error al actualizar el usuario: ${error}`)
            throw new Error(`update user error: Error al actualizar el usuario: ${error}`)
        }
    }

    // Eliminar un usuario
    async deleteUser(userId) {
        try {
            const result = await this.model.findByIdAndDelete(userId)
            
            if (!result) {
                throw error
            }

            return result
        } catch (error) {
            logger.error(`delete user error: Error al eliminar el usuario: ${error}`)
            throw new Error(`delete user error: Error al eliminar el usuario: ${error}`)
        }
    }

    //Eliminar usuarios inactivos
    async deleteInactiveUsers(lastConnection) {
        try {
            const result = await this.model.find(lastConnection).lean()
            return result
        } catch (error) {
            logger.error(`delete inactive users error: Error al eliminar los usuarios inactivos: ${error}`)
            throw new Error(`delete inactive users error: Error al eliminar los usuarios inactivos: ${error}`)
        }
    }
}