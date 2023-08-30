class ProductManager {
    constructor() {
        this.products = []
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
            return console.log("Todos los campos son obligatorios")
        }

        if (this.products.some(product => product.code === code)) {
            return console.log("El producto ya existe")
        }

        const newProduct = {
            id: this.products.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        this.products.push(newProduct)
        console.log("Producto agregado")
    }

    getProducts() {
        return this.products
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id)
        if (!product) {
            console.log("ID no encontrado")
        } else {
            console.log("ID encontrado:", product)
        }
    }
}

const productManager = new ProductManager()

// Agregando producto de prueba
productManager.addProduct("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)

// Repitiendo código del producto de prueba para que de error "El producto ya existe"
productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)

// Agregando producto sin título definido para que de error "Todos los campos son obligatorios"
productManager.addProduct(undefined, "Producto con campos incompletos", 250, "Sin imagen", "abc123456789", 10)

// Agregando segundo producto de prueba
productManager.addProduct("Producto prueba 2", "Este es el segundo producto prueba", 300, "Sin imagen", "abc123456", 20)

// Buscando producto de prueba con id 1
productManager.getProductById(1)

// Buscando producto con id inexistente para que de error "ID del producto no encontrado"
productManager.getProductById(10)

// Viendo todos los productos agregados
console.log(productManager.getProducts())