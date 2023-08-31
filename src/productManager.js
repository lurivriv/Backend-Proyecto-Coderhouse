import fs from "fs"

export class ProductManager {
    constructor(filePath) {
        this.filePath = filePath
    }

    fileExist(){
        return fs.existsSync(this.filePath)
    }

    // Leer el archivo de productos
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
            console.log(error.message)
            throw error
        }
    }

    // Agregar un producto
    async addProduct(productInfo) {
        try {
            if(this.fileExist()){
                const products = await this.getProducts()
            
                // Verificar si faltan completar campos
                if (
                    !productInfo.title ||
                    !productInfo.description ||
                    typeof productInfo.price !== "number" ||
                    productInfo.price < 0 ||
                    !productInfo.thumbnail ||
                    !productInfo.code ||
                    typeof productInfo.stock !== "number" ||
                    productInfo.stock < 0
                ) {
                    throw new Error("Todos los campos son obligatorios y deben tener valores válidos")
                }

                // Verificar si el producto ya existe
                if (products.some((product) => product.code === productInfo.code)) {
                    throw new Error(`El producto con código "${productInfo.code}" ya existe`)
                }

                // Id del nuevo producto (autoincrementable)
                const newProductId = products.reduce((maxId, product) => Math.max(maxId, product.id), 0)
                const newProduct = { ...productInfo, id: newProductId + 1 }

                // Nuevo producto agregado
                products.push(newProduct)
                await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, "\t"))
                console.log("Producto agregado")
            } else {
                throw new Error("No existe el archivo. No es posible agregar el producto")
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    // Buscar el producto por id
    async getProductById(id) {
        try {
            if(this.fileExist()){
                const products = await this.getProducts()
                const product = products.find((product) => product.id === id)

                if (product) {
                    console.log(`Id "${id}" encontrado:`, product)
                    return product
                } else {
                    throw new Error(`Id "${id}" no encontrado`)
                }
            } else {
                throw new Error("No existe el archivo. No es posible buscar el producto")
            }
        } catch (error) {
            console.log(error.message)
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
                    console.log(`Producto con Id "${id}" actualizado`)
                } else {
                    throw new Error(`Id "${id}" no encontrado. No es posible actualizar el producto`)
                }
            } else {
                throw new Error("No existe el archivo. No es posible actualizar el producto")
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    // Eliminar un producto
    async deleteProduct(id) {
        try {
            if (this.fileExist()) {
                const products = await this.getProducts()

                // Array sin el producto a eliminar
                const updateProducts = products.filter((product) => product.id !== id)

                // Actualizar el archivo
                if (products.length !== updateProducts.length) {
                    await fs.promises.writeFile(this.filePath, JSON.stringify(updateProducts, null, "\t"))
                    console.log(`Producto con Id "${id}" eliminado`)
                } else {
                    throw new Error(`Id "${id}" no encontrado. No es posible eliminar el producto`)
                }
            } else {
                throw new Error("No existe el archivo. No es posible eliminar el producto")
            }
        } catch (error) {
            console.log(error.message)
        }
    }
}