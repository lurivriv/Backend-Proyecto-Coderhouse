import { Router } from "express"
import passport from "passport"
import { config } from "../config/config.js"

const router = Router()

// Signup
router.post("/signup", passport.authenticate("signupLocalStrategy", {
    failureRedirect: "/api/sessions/fail-signup"
}), async (req, res) => {
    res.render("login", { message: "Usuario registrado :)"})
})

// Fail signup
router.get("/fail-signup", (req, res) => {
    res.render("signup", { error: "Error al completar el registro" })
})

// Signup con GitHub
router.get("/signup-github", passport.authenticate("signupGithubStrategy"))

// Callback con GitHub
router.get(config.github.callbackUrl, passport.authenticate("signupGithubStrategy", {
    failureRedirect: "/api/sessions/fail-signup"
}), (req, res) => {
    res.redirect("/products")
})

// Login
router.post("/login", passport.authenticate("loginLocalStrategy", {
    failureRedirect: "/api/sessions/fail-login"
}), async (req, res) => {
    res.redirect("/products")
})

// Fail login
router.get("/fail-login", (req, res) => {
    res.render("login", { error: "Error al iniciar sesión. Volve a ingresar los datos" })
})

// Logout
router.get("/logout", async (req, res) => {
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
})

export { router as sessionsRouter }