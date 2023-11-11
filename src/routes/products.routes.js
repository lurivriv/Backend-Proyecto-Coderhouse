import { Router } from "express"
import { uploader } from "../utils.js"
import { ProductsController } from "../controllers/products.controller.js"

const router = Router()

// Obtener todos los productos (http://localhost:8080/api/products || http://localhost:8080/api/products?limit=1&page=1)
router.get("/", ProductsController.getProducts)

// Obtener un producto por ID (http://localhost:8080/api/products/pid)
router.get("/:pid", ProductsController.getProductById)

// Agregar un producto (POST: http://localhost:8080/api/products)
router.post("/", uploader.single("thumbnail"), ProductsController.addProduct)

// Actualizar un producto (PUT: http://localhost:8080/api/products/pid)
router.put("/", uploader.single("thumbnail"), ProductsController.updateProduct)

// Eliminar un producto (DELETE: http://localhost:8080/api/products/pid)
router.delete("/", ProductsController.deleteProduct)

export { router as productsRouter }