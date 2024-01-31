import { UsersService } from "../services/users.service.js"
import { generateEmailToken, sendChangePasswordEmail, verifyEmailToken } from "../helpers/email.js"
import { logger } from "../helpers/logger.js"
import { createHash, isValidPassword } from "../utils.js"

export class SessionsController {
    static registerUser = (req, res) => {
        res.render("login", { message: "Usuario registrado :)" })
    }

    static failSignup = (req, res) => {
        // Error customizado
        logger.error("signup error: Error al completar el registro")
        res.render("signup", { error: `
                                    Error al completar el registro

                                    Todos los campos son obligatorios:
                                    * Nombre: debe ser un texto
                                    * Apellido: debe ser un texto
                                    * Edad: debe ser un número
                                    * Email: no debe tener una cuenta ya existente
                                    * Contraseña: es obligatoria
                                `
        })
    }

    static loginUser = (req, res) => {
        res.redirect("/products")
    }

    static failLogin = (req, res) => {
        logger.error("login error: Error al iniciar sesión")
        res.render("login", { error: `
                                    Error al iniciar sesión

                                    Volve a ingresar los datos:
                                    * El email ingresado debe ser de una cuenta existente
                                    * La contraseña puede estar incorrecta
                                ` 
        })
    }

    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body
            const user = await UsersService.loginUser(email)         
            const emailToken = generateEmailToken(email, 60 * 60)

            if (email == "") {
                return res.render("forgotPassword", { error: "Tenés que ingresar tu email" })
            }

            await sendChangePasswordEmail(req, email, emailToken)

            res.render("forgotPassword", { message: "Se envío el link para restablecer tu contraseña a tu email" })
        } catch (error) {
            logger.error(`forgot password error: Error al obtener el restablecimiento de contraseña: ${error}`)
            res.json({ status: "error", error: "Error al obtener el restablecimiento de contraseña" })
        }
    }

    static resetPassword = async (req, res) => {
        try {
            const token = req.query.token
            const { newPassword } = req.body
            const validEmail = await verifyEmailToken(token)

            if (!validEmail) {
                return res.render("resetPassword", { message: "El link para restablecer tu contraseña ha expirado" })
            }

            const user = await UsersService.loginUser(validEmail)

            if (!user) {
                return res.render("resetPassword", { message: "Esta acción no es válida. El usuario no fue encontrado" })
            }

            if (isValidPassword(newPassword, user) || newPassword == "") {
                return res.render("resetPassword", { token, error: "Contraseña inválida" })
            }

            const userData = {
                ...user,
                password: createHash(newPassword)
            }

            await UsersService.updateUser(user._id, userData)

            res.render("login", { message: "Contraseña actualizada :)" })
        } catch (error) {
            logger.error(`reset password error: Error al cambiar la contraseña: ${error}`)
            res.json({ status: "error", error: "Error al cambiar la contraseña" })
        }
    }

    static logout = async (req, res) => {
        try {
            // Nueva fecha de cierre de sesión
            const user = { ...req.user }
            user.last_connection = new Date()
            await UsersService.updateUser(user._id, user)

            req.session.destroy((err) => {
                if (err) {
                    logger.error("logout: Error al cerrar la sesión")
                    return res.render("profile", { error: "Error al cerrar la sesión" })
                } else {
                    return res.redirect("/login")
                }
            })
        } catch (error) {
            logger.error(`logout error: Error al cerrar la sesión: ${error}`)
            res.render("logout", { error: "Error al cerrar la sesión" })
        }
    }
}