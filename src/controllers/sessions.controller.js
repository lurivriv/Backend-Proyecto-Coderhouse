import { usersDao } from "../dao/index.js"

export class SessionsController {
    static redirectLogin = async (req, res) => {
        res.render("login", { message: "Usuario registrado :)" })
    }

    static failSignup = async (req, res) => {
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

    static redirectProducts = async (req, res) => {
        res.redirect("/products")
    }

    static failLogin = async (req, res) => {
        res.render("login", { error: `
                                    Error al iniciar sesión

                                    Volve a ingresar los datos:
                                    * El email ingresado debe ser de una cuenta existente
                                    * La contraseña puede estar incorrecta
                                ` 
        })
    }

    static logout = async (req, res) => {
        try {
            req.session.destroy((err) => {
                if (err) {
                    return res.render("profile", { error: "Error al cerrar la sesión" })
                } else {
                    return res.redirect("/login")
                }
            })
        } catch (error) {
            res.render("logout", { error: "Error al cerrar la sesión" })
        }
    }

    static getUsers = async (req, res) => {
        try {
            const users = await usersDao.getUsers()
            res.json({ status: "success", data: users })
        } catch (error) {
            res.json({ status: "error", error: "Error al obtener los usuarios" })
        }
    }

    static getUserById = async (req, res) => {
        try {
            const { uid } = req.params
            const user = await usersDao.getUserById(uid)
            res.json({ status: "success", data: user })
        } catch (error) {
            res.json({ status: "error", error: "Error al obtener el usuario" })
        }
    }
}