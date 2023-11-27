import { Router } from "express"
import { uploader } from "../utils.js"
import { noSessionMiddleware, checkRoleMiddleware } from "../middlewares/auth.js"
import { ProductsController } from "../controllers/products.controller.js"

const router = Router()

// Obtener todos los productos (GET: http://localhost:8080/api/products?limit=8&page=1)
router.get("/", noSessionMiddleware, ProductsController.getProducts)

// Obtener un producto por ID (GET: http://localhost:8080/api/products/pid)
router.get("/:pid", noSessionMiddleware, ProductsController.getProductById)

// Agregar un producto (POST: http://localhost:8080/api/products)
router.post("/", uploader.single("thumbnail"), noSessionMiddleware, checkRoleMiddleware(["admin"]), ProductsController.addProduct)

// Actualizar un producto (PUT: http://localhost:8080/api/products/pid)
router.put("/:pid", uploader.single("thumbnail"), noSessionMiddleware, checkRoleMiddleware(["admin"]), ProductsController.updateProduct)

// Eliminar un producto (DELETE: http://localhost:8080/api/products/pid)
router.delete("/:pid", noSessionMiddleware, checkRoleMiddleware(["admin"]), ProductsController.deleteProduct)

export { router as productsRouter }