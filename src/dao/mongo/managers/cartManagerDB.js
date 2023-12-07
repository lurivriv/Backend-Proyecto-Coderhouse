import { cartsModel } from "../models/carts.model.js"

export class CartManagerDB {
    constructor() {
        this.model = cartsModel
    }

    // Obtener todos los carritos
    async getCarts() {
        try {
            const result = await this.model.find().populate("products.product").lean()
            return result
        } catch (error) {
            throw new Error("Error al obtener los carritos")
        }
    }

    // Obtener un carrito por ID
    async getCartById(cartId) {
        try {
            const result = await this.model.findById(cartId).populate("products.product").lean()

            if (!result) {
                throw error
            }

            return result
        } catch (error) {
            throw new Error("Error al obtener el carrito")
        }
    }

    // Crear un carrito
    async createCart() {
        try {
            const newCart = {}
            const result = await this.model.create(newCart)
            return result
        } catch (error) {
            throw new Error("Error al crear el carrito")
        }
    }

    // Agregar un producto a un carrito
    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId)
            const productInCart = cart.products.find((product) => product.product._id == productId)

            if (productInCart) {
                productInCart.quantity += quantity
            } else {
                cart.products.push({ product: productId, quantity})
            }
 
            const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true })    
            return result
        } catch (error) {
            throw new Error("Error al agregar el producto al carrito")
        }
    }

    // Actualizar un carrito con un array de productos
    async updateProductsInCart(cartId, newProducts) {
        try {
            const cart = await this.getCartById(cartId)

            cart.products = newProducts

            const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true })
            return result
        } catch (error) {
            throw new Error("Error al actualizar los productos del carrito")
        }
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantityInCart(cartId, productId, newQuantity) {
        try {
            const cart = await this.getCartById(cartId)
            const productInCartIndex = cart.products.findIndex((product) => product.product._id == productId)

            if (productInCartIndex >= 0) {
                cart.products[productInCartIndex].quantity = newQuantity

                if (newQuantity >= 1) {
                    const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true })
                    return result
                } else {
                    throw error
                }
            } else {
                throw error
            }
        } catch (error) {
            throw new Error("Error al actualizar la cantidad del producto en el carrito")
        }
    }

    // Eliminar todos los productos de un carrito
    async deleteAllProductsInCart(cartId, newCart) {
        try {
            const cart = await this.getCartById(cartId)

            newCart = []         
            cart.products = newCart

            const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true })
            return result
        } catch (error) {
            throw new Error("Error al eliminar los productos del carrito")
        }
    }

    // Eliminar un producto del carrito
    async deleteProductInCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId)
            const productInCart = cart.products.find((product) => product.product._id == productId)

            if (productInCart) {
                const newProducts = cart.products.filter((product) => product.product._id != productId)

                cart.products = newProducts

                const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true })
                return result
            } else {
                throw error
            }
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito")
        }
    }
}