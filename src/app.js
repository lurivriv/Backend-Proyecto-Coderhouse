import express from "express"
import path from "path"
import { productsRouter } from "./routes/products.routes.js"
import { cartsRouter } from "./routes/carts.routes.js"

const port = 8080
const app = express()
const __dirname = path.resolve()

app.listen(port, () => {
    console.log("Servidor funcionando")
})

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// Rutas
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)