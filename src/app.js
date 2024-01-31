import express from "express"
import { engine } from "express-handlebars"
import session from "express-session"
import cors from "cors"
import MongoStore from "connect-mongo"
import { ConnectDB } from "./config/dbConnection.js"
import passport from "passport"
import { initializePassport } from "./config/passport.config.js"
import swaggerUI from "swagger-ui-express"
import { swaggerSpecs } from "./config/swagger.config.js"
import { config } from "./config/config.js"
import { Server } from "socket.io"
import path from "path"
import { __dirname } from "./utils.js"
import { logger } from "./helpers/logger.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import { ProductsService } from "./services/products.service.js"
import { CartsService } from "./services/carts.service.js"
import { UsersService } from "./services/users.service.js"
import { sendDeleteProductEmail } from "./helpers/email.js"
import { viewsRouter } from "./routes/views.routes.js"
import { sessionsRouter } from "./routes/sessions.routes.js"
import { productsRouter } from "./routes/products.routes.js"
import { cartsRouter } from "./routes/carts.routes.js"
import { usersRouter } from "./routes/users.routes.js"

import { uploadProducts } from "./utils.js"
import { productsModel } from "./dao/mongo/models/products.model.js"

const port = config.server.port
const app = express()

const httpServer = app.listen(port, () => {
    logger.info(`Servidor funcionando en el puerto: ${port}`)
})

const socketServer = new Server(httpServer)

// Conexión base de datos
ConnectDB.getInstance()

// Configuración de session
app.use(session ({
    store: MongoStore.create ({
        ttl: 300000,
        mongoUrl: config.mongo.url
    }),
    secret: config.server.secretSession,
    resave: true,
    saveUninitialized: true
}))

// Configuración handlebars
app.engine(".hbs", engine({ extname: ".hbs" }))
app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "/views"))

// Configuración de passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Configuración socket.io
socketServer.on("connection", async (socket) => {
    logger.info(`Cliente conectado: ${socket.id}`)

    // Obtener productos
    const user = socket.handshake.auth.user
    const userSessionRole = user ? user.role : null
    const userSessionId = user ? user._id : null
    const products = await ProductsService.getProductsNoFilter(userSessionRole, userSessionId)
    socket.emit("productsArray", { productsData: products, userSessionRole: userSessionRole, userSessionId: userSessionId })

    // Agregar el producto del socket del cliente
    socket.on("addProduct", async (productInfo) => {
        try {
            const productToAdd = {
                ...productInfo,
                "thumbnail": productInfo.imageName ? `${productInfo.code}-product-${productInfo.imageName}` : "noImgProduct-product.jpg",
                "imageBuffer": productInfo.imageBuffer
            }

            const result = await ProductsService.addProduct(productToAdd)

            const products = await ProductsService.getProductsNoFilter(userSessionRole, userSessionId)
            socketServer.emit("productsArray", { productsData: products, userSessionRole: userSessionRole, userSessionId: userSessionId })
        } catch (error) {
            logger.error(`add product error: Error al crear el producto: ${error}`)
        }
    })

    // Eliminar el producto del socket del cliente
    socket.on("deleteProduct", async ({ productId, productTitle, productOwner, userId, userRole }) => {
        try {
            // Eliminar del carrito el producto eliminado (si es que está en uno)
            const carts = await CartsService.getCarts()
            const cartsWithProduct = carts.filter((cart) => cart.products.some((product) => product.product._id.toString() === productId))

            if (cartsWithProduct.length !== 0) {
                for (const cart of cartsWithProduct) {
                    await CartsService.deleteProductInCart(cart._id, productId)
                }
            }

            const result = await ProductsService.deleteProduct(productId)

            // Enviar mail si el producto eliminado es de un usuario premium y no del admin
            if ((userRole === "admin" && productOwner.toString() !== userId.toString()) || userRole === "premium" && productOwner.toString() === userId.toString()) {
                const owner = await UsersService.getUserById(productOwner)
                const ownerEmail = owner.email

                await sendDeleteProductEmail(ownerEmail, productTitle)
            }

            const products = await ProductsService.getProductsNoFilter(userSessionRole, userSessionId)
            socketServer.emit("productsArray", { productsData: products, userSessionRole: userSessionRole, userSessionId: userSessionId })
        } catch (error) {
            logger.error(`delete product error: Error al eliminar el producto: ${error}`)
        }
    })
})

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "/public")))
app.use(cors())

// Rutas
app.use("/", viewsRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/users", usersRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs))
app.use(errorHandler)