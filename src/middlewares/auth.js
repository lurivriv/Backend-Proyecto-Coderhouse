import { GetUserInfoDto } from "../dao/dto/getUserInfo.dto.js"

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
        if (!roles.includes(req.user.role)) {
            const userInfoDto = new GetUserInfoDto(req.user)
            res.render("productsPaginate", { userInfoDto, error: "¡Lo sentimos! No tenés acceso a esta página" })
        } else {
            next()
        }
    }
}