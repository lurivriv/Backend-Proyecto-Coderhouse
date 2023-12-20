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
            logger.error(`get products no filter error: Error al obtener los productos: ${error}`)
            throw new Error(`get products no filter error: Error al obtener los productos: ${error}`)
        }
    }

    // Obtener todos los productos con filtros y paginación (products paginate)
    async getProducts(query, options) {
        try {
            const result = await this.model.paginate(query, options)
            return result
        } catch (error) {
            logger.error(`get products error: Error al obtener los productos: ${error}`)
            throw new Error(`get products error: Error al obtener los productos: ${error}`)
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
            logger.error(`get product by id error: Error al obtener el producto: ${error}`)
            throw new Error(`get product by id error: Error al obtener el producto: ${error}`)
        }
    }

    // Agregar un producto
    async addProduct(productInfo) {
        try {
            const result = await this.model.create(productInfo)
            return result
        } catch (error) {
            logger.error(`add product error: Error al crear el producto: ${error}`)
            throw new Error(`add product error: Error al crear el producto: ${error}`)
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
            logger.error(`update product error: Error al actualizar el producto: ${error}`)
            throw new Error(`update product error: Error al actualizar el producto: ${error}`)
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
            logger.error(`delete product error: Error al eliminar el producto: ${error}`)
            throw new Error(`delete product error: Error al eliminar el producto: ${error}`)
        }
    }
}