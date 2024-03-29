import { productsModel } from "../dao/mongo/models/products.model.js"
import { usersModel } from "../dao/mongo/models/users.model.js"
import { ProductsService } from "../services/products.service.js"
import { UsersService } from "../services/users.service.js"
import { CartsService } from "../services/carts.service.js"
import { sendDeleteProductEmail } from "../helpers/email.js"
import { generateProductMock } from "../helpers/mock.js"
import { EError } from "../enums/EError.js"
import { CustomError } from "../services/customErrors/customError.service.js"
import { databaseGetError, paramError } from "../services/customErrors/errors/generalErrors.service.js"
import { addProductError, mockingProductsError } from "../services/customErrors/errors/productsErrors.service.js"

export class ProductsController {
    static getProducts = async (req, res, next) => {
        try {
            const { limit = 8, page = 1, sort, category, stock } = req.query

            const query = {}

            const options = {
                limit,
                page,
                sort,
                lean: true
            }

            // Filtrar por categoría (http://localhost:8080/api/products?category=vegano)
            if (category) {
                query.category = category
            }

            // Filtrar por stock (http://localhost:8080/api/products?stock=0 || http://localhost:8080/api/products?stock=20)
            if (stock) {
                if (stock === "false" || stock == 0) {
                    query.stock = 0
                } else {
                    query.stock = stock
                }
            }

            // Ordenar por precio (http://localhost:8080/api/products?sort=desc || http://localhost:8080/api/products?sort=asc)
            if (sort) {
                if (sort === "asc") {
                    options.sort = { price: 1 }
                } else if (sort === "desc") {
                    options.sort = { price: -1 }
                }
            }

            const products = await ProductsService.getProducts(query, options)

            // Error customizado
            if (!products) {
                CustomError.createError ({
                    name: "get products error",
                    cause: databaseGetError(),
                    message: "Error al obtener los productos: ",
                    errorCode: EError.DATABASE_ERROR
                })
            }

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
            }

            res.json({ status: "success", dataProducts })
        } catch (error) {
            next(error)
        }
    }

    static getProductById = async (req, res, next) => {
        try {
            const { pid } = req.params
            const product = await ProductsService.getProductById(pid)

            // Error customizado
            if (!product) {
                CustomError.createError ({
                    name: "get product by id error",
                    cause: paramError(pid),
                    message: "Error al obtener el producto: ",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }

            res.json({ status: "success", product })
        } catch (error) {
           next(error)
        }
    }

    static addProduct = async (req, res, next) => {
        try {
            const productInfo = req.body

            productInfo.thumbnail = req.file?.filename

            if (req.user.role === "premium" || req.user.role === "admin") {
                productInfo.owner = req.user._id

                if (!productInfo.owner || productInfo.owner === "") {
                    const adminInfo = await usersModel.findOne({ role: "admin" })
                    productInfo.owner = adminInfo?._id
                }
            } else {
                // Error customizado
                CustomError.createError ({
                    name: "add product error",
                    cause: "Solo los admin o usuarios premium pueden agregar productos",
                    message: "Error al agregar el producto: ",
                    errorCode: EError.INVALID_BODY_ERROR
                })
            }

            // Error customizado
            const newProduct = new productsModel(productInfo)

            try {
                await newProduct.validate()
            } catch {
                CustomError.createError ({
                    name: "add product error",
                    cause: addProductError(productInfo),
                    message: "Error al validar los datos: ",
                    errorCode: EError.INVALID_BODY_ERROR
                })
            }

            const addedProduct = await ProductsService.addProduct(productInfo)
            res.json({ status: "success", message: "Producto creado", addedProduct })
        } catch (error) {
            next(error)
        }
    }

    static updateProduct = async (req, res, next) => {
        try {
            const { pid } = req.params
            const { title, description, code, price, stock, category } = req.body
            const thumbnail = req.file?.filename
            const products = await ProductsService.getProductsNoFilter()
            const product = await ProductsService.getProductById(pid)

            // Error customizado
            if (!product) {
                CustomError.createError ({
                    name: "update product error",
                    cause: paramError(pid),
                    message: "Error al actualizar el producto: ",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }

            const existingCode = products.find((product) => product.code === code)
            
            if (((price && isNaN(price)) || (stock && isNaN(stock)) || price < 0 || stock < 0) ||
                (category && category !== "vegano" && category !== "vegetariano") ||
                (existingCode && existingCode._id.toString() !== product._id.toString())) {
                CustomError.createError ({
                    name: "update product error",
                    cause: "Hay campos inválidos",
                    message: "Error al actualizar el producto: ",
                    errorCode: EError.INVALID_BODY_ERROR
                })
            }

            // Campos
            const updateFields = {
                title: title || product.title,
                description: description || product.description,
                code: code || product.code,
                price: price || product.price,
                stock: stock || product.stock,
                category: category || product.category,
                thumbnail: thumbnail || product.thumbnail,
            }

            // Actualizar producto en el carrito (si es que está en uno)
            const carts = await CartsService.getCarts()
            const cartsWithProduct = carts.filter((cart) => cart.products.some((product) => product.product._id.toString() === pid))

            if (cartsWithProduct.length !== 0) {
                for (const cart of cartsWithProduct) {
                    const updatedProducts = cart.products.map((productInCart) => {
                        if (productInCart.product._id.toString() === pid) {
                            return {
                                product: {
                                    ...productInCart.product,
                                    ...updateFields,
                                },
                                quantity: productInCart.quantity,
                                _id: productInCart._id,
                            }
                        }
                        return productInCart
                    })

                    await CartsService.updateProductsInCart(cart._id, updatedProducts)
                }
            }

            if ((req.user.role === "premium" && product.owner.toString() === req.user._id.toString()) || req.user.role === "admin") {
                const updatedProduct = await ProductsService.updateProduct(pid, updateFields)
                res.json({ status: "success", message: "Producto actualizado", updatedProduct })
            } else {
                // Error customizado
                CustomError.createError ({
                    name: "update product error",
                    cause: "No tenés permisos para actualizar este producto",
                    message: "Error al actualizar el producto: ",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static deleteProduct = async (req, res, next) => {
        try {
            const { pid } = req.params
            const product = await ProductsService.getProductById(pid)

            if ((req.user.role === "premium" && product.owner.toString() === req.user._id.toString()) || req.user.role === "admin") {
                // Eliminar producto eliminado del carrito (si es que está en uno)
                const carts = await CartsService.getCarts()
                const cartsWithProduct = carts.filter((cart) => cart.products.some((product) => product.product._id.toString() === pid))

                if (cartsWithProduct.length !== 0) {
                    for (const cart of cartsWithProduct) {
                        await CartsService.deleteProductInCart(cart._id, pid)
                    }
                }

                const deletedProduct = await ProductsService.deleteProduct(pid)

                // Enviar mail si el producto eliminado es de un usuario premium y no del admin
                if ((req.user.role === "admin" && product.owner.toString() !== req.user._id.toString()) || (req.user.role === "premium" && product.owner.toString() === req.user._id.toString())) {
                    const owner = await UsersService.getUserById(product.owner)
                    const ownerEmail = owner.email

                    await sendDeleteProductEmail(ownerEmail, product.title)
                }

                res.json({ status: "success", message: "Producto eliminado", deletedProduct })
            } else {
                // Error customizado
                CustomError.createError ({
                    name: "delete product error",
                    cause: "No tenés permisos para eliminar este producto",
                    message: "Error al eliminar el producto: ",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static mockingProducts = async (req, res, next) => {
        try {
            const quantity = parseInt(req.query.quantity) || 100
            let products = []

            for (let i = 0; i < quantity; i++) {
                const newProduct = generateProductMock()

                // Error customizado
                if (!newProduct) {
                    CustomError.createError ({
                        name: "mocking products error",
                        cause: mockingProductsError(),
                        message: "Error al crear los productos",
                        errorCode: EError.DATABASE_ERROR
                    })
                }

                products.push(newProduct)
            }

            res.json({ status: "success", dataProducts: { payload: products }})
        } catch (error) {
            next(error)
        }
    }
}