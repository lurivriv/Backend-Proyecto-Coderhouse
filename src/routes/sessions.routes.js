import { Router } from "express"
import passport from "passport"
import { config } from "../config/config.js"
import { SessionsController } from "../controllers/sessions.controller.js"

const router = Router()

// Signup
router.post("/signup", passport.authenticate("signupLocalStrategy", {
    failureRedirect: "/api/sessions/fail-signup",
    session: false
}), SessionsController.redirectLogin)

// Fail signup
router.get("/fail-signup", SessionsController.failSignup)

// Signup con GitHub
router.get("/signup-github", passport.authenticate("signupGithubStrategy"))

// Callback con GitHub
router.get(config.github.callbackUrl, passport.authenticate("signupGithubStrategy", {
    failureRedirect: "/api/sessions/fail-signup"
}), SessionsController.redirectProducts)

// Login
router.post("/login", passport.authenticate("loginLocalStrategy", {
    failureRedirect: "/api/sessions/fail-login"
}), SessionsController.redirectProducts)

// Fail login
router.get("/fail-login", SessionsController.failLogin)

// Logout
router.get("/logout", SessionsController.logout)

export { router as sessionsRouter }