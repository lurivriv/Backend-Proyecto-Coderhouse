import { UsersService } from "../services/users.service.js"
import { ProductsService } from "../services/products.service.js"
import { CartsService } from "../services/carts.service.js"
import { GetUserInfoDto } from "../dao/dto/getUserInfo.dto.js"
import { sendDeleteUserEmail, sendDeleteInactiveUsersEmail } from "../helpers/email.js"
import { EError } from "../enums/EError.js"
import { CustomError } from "../services/customErrors/customError.service.js"
import { databaseGetError, paramError } from "../services/customErrors/errors/generalErrors.service.js"

export class UsersController {
    static getUsers = async (req, res, next) => {
        try {
            const usersData = await UsersService.getUsers()

            // Error customizado
            if (!usersData) {
                CustomError.createError ({
                    name: "get users error",
                    cause: databaseGetError(),
                    message: "Error al obtener los usuarios: ",
                    errorCode: EError.DATABASE_ERROR
                })
            }

            const users = usersData.map((user) => new GetUserInfoDto(user))
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

    static updateUser = async (req, res, next) => {
        try {
            const { uid } = req.params
            const { first_name, last_name, email, age } = req.body
            const avatar = req.file?.filename
            const users = await UsersService.getUsers()
            const user = await UsersService.getUserById(uid)

            // Error customizado
            if (!user) {
                CustomError.createError ({
                    name: "update user error",
                    cause: paramError(uid),
                    message: "Error al actualizar el usuario: ",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }

            const existingEmail = users.find((user) => user.email === email)

            if (((age && isNaN(age)) || age < 0) ||
                (existingEmail && existingEmail._id.toString() !== user._id.toString())) {
                CustomError.createError ({
                    name: "update user error",
                    cause: "Hay campos inválidos",
                    message: "Error al actualizar el usuario: ",
                    errorCode: EError.INVALID_BODY_ERROR
                })
            }
            
            // Campos
            const updateFields = {
                avatar: avatar || user.avatar,
                full_name: `${first_name || user.first_name} ${last_name || user.last_name}` || user.full_name,
                first_name: first_name || user.first_name,
                last_name: last_name || user.last_name,
                email: email || user.email,
                age: age || user.age
            }

            const updatedUser = await UsersService.updateUser(uid, updateFields)
            const userInfoDto = new GetUserInfoDto(updatedUser)
            res.json({ status: "success", message: "Usuario actualizado", userInfoDto })
        } catch (error) {
            next(error)
        }
    }
    
    static deleteUser = async (req, res) => {
        try {
            const { uid } = req.params
            const loggedUser = req.user
            const user = await UsersService.getUserById(uid)
            
            const deletedUser = await UsersService.deleteUser(uid)

            // Eliminar session del usuario eliminado si tiene la sesión activa
            if (uid === loggedUser._id.toString()) {
                req.session.destroy((err) => {
                    if (err) {
                        logger.error("delete user error: Error al destruir la sesión del usuario eliminado")
                    }
                })
            }

            // Eliminar los productos del usuario eliminado (menos del admin)
            if (user.role === "premium") {
                const userProducts = await ProductsService.getProductsNoFilter(user.role, uid)

                for (const product of userProducts) {
                    await ProductsService.deleteProduct(product._id)
                }
            }

            // Eliminar carrito del usuario eliminado
            if (user.cart) {
                await CartsService.deleteCart(user.cart)
            }

            await sendDeleteUserEmail(req, user.email)

            res.json({ status: "success", message: `El usuario '${user.full_name}' fue eliminado`, deletedUser })
        } catch (error) {
            throw new Error(`Error al eliminar el usuario: ${error}`)
        }
    }

    static deleteInactiveUsers = async (req, res) => {
        try {
            const loggedUser = req.user
            const twoDaysAgo = new Date()
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

            const deletedInactiveUsers = await UsersService.deleteInactiveUsers({ last_connection: { $lt: twoDaysAgo  } })

            for (const user of deletedInactiveUsers) {
                await UsersService.deleteUser(user._id)

                // Eliminar session del usuario eliminado si tiene la sesión activa
                if (user._id.toString() === loggedUser._id.toString()) {
                    req.session.destroy((err) => {
                        if (err) {
                            logger.error("delete inactive users error: Error al destruir la sesión del usuario eliminado")
                        }
                    })
                }

                // Eliminar los productos del usuario eliminado (menos del admin)
                if (user.role === "premium") {
                    const userProducts = await ProductsService.getProductsNoFilter(user.role, user._id)

                    for (const product of userProducts) {
                        await ProductsService.deleteProduct(product._id)
                    }
                }

                // Eliminar carrito del usuario eliminado
                if (user.cart) {
                    await CartsService.deleteCart(user.cart)
                }

                await sendDeleteInactiveUsersEmail(req, user.email)
            }

            res.json({ status: "success", message: "Los usuarios inactivos fueron eliminados", deletedInactiveUsers })
        } catch (error) {
            throw new Error(`Error al eliminar los usuarios inactivos: ${error}`)
        }
    }

    static modifyRole = async (req, res, next) => {
        try {
            const { uid } = req.params
            const user = await UsersService.getUserById(uid)

            // Modificar rol
            if (user.role === "premium") {
                user.role = "usuario"
            } else if (user.role === "usuario") {
                // Validar que el usuario subió los documentos
                if (user.status !== "completo") {
                    CustomError.createError ({
                        name: "modify role error",
                        cause: "El usuario no ha subido todos los documentos",
                        message: "Error al modificar el rol: ",
                        errorCode: EError.INVALID_BODY_ERROR
                    })
                } else {
                    user.role = "premium"
                }
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

    static uploadUserDocuments = async (req, res, next) => {
        try {
            const { uid } = req.params
            const user = await UsersService.getUserById(uid)

            const identification = req.files["identification"]?.[0] || null
            const address = req.files["address"]?.[0] || null
            const account_statement = req.files["account_statement"]?.[0] || null

            const docs = []

            if (identification) {
                docs.push({ name: "identification", reference: identification.filename })
            }

            if (address) {
                docs.push({ name: "address", reference: address.filename })
            }

            if (account_statement) {
                docs.push({ name: "account_statement", reference: account_statement.filename })
            }

            user.documents = docs

            if (docs.length < 3) {
                user.status = "incompleto"
            } else {
                user.status = "completo"
            }

            await UsersService.updateUser(user._id, user)
            res.json({ status: "success", message: "Los documentos del usuario fueron actualizados con éxito", documents: user.documents, statusDocuments: user.status })
        } catch (error) {
            res.json({ status: "error", error: `Error al actualizar los documentos del usuario: ${error.message}` })
        }
    }
}