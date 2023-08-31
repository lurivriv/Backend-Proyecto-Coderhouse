import express from "express"
import { ProductManager } from "./productManager.js"

const productManagerService = new ProductManager("./products.json")
const app = express()
const port = 8080

app.listen(port, () => {
    console.log("Servidor funcionando")
})

// Inicio
app.get("/", (req, res) => {
    res.send(`¡Te doy la bienvenida al servidor!<br>
    <br><a href="http://localhost:8080/products">http://localhost:8080/products</a> => para ver todos los productos
    <br><a href="http://localhost:8080/products?limit=5">http://localhost:8080/products?limit=5</a> => para ver los primeros 5 productos
    <br><a href="http://localhost:8080/products/2">http://localhost:8080/products/2</a> => para buscar el producto con id "2"
    <br><a href="http://localhost:8080/products/34123123">http://localhost:8080/products/34123123</a> => para buscar un producto inexistente`)
})


// Obtener lista de productos
app.get("/products", async (req, res) => {
    try {
        const limit = req.query.limit
        const products = await productManagerService.getProducts()

        if (limit) {
            const productsLimit = products.slice(0, parseInt(limit))
            res.send(productsLimit)
        } else {
            res.send(products)
        }
    } catch (error) {
        res.send("Ocurrió un error al cargar los productos")
        console.log(error.message)
    }
})

// Obtener un producto por su id
app.get("/products/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const product = await productManagerService.getProductById(pid)

        if (product) {
            res.send(product)
        } else {
            res.send("El producto no existe :(")
        }
    } catch (error) {
        res.send("Ocurrió un error al cargar el producto")
        console.log(error.message)
    }
})


// Crear productos
const operations = async () => {
    try {
        await productManagerService.addProduct({
            title: "Hamburguesa de lenteja y tofu",
            description: [
                "Lenteja",
                "Tofu",
                "Cebolla",
                "Morrón",
                "Palta",
                "Mostaza"
            ],
            price: 280,
            thumbnail: "./assets/img-products/item-1.jpg",
            code: "vegg1",
            stock: 15
        })

        await productManagerService.addProduct({
            title: "Hamburguesa de quinoa y espinaca",
            description: [
                "Quinoa",
                "Espinaca",
                "Lenteja",
                "Queso vegano",
                "Remolacha"
            ],
            price: 250,
            thumbnail: "./assets/img-products/item-2.jpg",
            code: "vegg2",
            stock: 20
        })

        await productManagerService.addProduct({
            title: "Hamburguesa con cheddar y cebolla",
            description: [
                "Medallón de soja",
                "Cebolla caramelizada",
                "Queso cheddar",
                "Mayonesa",
                "Kétchup"
            ],
            price: 280,
            thumbnail: "./assets/img-products/item-3.jpg",
            code: "vget1",
            stock: 20
        })

        await productManagerService.addProduct({
            title: "Hamburguesa de garbanzo y tofu",
            description: [
                "Garbanzo",
                "Tofu",
                "Champiñones",
                "Tomate",
                "Aceitunas",
                "Cebolla"
            ],
            price: 250,
            thumbnail: "./assets/img-products/item-4.jpg",
            code: "vegg3",
            stock: 10
        })

        await productManagerService.addProduct({
            title: "Pizza mozzarella",
            description: [
                "Mozzarella",
                "Salsa de tomate",
                "Orégano"
            ],
            price: 200,
            thumbnail: "./assets/img-products/item-5.jpg",
            code: "vget2",
            stock: 32
        })

        await productManagerService.addProduct({
            title: "Pizza caprese",
            description: [
                "Tomate",
                "Albahaca",
                "Queso vegano",
                "Salsa de tomate"
            ],
            price: 220,
            thumbnail: "./assets/img-products/item-6.jpg",
            code: "vegg4",
            stock: 18
        })

        await productManagerService.addProduct({
            title: "Pizza con ananá",
            description: [
                "Ananá",
                "Queso vegano",
                "Salsa de tomate"
            ],
            price: 220,
            thumbnail: "./assets/img-products/item-7.jpg",
            code: "vegg5",
            stock: 8
        })

        await productManagerService.addProduct({
            title: "Pizza gramajo",
            description: [
                "Huevo frito",
                "Papas fritas",
                "Aceitunas",
                "Mozzarella",
                "Salsa de tomate"
            ],
            price: 280,
            thumbnail: "./assets/img-products/item-8.jpg",
            code: "vget3",
            stock: 12
        })

        await productManagerService.addProduct({
            title: "Papas fritas con cheddar",
            description: [
                "Papa",
                "Queso cheddar",
                "Cebolla de verdeo"
            ],
            price: 220,
            thumbnail: "./assets/img-products/item-9.jpg",
            code: "vget4",
            stock: 50
        })

        await productManagerService.addProduct({
            title: "Papas fritas",
            description: [
                "Papa"
            ],
            price: 200,
            thumbnail: "./assets/img-products/item-10.jpg",
            code: "vegg6",
            stock: 60
        })
    } catch (error) {
        console.log(error.message)
    }
}

operations()