import { GetUserInfoDto } from "../dao/dto/getUserInfo.dto.js"
import { EError } from "../enums/EError.js"
import { CustomError } from "../services/customErrors/customError.service.js"

// Si no hay una sesión activa
export const noSessionMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login")
    }
    next()
}

// Si hay una sesión activa
export const sessionMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile")
    }
    next()
}

// Según el rol del usuario
export const checkRoleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            CustomError.createError ({
                name: "get users error",
                cause: "Tenés que iniciar sesión para hacer esta petición",
                message: "Error de autenticación: ",
                errorCode: EError.INVALID_BODY_ERROR
            })
        }

        if (!roles.includes(req.user.role)) {
            const userInfoDto = new GetUserInfoDto(req.user)
            res.render("productsPaginate", { userInfoDto, message: "¡Lo sentimos! No tenés acceso a esta página" })
        } else {
            next()
        }
    }
}