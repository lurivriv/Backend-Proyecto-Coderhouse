import { Router } from "express"
import { sessionManagerService } from "../dao/index.js"

const router = Router()

// Signup
router.post("/signup", async (req, res) => {
    try {
        const signupForm = req.body
        const createdUser = await sessionManagerService.registerUser(signupForm)
        res.render("login", { createdUser, message: "Usuario registrado :)"})
    } catch (error) {
        res.render("signup", { error: error.message })
    }
})

// Login
router.post("/login", async(req,res)=>{
    try {
        const loginForm = req.body

        if (loginForm.email === "adminCoder@coder.com" && loginForm.password === "adminCod3r123") {
            req.session.email = loginForm.email
            req.session.role = "admin"
        } else {
            const loggedUser = await sessionManagerService.loginUser(loginForm)

            if (!loggedUser) {
                return res.render("login", { error: "Los datos ingresados son incorrectos" })
            }

            req.session.first_name = loggedUser.first_name
            req.session.last_name = loggedUser.last_name
            req.session.email = loggedUser.email
            req.session.age = loggedUser.age
            req.session.role = loggedUser.role
        }

        return res.redirect("/products")
    } catch (error) {
        res.render("login", { error: error.message })
    }
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