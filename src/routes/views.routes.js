import { Router} from "express"
import { noSessionMiddleware, sessionMiddleware, checkRoleMiddleware } from "../middlewares/auth.js"
import { ViewsController } from "../controllers/views.controller.js"

const router = Router()

// Productos en home (Si no hay una sesión activa redirigir al login)
router.get("/", noSessionMiddleware, ViewsController.renderHome)

// Productos en real time products
router.get("/realtimeproducts", noSessionMiddleware, checkRoleMiddleware(["admin"]), ViewsController.renderRealTimeProducts)

// Todos los productos
router.get("/products", noSessionMiddleware, ViewsController.renderProducts)

// Detalle de producto
router.get("/products/:pid", noSessionMiddleware, ViewsController.renderProductDetail)

// Carrito
router.get("/carts/:cid", noSessionMiddleware, checkRoleMiddleware(["usuario"]), ViewsController.renderCart)

// Signup
router.get("/signup", sessionMiddleware, ViewsController.renderSignup)

// Login
router.get("/login", sessionMiddleware, ViewsController.renderLogin)

// Perfil
router.get("/profile", noSessionMiddleware, ViewsController.renderProfile)

export { router as viewsRouter }