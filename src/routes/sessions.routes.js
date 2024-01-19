import { Router } from "express"
import passport from "passport"
import { config } from "../config/config.js"
import { uploadProfile } from "../utils.js"
import { SessionsController } from "../controllers/sessions.controller.js"

const router = Router()

// Signup (POST: http://localhost:8080/api/sessions/signup)
router.post("/signup", uploadProfile.single("avatar"), passport.authenticate("signupLocalStrategy", {
    failureRedirect: "/api/sessions/fail-signup",
    session: false
}), SessionsController.registerUser)

// Fail signup
router.get("/fail-signup", SessionsController.failSignup)

// Signup con GitHub
router.get("/signup-github", passport.authenticate("signupGithubStrategy"))

// Callback con GitHub
router.get(config.github.callbackUrl, passport.authenticate("signupGithubStrategy", {
    failureRedirect: "/api/sessions/fail-signup"
}), SessionsController.loginUser)

// Login (POST: http://localhost:8080/api/sessions/login)
router.post("/login", passport.authenticate("loginLocalStrategy", {
    failureRedirect: "/api/sessions/fail-login"
}), SessionsController.loginUser)

// Fail login
router.get("/fail-login", SessionsController.failLogin)

// Restablecer contraseña
router.post("/forgot-password", SessionsController.forgotPassword)

// Nueva contraseña
router.post("/reset-password", SessionsController.resetPassword)

// Logout (GET: http://localhost:8080/api/sessions/logout)
router.get("/logout", SessionsController.logout)

export { router as sessionsRouter }