import express from "express"
import { engine } from "express-handlebars"
import session from "express-session"
import MongoStore from "connect-mongo"
import { Server } from "socket.io"
import dotenv from "dotenv"
import path from "path"
import { __dirname } from "./utils.js"
import { connectDB } from "./config/dbConnection.js"
import { productManagerService } from "./dao/index.js"
import { viewsRouter } from "./routes/views.routes.js"
import { sessionsRouter } from "./routes/sessions.routes.js"
import { productsRouter } from "./routes/products.routes.js"
import { cartsRouter } from "./routes/carts.routes.js"

dotenv.config()

const port = process.env.PORT || 8080
const app = express()

const httpServer = app.listen(port, () => {
    console.log("Servidor funcionando en el puerto: ", port)
})

const socketServer = new Server(httpServer)

// Conexión base de datos
connectDB()

// Configuración handlebars
app.engine(".hbs", engine({extname: ".hbs"}))
app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "/views"))

// Configuración de session
app.use(session ({
    store: MongoStore.create ({
        ttl: 3000,
        mongoUrl: process.env.MONGODB_URI
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

// Configuración socket.io
socketServer.on("connection", async (socket) => {
    console.log("Cliente conectado: ", socket.id)

    // Obtener productos
    const products = await productManagerService.getProductsNoFilter()
    socket.emit("productsArray", products)

    // Agregar el producto del socket del cliente
    socket.on("addProduct", async (productsData) => {
        try {
            const result = await productManagerService.addProduct(productsData)
            const products = await productManagerService.getProductsNoFilter()
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
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "/public")))

// Rutas
app.use("/", viewsRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)