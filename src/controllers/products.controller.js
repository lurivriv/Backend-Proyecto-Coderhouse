import { ProductsService } from "../services/products.service.js"
import { productsModel } from "../dao/mongo/models/products.model.js"
import { generateProductMock } from "../helpers/mock.js"
import { EError } from "../enums/EError.js"
import { CustomError } from "../services/customErrors/customError.service.js"
import { databaseGetError, paramError } from "../services/customErrors/errors/generalErrors.service.js"
import { addProductError, updateProductError, mockingProductsError } from "../services/customErrors/errors/productsErrors.service.js"

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
                    message: "Error al obtener los productos",
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
        
            res.json({ status: "success", data: dataProducts })
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
                    message: "Error al obtener el producto",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }

            res.json({ status: "success", data: product })
        } catch (error) {
           next(error)
        }
    }

    static addProduct = async (req, res, next) => {
        try {
            const productInfo = req.body
            const thumbnailFile = req.file ? req.file.filename : undefined

            // Error customizado
            const newProduct = new productsModel(productInfo)

            try {
                await newProduct.validate()
            } catch {
                CustomError.createError ({
                    name: "add product error",
                    cause: addProductError(productInfo),
                    message: "Error al validar los datos",
                    errorCode: EError.INVALID_BODY_ERROR
                })
            }
        
            newProduct.thumbnail = thumbnailFile

            const addedProduct = await ProductsService.addProduct(productInfo)
            res.json({ status: "success", message: "Producto creado", data: addedProduct })
        } catch (error) {
            next(error)
        }
    }

    static updateProduct = async (req, res, next) => {
        try {
            const { pid } = req.params
            const updateFields = req.body
            const thumbnailFile = req.file ? req.file.filename : undefined
    
            // Error customizado
            const { title, description, code, price, stock, category } = updateFields

            if (
                title && typeof title !== "string" ||
                description && !Array.isArray(description) ||
                code && typeof code !== "string" ||
                price && typeof price !== "number" ||
                stock && typeof stock !== "number" ||
                category && (typeof category !== "string" || (category !== "vegano" && category !== "vegetariano")) ||
                price < 0 ||
                stock < 0
            ) {
                CustomError.createError({
                    name: "update product error",
                    cause: updateProductError(updateFields),
                    message: "Error al validar los datos",
                    errorCode: EError.INVALID_BODY_ERROR
                })
            }
    
            updateFields.thumbnail = thumbnailFile

            const updatedProduct = await ProductsService.updateProduct(pid, updateFields)
            res.json({ status: "success", message: "Producto actualizado", data: updatedProduct })
        } catch (error) {
            next(error)
        }
    }

    static deleteProduct = async (req, res, next) => {
        try {
            const { pid } = req.params
            const deletedProduct = await ProductsService.deleteProduct(pid)

            // Error customizado
            if (!deletedProduct) {
                CustomError.createError ({
                    name: "delete product error",
                    cause: paramError(pid),
                    message: "Error al obtener el producto a eliminar",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }

            res.json({ status: "success", message: "Producto eliminado", data: deletedProduct })
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

            res.json({ status: "success", data: { payload: products }})
        } catch (error) {
            next(error)
        }
    }
}