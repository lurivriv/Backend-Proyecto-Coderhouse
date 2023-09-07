import { Router } from "express"
import { cartManagerService } from "../persistence/index.js"

const router = Router()

// Crear un carrito (POST: http://localhost:8080/api/carts)
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManagerService.createCart()
        res.status(201).json({ data: newCart, message: "Carrito creado" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Obtener un carrito por su ID (GET: http://localhost:8080/api/carts/1)
router.get("/:cid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const cart = await cartManagerService.getCartById(cid)

        if (cart) {
            res.status(200).json({ data: cart })
        } else {
            res.status(404).json({ error: error.message })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Agregar un producto a un carrito (POST: http://localhost:8080/api/carts/1/product/1)
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
        const quantity = parseInt(req.body.quantity || 1)
        
        await cartManagerService.addProductToCart(cid, pid, quantity)
        res.status(200).json({ message: `${quantity} de este producto agregado al carrito` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export { router as cartsRouter }