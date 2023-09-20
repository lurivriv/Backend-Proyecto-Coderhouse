import { Router} from "express"
import { productManagerService } from "../persistence/index.js"

const router = Router()

router.get("/", async (req, res) => {
    try {
        const products = await productManagerService.getProducts()
        res.render("home", { products })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realTimeProducts")
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export { router as viewsRouter }