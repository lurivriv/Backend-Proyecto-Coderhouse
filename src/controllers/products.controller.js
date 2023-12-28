import { ProductsService } from "../services/products.service.js"
import { productsModel } from "../dao/mongo/models/products.model.js"
import { usersModel } from "../dao/mongo/models/users.model.js"
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
            const thumbnailFile = req.file ? req.file.filename : undefined

            productInfo.thumbnail = thumbnailFile

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
            const updateFields = req.body
            const thumbnailFile = req.file ? req.file.filename : undefined
            const product = await ProductsService.getProductById(pid)

            updateFields.thumbnail = thumbnailFile

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
                const deletedProduct = await ProductsService.deleteProduct(pid)
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