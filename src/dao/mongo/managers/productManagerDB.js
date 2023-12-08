import { productsModel } from "../models/products.model.js"
import { logger } from "../../../helpers/logger.js"

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
            logger.error("get products no filter: Error al obtener los productos")
            throw new Error("Error al obtener los productos")
        }
    }

    // Obtener todos los productos con filtros y paginación (products paginate)
    async getProducts(query, options) {
        try {
            const result = await this.model.paginate(query, options)
            return result
        } catch (error) {
            logger.error("get products: Error al obtener los productos")
            throw new Error("Error al obtener los productos")
        }
    }
    
    // Obtener un producto por ID
    async getProductById(productId) {
        try {
            const result = await this.model.findById(productId).lean()

            if (!result) {
                throw error
            }

            return result
        } catch (error) {
            logger.error("get product by id: Error al obtener el producto")
            throw new Error("Error al obtener el producto")
        }
    }

    // Agregar un producto
    async addProduct(productInfo) {
        try {
            const result = await this.model.create(productInfo)
            return result
        } catch (error) {
            logger.error("add product: Error al crear el producto")
            throw new Error("Error al crear el producto")
        }
    }

    // Actualizar un producto
    async updateProduct(productId, updateFields) {
        try {
            const result = await this.model.findByIdAndUpdate(productId, updateFields, { new: true })

            if (!result) {
                throw error
            }

            return result
        } catch (error) {
            logger.error("update product: Error al actualizar el producto")
            throw new Error("Error al actualizar el producto")
        }
    }

    // Eliminar un producto
    async deleteProduct(productId) {
        try {
            const result = await this.model.findByIdAndDelete(productId)
            
            if (!result) {
                throw error
            }

            return result
        } catch (error) {
            logger.error("delete product: Error al eliminar el producto")
            throw new Error("Error al eliminar el producto")
        }
    }
}