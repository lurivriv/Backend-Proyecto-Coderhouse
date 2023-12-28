import { UsersService } from "../services/users.service.js"

export class UsersController {
    static getUsers = async (req, res, next) => {
        try {
            const users = await UsersService.getUsers()

            // Error customizado
            if (!users) {
                CustomError.createError ({
                    name: "get users error",
                    cause: databaseGetError(),
                    message: "Error al obtener los usuarios: ",
                    errorCode: EError.DATABASE_ERROR
                })
            }

            res.json({ status: "success", users })
        } catch (error) {
            next(error)
        }
    }

    static getUserById = async (req, res, next) => {
        try {
            const { uid } = req.params
            const user = await UsersService.getUserById(uid)

            // Error customizado
            if (!user) {
                CustomError.createError ({
                    name: "get user by id error",
                    cause: paramError(uid),
                    message: "Error al obtener el usuario: ",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }

            res.json({ status: "success", user })
        } catch (error) {
            next(error)
        }
    }
    
    static modifyRole = async (req, res, next) => {
        try {
            const { uid } = req.params
            const user = await UsersService.getUserById(uid)

            if (user.role === "premium") {
                user.role = "usuario"
            } else if (user.role === "usuario") {
                user.role = "premium"
            } else {
                // Error customizado
                CustomError.createError ({
                    name: "modify role error",
                    cause: "No se puede cambiar el rol de este usuario",
                    message: "Error al modificar el rol: ",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }

            await UsersService.updateUser(user._id, user)
            res.json({ status: "success", message: `El rol del usuario '${user.full_name}' fue modificado a '${user.role}' con éxito` })
        } catch (error) {
            next(error)
        }
    }
}