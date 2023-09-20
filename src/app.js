import fs from "fs"
import express from "express"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import path from "path"
import { __dirname } from "./utils.js"
import { viewsRouter } from "./routes/views.routes.js"
import { productsRouter } from "./routes/products.routes.js"
import { cartsRouter } from "./routes/carts.routes.js"
import { productManagerService } from "./persistence/index.js"

const port = 8080
const app = express()

const httpServer = app.listen(port, () => {
    console.log("Servidor funcionando en el puerto: ", port)
})

const socketServer = new Server(httpServer)

// Configuración handlebars
app.engine(".hbs", engine({extname: ".hbs"}))
app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "/views"))

// Configuración socket.io
socketServer.on("connection", async (socket) => {
    console.log("Cliente conectado: ", socket.id)

    // Obtener productos
    const products = await productManagerService.getProducts()
    socket.emit("productsArray", products)

    // Agregar el producto del socket del cliente
    socket.on("addProduct", async (productsData) => {
        try {
            let filePath = ""

            if (productsData.imageName !== "") {
                filePath = `${path.join(__dirname, `/public/assets/imgProducts/${productsData.imageName}`)}`
            }

            const productToSave = {
                "title": productsData.title,
                "description": productsData.description,
                "code": productsData.code,
                "price": productsData.price,
                "stock": productsData.stock,
                "category": productsData.category,
                "status": productsData.status,
                "thumbnail": productsData.imageName
            }

            if (productsData.imageName !== "") {
                await fs.promises.writeFile(filePath, productsData.thumbnail)
            }
            
            const result = await productManagerService.addProduct(productToSave)
            const products = await productManagerService.getProducts()
            socketServer.emit("productsArray", products)
        } catch (error) {
            console.error(error.message)
        }
    })

    // Eliminar el producto del socket del cliente
    socket.on("deleteProduct", async (productId) => {
        try {
            const result = await productManagerService.deleteProduct(productId)
            const products = await productManagerService.getProducts()
            socketServer.emit("productsArray", products)
        } catch (error) {
            console.error(error.message)
        }
    })
})

// Middlewares
app.use(express.json())
app.use(express.static(path.join(__dirname, "/public")))

// Rutas
app.use("/", viewsRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)