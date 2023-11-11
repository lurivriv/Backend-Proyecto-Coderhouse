import fs from "fs"
import { productsDao } from "../../index.js"

export class CartManagerFS {
    constructor(filePath) {
        this.filePath = filePath
    }

    fileExists() {
        return fs.existsSync(this.filePath)
    }

    // Obtener los carritos
    async getCarts() {
        try {
            if (this.fileExists()) {
                const content = await fs.promises.readFile(this.filePath, "utf-8")
                const carts = JSON.parse(content)
                return carts
            } else {
                return []
            }
        } catch (error) {
            throw new Error("Error al obtener los carritos del archivo")
        }
    }

    // Crear un carrito
    async createCart() {
        try {
            if (this.fileExists()) {
                const carts = await this.getCarts()

                // Autogenerar ID
                const newCartId = carts.reduce((maxId, cart) => Math.max(maxId, cart.id), 0)
                const newCart = { id: newCartId + 1, products: [] }

                // Crear el nuevo carrito
                carts.push(newCart)
                await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, "\t"))
                return newCart
            } else {
                throw new Error("Error al crear el carrito: error al obtener los carritos del archivo")
            }
        } catch (error) {
            throw error
        }
    }

    // Obtener un carrito por su ID
    async getCartById(id) {
        try {
            if (this.fileExists()) {
                const carts = await this.getCarts()
                const cart = carts.find((cart) => cart.id === id)

                if (cart) {
                    return cart
                } else {
                    throw new Error(`Error al buscar el carrito: el carrito con ID ${id} no existe`)
                }
            } else {
                throw new Error("Error al buscar el carrito: error al obtener los carritos del archivo")
            }
        } catch (error) {
            throw error
        }
    }

    // Agregar un producto a un carrito
    async addProductToCart(cartId, productId, quantity) {
        try {
            if (this.fileExists()) {
                const carts = await this.getCarts()
                const cart = await this.getCartById(cartId, carts)
                const productById = await productsDao.getProductById(productId)

                // Verificar que quantity sea un número válido
                if (isNaN(quantity) || quantity < 1) {
                    throw new Error("Error al agregar el producto al carrito: la cantidad debe ser un número mayor o igual a 1")
                }

                if (cart && productById) {
                    const productInCart = cart.products.find((product) => product.product === productId)

                    if (productInCart) {
                        productInCart.quantity += quantity
                    } else {
                        cart.products.push({ product: productId, quantity })
                    }

                    // Actualizar el carrito
                    const cartIndex = carts.findIndex((cart) => cart.id === cartId)
                    carts[cartIndex] = cart

                    await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, "\t"))
                }
            } else {
                throw new Error("Error al agregar el producto al carrito: error al obtener los carritos del archivo")
            }
        } catch (error) {
            throw error
        }
    }
}