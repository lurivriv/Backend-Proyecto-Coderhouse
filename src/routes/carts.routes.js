import { Router } from "express"
import { CartsController } from "../controllers/carts.controller.js"

const router = Router()

// Obtener todos los carritos (GET: http://localhost:8080/api/carts)
router.get("/", CartsController.getCarts)

// Obtener un carrito por ID (http://localhost:8080/api/carts/cid)
router.get("/:cid", CartsController.getCartById)

// Crear un carrito (POST: http://localhost:8080/api/carts)
router.post("/", CartsController.createCart)

// Agregar un producto a un carrito (POST: http://localhost:8080/api/carts/cid/product/pid)
router.post("/:cid/product/:pid", CartsController.addProductToCart)

// Actualizar un carrito con un array de productos (PUT: http://localhost:8080/api/carts/cid)
router.put("/:cid", CartsController.updateProductsInCart)

// Actualizar la cantidad de un producto en el carrito (PUT: http://localhost:8080/api/carts/cid/products/pid)
router.put("/:cid/products/:pid", CartsController.updateProductQuantityInCart)

// Eliminar todos los productos de un carrito (DELETE: http://localhost:8080/api/carts/cid)
router.delete("/:cid", CartsController.deleteAllProductsInCart)

// Eliminar un producto del carrito (DELETE: http://localhost:8080/api/carts/cid/products/pid)
router.delete("/:cid/products/:pid", CartsController.deleteProductInCart)

export { router as cartsRouter }