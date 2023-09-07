import fs from "fs"

export class ProductManager {
    constructor(filePath) {
        this.filePath = filePath
    }

    fileExist(){
        return fs.existsSync(this.filePath)
    }

    // Obtener todos los productos
    async getProducts() {
        try {
            if (this.fileExist()) {
                const content = await fs.promises.readFile(this.filePath, "utf-8")
                const products = JSON.parse(content)
                return products
            } else {
                return []
            }
        } catch (error) {
            throw new Error("Error al obtener los productos del archivo")
        }
    }

    // Agregar un producto
    async addProduct(productInfo) {
        try {
            if(this.fileExist()){
                const products = await this.getProducts()
            
                // Verificar si todos los campos están completos y tienen valores válidos
                if (
                    !productInfo.title || typeof productInfo.title !== "string" ||
                    !productInfo.description || (!Array.isArray(productInfo.description) || !productInfo.description.every(item => typeof item === "string")) ||
                    !productInfo.code || typeof productInfo.code !== "string" ||
                    !productInfo.price || productInfo.price < 0 || typeof productInfo.price !== "number" ||
                    (productInfo.status && typeof productInfo.status !== "boolean") ||
                    !productInfo.stock || productInfo.stock < 0 || typeof productInfo.stock !== "number" ||
                    !productInfo.category || typeof productInfo.category !== "string" ||
                    (productInfo.thumbnails && (!Array.isArray(productInfo.thumbnails) || !productInfo.thumbnails.every(item => typeof item === "string")))

                ) {
                    throw new Error("Error al agregar el producto: todos los campos son obligatorios y deben tener valores válidos")
                }

                // Establecer status en true por defecto
                if (!productInfo.status) {
                    productInfo.status = true
                }

                // Verificar si el producto ya existe
                if (products.some((product) => product.code === productInfo.code)) {
                    throw new Error(`Error al agregar el producto: el producto con código ${productInfo.code} ya existe`)
                }

                // Autogenerar ID
                const newProductId = products.reduce((maxId, product) => Math.max(maxId, product.id), 0)
                const newProduct = { ...productInfo, id: newProductId + 1 }

                // Agregar el producto
                products.push(newProduct)
                await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, "\t"))
            } else {
                throw new Error("Error al agregar el producto: error al obtener los productos del archivo")
            }
        } catch (error) {
            throw error
        }
    }

    // Obtener un producto por ID
    async getProductById(id) {
        try {
            if(this.fileExist()){
                const products = await this.getProducts()
                const product = products.find((product) => product.id === id)

                if (product) {
                    return product
                } else {
                    throw new Error(`Error al buscar el producto: el producto con ID ${id} no existe`)
                }
            } else {
                throw new Error("Error al buscar el producto: error al obtener los productos del archivo")
            }
        } catch (error) {
            throw error
        }
    }

    // Actualizar un producto
    async updateProduct(id, updateFields) {
        try {
            if (this.fileExist()) {
                const products = await this.getProducts()

                // Buscar posición del producto con el id
                const productIndex = products.findIndex((product) => product.id === id)

                if (productIndex !== -1) {
                    // No permitir la modificación del id
                    if ("id" in updateFields) {
                        delete updateFields.id
                    }

                    products[productIndex] = { ...products[productIndex], ...updateFields }
                    await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, "\t"))
                } else {
                    throw new Error(`Error al actualizar el producto: el producto con ID ${id} no existe`)
                }
            } else {
                throw new Error("Error al actualizar el producto: error al obtener los productos del archivo")
            }
        } catch (error) {
            throw error
        }
    }

    // Eliminar un producto
    async deleteProduct(id) {
        try {
            if (this.fileExist()) {
                const products = await this.getProducts()
                const updateProducts = products.filter((product) => product.id !== id)

                // Actualizar el archivo con el producto eliminado
                if (products.length !== updateProducts.length) {
                    await fs.promises.writeFile(this.filePath, JSON.stringify(updateProducts, null, "\t"))
                } else {
                    throw new Error(`Error al eliminar el producto: el producto con ID ${id} no existe`)
                }
            } else {
                throw new Error("Error al eliminar el producto: error al obtener los productos del archivo")
            }
        } catch (error) {
            throw error
        }
    }
}