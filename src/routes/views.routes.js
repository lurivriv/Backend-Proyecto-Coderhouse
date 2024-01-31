import { Router} from "express"
import { noSessionMiddleware, sessionMiddleware, checkRoleMiddleware } from "../middlewares/auth.js"
import { ViewsController } from "../controllers/views.controller.js"

const router = Router()

// Todos los productos (Inicio = Menú)
router.get("/", noSessionMiddleware, ViewsController.renderProducts)

// Todos los productos (Menú)
router.get("/products", noSessionMiddleware, ViewsController.renderProducts)

// Productos en real time products (Mis productos)
router.get("/realtimeproducts", noSessionMiddleware, checkRoleMiddleware(["admin", "premium"]), ViewsController.renderRealTimeProducts)

// Detalle de producto
router.get("/products/:pid", noSessionMiddleware, ViewsController.renderProductDetail)

// Carrito
router.get("/carts/:cid", noSessionMiddleware, checkRoleMiddleware(["usuario", "premium"]), ViewsController.renderCart)

// Signup
router.get("/signup", sessionMiddleware, ViewsController.renderSignup)

// Login
router.get("/login", sessionMiddleware, ViewsController.renderLogin)

// Restablecer contraseña
router.get("/forgot-password", ViewsController.renderForgotPassword)

// Nueva contraseña
router.get("/reset-password", ViewsController.renderResetPassword)

// Perfil (GET: http://localhost:8080/profile)
router.get("/profile", noSessionMiddleware, ViewsController.renderProfile)

// Admin puede ver y modificar usuarios (Usuarios)
router.get("/admin/users-info", noSessionMiddleware, checkRoleMiddleware(["admin"]), ViewsController.renderUsersInfo)

// Logger test (GET: http://localhost:8080/loggertest)
router.get("/loggertest", ViewsController.loggerTest)

export { router as viewsRouter }