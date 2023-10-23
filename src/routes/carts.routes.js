import { Router } from "express"
import { cartManagerService, productManagerService } from "../dao/index.js"

const router = Router()

// Obtener todos los carritos (GET: http://localhost:8080/api/carts)
router.get("/", async (req, res) => {
    try {
        const carts = await cartManagerService.getCarts()
        res.status(201).json({ data: carts })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Obtener un carrito por ID (http://localhost:8080/api/carts/cid)
router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartManagerService.getCartById(cid)
        res.status(201).json({ data: cart })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Crear un carrito (POST: http://localhost:8080/api/carts)
router.post("/", async (req, res) => {
    try {
        const createdCart = await cartManagerService.createCart()
        res.status(201).json({ data: createdCart })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Agregar un producto a un carrito (POST: http://localhost:8080/api/carts/cid/product/pid)
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params

        // Verificar que existen cid y pid o lanzar el error correspondiente
        const cart = await cartManagerService.getCartById(cid)
        const product = await productManagerService.getProductById(pid)

        const addedProductToCart = await cartManagerService.addProductToCart(cid, pid)
        res.status(200).json({ data: addedProductToCart })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Actualizar un carrito con un array de productos (PUT: http://localhost:8080/api/carts/cid)
router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        const { newProducts } = req.body

        // Verificar que existe cid o lanzar el error correspondiente
        const cart = await cartManagerService.getCartById(cid)

        const updatedProductsInCart = await cartManagerService.updateProductsInCart(cid, newProducts)
        res.status(200).json({ data: updatedProductsInCart })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Actualizar la cantidad de un producto en el carrito (PUT: http://localhost:8080/api/carts/cid/products/pid)
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const {cid, pid} = req.params
        const { newQuantity } = req.body

        // Verificar que existen cid y pid o lanzar el error correspondiente
        const cart = await cartManagerService.getCartById(cid)
        const product = await productManagerService.getProductById(pid)

        const updatedQuantityProductInCart = await cartManagerService.updateProductQuantityInCart(cid, pid, newQuantity)
        res.status(200).json({ data: updatedQuantityProductInCart })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Eliminar todos los productos de un carrito (DELETE: http://localhost:8080/api/carts/cid)
router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        const { newCart } = req.body

        // Verificar que existe cid o lanzar el error correspondiente
        const cart = await cartManagerService.getCartById(cid)

        const emptyNewCart = await cartManagerService.deleteAllProductsInCart(cid, newCart)
        res.status(200).json({ data: emptyNewCart })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Eliminar un producto del carrito (DELETE: http://localhost:8080/api/carts/cid/products/pid)
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params

        // Verificar que existen cid y pid o lanzar el error correspondiente
        const cart = await cartManagerService.getCartById(cid)
        const product = await productManagerService.getProductById(pid)

        const newCart = await cartManagerService.deleteProductInCart(cid, pid)
        res.status(200).json({ data: newCart })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export { router as cartsRouter }