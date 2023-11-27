import { Router} from "express"
import { noSessionMiddleware, sessionMiddleware, checkRoleMiddleware } from "../middlewares/auth.js"
import { ProductsService } from "../services/products.service.js"
import { CartsService } from "../services/carts.service.js"
import { GetUserInfoDto } from "../dao/dto/getUserInfo.dto.js"

const router = Router()

// Productos en home (Si no hay una sesión activa redirigir al login)
router.get("/", noSessionMiddleware, async (req, res) => {
    try {
        const productsNoFilter = await ProductsService.getProductsNoFilter()
        
        const userInfoDto = new GetUserInfoDto(req.user)
        res.render("home", { productsNoFilter, userInfoDto, title: "Sabores verdes - Uruguay" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Productos en real time products
router.get("/realtimeproducts", noSessionMiddleware, checkRoleMiddleware(["admin"]), async (req, res) => {
    try {
        res.render("realTimeProducts", { title: "Menú - Sabores verdes" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Todos los productos
router.get("/products", noSessionMiddleware, async (req, res) => {
    try {
        const { limit = 8, page = 1, sort, category, stock } = req.query

        const query = {}

        const options = {
            limit,
            page,
            sort,
            lean: true
        }

        // Filtrar por categoría
        if (category) {
            query.category = category
        }

        // Filtrar por stock
        if (stock) {
            if (stock === "false" || stock == 0) {
                query.stock = 0
            } else {
                query.stock = stock
            }
        }

        // Ordenar por precio
        if (sort) {
            if (sort === "asc") {
                options.sort = { price: 1 }
            } else if (sort === "desc") {
                options.sort = { price: -1 }
            }
        }

        const products = await ProductsService.getProducts(query, options)

        const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl
        
        const dataProducts = {
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `${baseUrl.replace(`page=${products.page}`, `page=${products.prevPage}`)}` : null,
            nextLink: products.hasNextPage ? baseUrl.includes("page") ? baseUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : baseUrl.concat(`?page=${products.nextPage}`) : null,
            title: "Menú - Sabores verdes"
        }

        const userInfoDto = new GetUserInfoDto(req.user)
        res.render("productsPaginate", { dataProducts, userInfoDto })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Detalle de producto
router.get("/products/:pid", noSessionMiddleware, async (req, res) => {
    try {
        const { pid } = req.params
        const product = await ProductsService.getProductById(pid)

        product.title = product.title.toUpperCase()
        
        const userInfoDto = new GetUserInfoDto(req.user)
        res.render("productDetail", { product, userInfoDto, title: `${product.title} - Sabores verdes` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Carrito
router.get("/carts/:cid", noSessionMiddleware, checkRoleMiddleware(["usuario"]), async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await CartsService.getCartById(cid)

        // Precio total
        const totalPrice = cart.products.reduce((acc, prod) => acc + prod.quantity * prod.product.price, 0)

        // Subtotal (cada producto)
        cart.products.forEach((prod) => {
            prod.subtotalPrice = prod.quantity * prod.product.price
        })

        const userInfoDto = new GetUserInfoDto(req.user)
        res.render("cart", { cart, totalPrice, userInfoDto, title: "Carrito - Sabores verdes" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Signup
router.get("/signup", sessionMiddleware, async (req, res) => {
    try {
        res.render("signup", { title: "Registrarse - Sabores verdes" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Login
router.get("/login", sessionMiddleware, async (req, res) => {
    try {
        res.render("login", { title: "Iniciar sesión - Sabores verdes" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Perfil
router.get("/profile", noSessionMiddleware, async (req, res) => {
    try {
        const userInfoDto = new GetUserInfoDto(req.user)
        res.render("profile", { userInfoDto, title: "Perfil - Sabores verdes" })   
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el perfil" })
    }
})

export { router as viewsRouter }