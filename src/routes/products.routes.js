import { Router} from "express"
import { productManagerService } from "../persistence/index.js"

const router = Router()

// Obtener lista de productos (GET: http://localhost:8080/api/products || http://localhost:8080/api/products?limit=3)
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit
        const products = await productManagerService.getProducts()

        if (limit) {
            const productsLimit = products.slice(0, parseInt(limit))
            res.status(200).json({ data: productsLimit })
        } else {
            res.status(200).json({ data: products })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Obtener un producto por su ID (GET: http://localhost:8080/api/products/1)
router.get("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const product = await productManagerService.getProductById(pid)
        
        if (product) {
            res.status(200).json({ data: product })
        } else {
            res.status(404).json({ error: error.message })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Agregar un nuevo producto (POST: http://localhost:8080/api/products)
router.post("/", async (req, res) => {
    try {
        const productInfo = req.body

        await productManagerService.addProduct(productInfo)
        res.status(201).json({ message: "Producto agregado" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Actualizar un producto por su ID (PUT: http://localhost:8080/api/products/1)
router.put("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const updateFields = req.body

        await productManagerService.updateProduct(pid, updateFields)
        res.status(200).json({ message: `Producto con ID ${pid} actualizado` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Eliminar un producto por su ID (DELETE: http://localhost:8080/api/products/2)
router.delete("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        
        await productManagerService.deleteProduct(pid)
        res.status(200).json({ message: `Producto con ID ${pid} eliminado` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export { router as productsRouter }