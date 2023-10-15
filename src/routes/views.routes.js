import { Router} from "express"
import { productManagerService } from "../dao/index.js"
import { cartManagerService } from "../dao/index.js"

const router = Router()

// Si no hay una sesión activa
const publicRouteMiddleware = (req, res, next) => {
    if (!req.session.email) {
        return res.redirect("/login")
    }
    next()
}

// Si hay una sesión activa
const privateRouteMiddleware = (req, res, next) => {
    if (req.session.email) {
        return res.redirect("/profile")
    }
    next()
}

// Productos en home (Si no hay una sesión activa redirigir al login)
router.get("/", publicRouteMiddleware, async (req, res) => {
    try {
        const productsNoFilter = await productManagerService.getProductsNoFilter()
        res.render("home", { productsNoFilter, title: "Sabores verdes - Uruguay" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Productos en real time products
router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realTimeProducts", { title: "Menú - Sabores verdes" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Todos los productos
router.get("/products", async (req, res) => {
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

        const products = await productManagerService.getProducts(query, options)

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

        res.render("productsPaginate", { 
            dataProducts,
            userFirstName: req.session.first_name,
            userLastName: req.session.last_name,
            userRole: req.session.role,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Detalle de producto
router.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params
        const product = await productManagerService.getProductById(pid)

        product.title = product.title.toUpperCase()
        
        res.render("productDetail", { product, title: `${product.title} - Sabores verdes` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Carrito
router.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartManagerService.getCartById(cid)
        res.render("cart", { cart, title: "Carrito - Sabores verdes" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Signup
router.get("/signup", privateRouteMiddleware, async (req, res) => {
    try {
        res.render("signup", { title: "Registrarse - Sabores verdes" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Login
router.get("/login", privateRouteMiddleware, async (req, res) => {
    try {
        res.render("login", { title: "Iniciar sesión - Sabores verdes" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Perfil
router.get("/profile", publicRouteMiddleware, async (req, res) => {
    try {
        res.render("profile", { 
            userFirstName: req.session.first_name,
            userLastName: req.session.last_name,
            userEmail: req.session.email,
            userAge: req.session.age,
            userRole: req.session.role,
            title: "Perfil - Sabores verdes"
        })   
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el perfil" })
    }
})

export { router as viewsRouter }