import { productsDao } from "../dao/index.js"

export class ProductsService {
    static getProductsNoFilter() {
        return productsDao.getProductsNoFilter()
    }

    static getProducts(query, options) {
        return productsDao.getProducts(query, options)
    }

    static getProductById(productId) {
        return productsDao.getProductById(productId)
    }

    static addProduct(productInfo) {
        return productsDao.addProduct(productInfo)
    }

    static updateProduct(productId, updateFields) {
        return productsDao.updateProduct(productId, updateFields)
    }

    static deleteProduct(productId) {
        return productsDao.deleteProduct(productId)
    }
}