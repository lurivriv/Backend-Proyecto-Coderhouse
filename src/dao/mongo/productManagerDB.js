import { productsModel } from "./models/products.model.js"

export class ProductManagerDB {
    constructor() {
        this.model = productsModel
    }

    // Obtener todos los productos sin filtro (home)
    async getProductsNoFilter() {
        try {
            const result = await this.model.find().lean()
            return result
        } catch (error) {
            console.log("getProductsNoFilter: ", error.message)
            throw new Error("Error al obtener los productos")
        }
    }

    // Obtener todos los productos con filtros y paginación (products paginate)
    async getProducts(query, options) {
        try {
            const result = await this.model.paginate(query, options)
            return result
        } catch (error) {
            console.log("getProducts: ", error.message)
            throw new Error("Error al obtener los productos")
        }
    }
    
    // Obtener un producto por ID
    async getProductById(productId) {
        try {
            const result = await this.model.findById(productId).lean()

            if (!result) {
                throw new Error("No se encontró el producto")
            }

            return result
        } catch (error) {
            console.log("getProductById: ", error.message)
            throw new Error("Error al obtener el producto")
        }
    }

    // Agregar un producto
    async addProduct(productInfo) {
        try {
            const result = await this.model.create(productInfo)
            return result
        } catch (error) {
            console.log("addProduct: ", error.message)
            throw error
        }
    }

    // Actualizar un producto
    async updateProduct(productId, updateFields) {
        try {
            const result = await this.model.findByIdAndUpdate(productId, updateFields, { new: true })

            if (!result) {
                throw new Error("No se encontró el producto a actualizar")
            }

            return result
        } catch (error) {
            console.log("updateProduct: ", error.message)
            throw new Error("Error al actualizar el producto")
        }
    }

    // Eliminar un producto
    async deleteProduct(productId) {
        try {
            const result = await this.model.findByIdAndDelete(productId)
            
            if (!result) {
                throw new Error("No se encontró el producto a eliminar")
            }

            return result
        } catch (error) {
            console.log("deleteProduct: ", error.message)
            throw new Error("Error al eliminar el producto")
        }
    }
}