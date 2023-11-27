import { Router } from "express"
import { noSessionMiddleware, checkRoleMiddleware } from "../middlewares/auth.js"
import { CartsController } from "../controllers/carts.controller.js"
import { TicketsController } from "../controllers/tickets.controller.js"

const router = Router()

// Obtener todos los carritos (GET: http://localhost:8080/api/carts)
router.get("/", noSessionMiddleware, CartsController.getCarts)

// Obtener todos los tickets de compra (GET: http://localhost:8080/api/carts/tickets)
router.get("/tickets", noSessionMiddleware, TicketsController.getTickets)

// Obtener un carrito por ID (GET: http://localhost:8080/api/carts/cid)
router.get("/:cid", noSessionMiddleware, CartsController.getCartById)

// Obtener un ticket de compra por ID (GET: http://localhost:8080/api/carts/cid/tickets/tid)
router.get("/:cid/tickets/:tid", noSessionMiddleware, TicketsController.getTicketById)

// Crear un carrito (POST: http://localhost:8080/api/carts)
router.post("/", noSessionMiddleware, CartsController.createCart)

// Agregar un producto a un carrito (POST: http://localhost:8080/api/carts/cid/product/pid)
router.post("/:cid/product/:pid", noSessionMiddleware, checkRoleMiddleware(["usuario"]), CartsController.addProductToCart)

// Actualizar un carrito con un array de productos (PUT: http://localhost:8080/api/carts/cid)
router.put("/:cid", noSessionMiddleware, checkRoleMiddleware(["usuario"]), CartsController.updateProductsInCart)

// Actualizar la cantidad de un producto en el carrito (PUT: http://localhost:8080/api/carts/cid/products/pid)
router.put("/:cid/products/:pid", noSessionMiddleware, checkRoleMiddleware(["usuario"]), CartsController.updateProductQuantityInCart)

// Eliminar todos los productos de un carrito (DELETE: http://localhost:8080/api/carts/cid)
router.delete("/:cid", noSessionMiddleware, CartsController.deleteAllProductsInCart)

// Eliminar un producto del carrito (DELETE: http://localhost:8080/api/carts/cid/products/pid)
router.delete("/:cid/products/:pid", noSessionMiddleware, CartsController.deleteProductInCart)

// Finalizar compra (POST: http://localhost:8080/api/carts/cid/purchase)
router.post("/:cid/purchase", noSessionMiddleware, checkRoleMiddleware(["usuario"]), TicketsController.purchaseCart)

export { router as cartsRouter }