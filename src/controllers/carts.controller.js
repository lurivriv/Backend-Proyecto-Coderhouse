import { CartsService } from "../services/carts.service.js"
import { ProductsService } from "../services/products.service.js"

export class CartsController {
    static getCarts = async (req, res) => {
        try {
            const carts = await CartsService.getCarts()
            res.status(201).json({ data: carts })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static getCartById = async (req, res) => {
        try {
            const { cid } = req.params
            const cart = await CartsService.getCartById(cid)
            res.status(201).json({ data: cart })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static createCart = async (req, res) => {
        try {
            const createdCart = await CartsService.createCart()
            res.status(201).json({ data: createdCart })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static addProductToCart = async (req, res) => {
        try {
            const { cid, pid } = req.params
    
            // Verificar que existen cid y pid o lanzar el error correspondiente
            const cart = await CartsService.getCartById(cid)
            const product = await ProductsService.getProductById(pid)
    
            const addedProductToCart = await CartsService.addProductToCart(cid, pid)
            res.status(200).json({ data: addedProductToCart })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static updateProductsInCart = async (req, res) => {
        try {
            const { cid } = req.params
            const { newProducts } = req.body
    
            // Verificar que existe cid o lanzar el error correspondiente
            const cart = await CartsService.getCartById(cid)
    
            const updatedProductsInCart = await CartsService.updateProductsInCart(cid, newProducts)
            res.status(200).json({ data: updatedProductsInCart })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static updateProductQuantityInCart = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const { newQuantity } = req.body
    
            // Verificar que existen cid y pid o lanzar el error correspondiente
            const cart = await CartsService.getCartById(cid)
            const product = await ProductsService.getProductById(pid)
    
            const updatedQuantityProductInCart = await CartsService.updateProductQuantityInCart(cid, pid, newQuantity)
            res.status(200).json({ data: updatedQuantityProductInCart })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static deleteAllProductsInCart = async (req, res) => {
        try {
            const { cid } = req.params
            const { newCart } = req.body
    
            // Verificar que existe cid o lanzar el error correspondiente
            const cart = await CartsService.getCartById(cid)
    
            const emptyNewCart = await CartsService.deleteAllProductsInCart(cid, newCart)
            res.status(200).json({ data: emptyNewCart })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static deleteProductInCart = async (req, res) => {
        try {
            const { cid, pid } = req.params
    
            // Verificar que existen cid y pid o lanzar el error correspondiente
            const cart = await CartsService.getCartById(cid)
            const product = await ProductsService.getProductById(pid)
    
            const newCart = await CartsService.deleteProductInCart(cid, pid)
            res.status(200).json({ data: newCart })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}