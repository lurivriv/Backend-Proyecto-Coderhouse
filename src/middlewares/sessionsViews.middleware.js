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