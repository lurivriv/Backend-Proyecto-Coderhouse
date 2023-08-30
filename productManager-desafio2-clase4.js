const fs = require("fs")

class ProductManager {
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

// Probar el código
const operations = async () => {
    try {
        const productManager = new ProductManager("./products.json")

        // Ver productos iniciales (0)
        console.log(await productManager.getProducts())

        // Agregar producto de prueba
        await productManager.addProduct({
            title: "Producto prueba",
            description: "Este es un producto prueba",
            price: 200,
            thumbnail: "Sin imagen",
            code: "abc123",
            stock: 25
        })

        // Agregar segundo producto de prueba
        await productManager.addProduct({
            title: "Producto prueba 2",
            description: "Este es el segundo producto prueba",
            price: 300,
            thumbnail: "Sin imagen",
            code: "abc12345",
            stock: 20
        })

        // Agregar tercer producto de prueba
        await productManager.addProduct({
            title: "Producto prueba 3",
            description: "Este es el tercer producto prueba",
            price: 350,
            thumbnail: "Sin imagen",
            code: "abc123456",
            stock: 15
        })

        // Ver los productos agregados
        console.log(await productManager.getProducts())

        // Agregar producto de prueba con código repetido
        await productManager.addProduct({
            title: "Producto prueba repetido",
            description: "Este es un producto prueba repetido",
            price: 290,
            thumbnail: "Sin imagen",
            code: "abc123",
            stock: 6
        })

        // Agregar producto de prueba con campos incompletos e inválidos
        await productManager.addProduct({
            title: undefined,
            description: "Producto con campos incompletos",
            price: "300",
            thumbnail: "Sin imagen",
            code: "abc123456789",
            stock: -10
        })

        // Buscar producto por id
        await productManager.getProductById(1)

        // Buscar producto por id inexistente
        await productManager.getProductById(10)
        
        // Actualizar campos de un producto
        await productManager.updateProduct(1, {
            price: 250,
            stock: 30,
        })

        // Actualizar campos de un producto inexistente
        await productManager.updateProduct(10, {
            price: 400,
            stock: 5
        })

        // Eliminar un producto
        await productManager.deleteProduct(2)

        // Eliminar un producto inexistente
        await productManager.deleteProduct(10)

        // Ver lista final de productos
        console.log(await productManager.getProducts())
    } catch (error) {
        console.log(error.message)
    }
}

operations()