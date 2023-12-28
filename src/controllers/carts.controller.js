import { CartsService } from "../services/carts.service.js"
import { ProductsService } from "../services/products.service.js"
import { EError } from "../enums/EError.js"
import { CustomError } from "../services/customErrors/customError.service.js"
import { databaseGetError, paramError } from "../services/customErrors/errors/generalErrors.service.js"
import { createCartError, addProductToCartError, updateProductsInCartError, updateProductQuantityInCartError } from "../services/customErrors/errors/cartsErrors.service.js"

export class CartsController {
    static getCarts = async (req, res, next) => {
        try {
            const carts = await CartsService.getCarts()

            // Error customizado
            if (!carts) {
                CustomError.createError ({
                    name: "get carts error",
                    cause: databaseGetError(),
                    message: "Error al obtener los carritos: ",
                    errorCode: EError.DATABASE_ERROR
                })
            }

            res.json({ status: "success", carts })
        } catch (error) {
            next(error)
        }
    }

    static getCartById = async (req, res, next) => {
        try {
            const { cid } = req.params
            const cart = await CartsService.getCartById(cid)

            // Error customizado
            if (!cart) {
                CustomError.createError ({
                    name: "get cart by id error",
                    cause: paramError(cid),
                    message: "Error al obtener el carrito: ",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }

            res.json({ status: "success", cart })
        } catch (error) {
            next(error)
        }
    }

    static createCart = async (req, res, next) => {
        try {
            const createdCart = await CartsService.createCart()

            // Error customizado
            if (!createdCart) {
                CustomError.createError ({
                    name: "create cart error",
                    cause: createCartError(),
                    message: "Error al crear el carrito: ",
                    errorCode: EError.DATABASE_ERROR
                })
            }

            res.json({ status: "success", message: "Carrito creado", createdCart })
        } catch (error) {
            next(error)
        }
    }

    static addProductToCart = async (req, res, next) => {
        try {
            const { cid, pid } = req.params
            const { quantity } = req.body
    
            // Verificar que existen cid y pid o lanzar el error correspondiente
            const cart = await CartsService.getCartById(cid)
            const product = await ProductsService.getProductById(pid)

            const customQuantity = quantity ?? 1

            // Error customizado
            if (isNaN(customQuantity) || customQuantity < 0) {
                CustomError.createError ({
                    name: "add product to cart error",
                    cause: addProductToCartError(customQuantity),
                    message: "Error al agregar el producto al carrito: ",
                    errorCode: EError.INVALID_BODY_ERROR
                })
            }

            if (req.user.role === "premium" && product.owner.toString() === req.user._id.toString()) {
                // Error customizado
                CustomError.createError ({
                    name: "add product to cart error",
                    cause: "No podés agregar al carrito tu propio producto",
                    message: "Error al agregar el producto al carrito: ",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            } else {
                const addedProductToCart = await CartsService.addProductToCart(cid, pid, customQuantity)
                res.json({ status: "success", message: "Producto agregado al carrito", addedProductToCart })
            }
        } catch (error) {
            next(error)
        }
    }

    static updateProductsInCart = async (req, res, next) => {
        try {
            const { cid } = req.params
            const { newProducts } = req.body
    
            // Verificar que existe cid o lanzar el error correspondiente
            const cart = await CartsService.getCartById(cid)

            // Error customizado
            if (!Array.isArray(newProducts)) {
                CustomError.createError({
                    name: "update products in cart error",
                    cause: updateProductsInCartError(newProducts),
                    message: "Error al validar los datos: ",
                    errorCode: EError.INVALID_BODY_ERROR,
                })
            }

            for (const product of newProducts) {
                if (
                    !product || typeof product !== "object" ||
                    !product.product || !product.quantity ||
                    isNaN(product.quantity) || product.quantity < 0
                ) {
                    CustomError.createError({
                        name: "update products in cart error",
                        cause: updateProductsInCartError(product),
                        message: "Error al validar los datos",
                        errorCode: EError.INVALID_BODY_ERROR,
                    })
                } else {
                    const productInfo = await ProductsService.getProductById(product.product)

                    if (req.user.role === "premium" && productInfo.owner.toString() === req.user._id.toString()) {
                        // Error customizado
                        CustomError.createError ({
                            name: "update products in cart error",
                            cause: "No podés agregar al carrito tu propio producto",
                            message: "Error al actualizar los productos en el carrito: ",
                            errorCode: EError.INVALID_BODY_ERROR
                        })
                        return
                    }
                }
            }

            const updatedProductsInCart = await CartsService.updateProductsInCart(cid, newProducts)
            res.json({ status: "success", message: "Productos en el carrito actualizados", updatedProductsInCart })
        } catch (error) {
            next(error)
        }
    }

    static updateProductQuantityInCart = async (req, res, next) => {
        try {
            const { cid, pid } = req.params
            const { newQuantity } = req.body
    
            // Verificar que existen cid y pid o lanzar el error correspondiente
            const cart = await CartsService.getCartById(cid)
            const product = await ProductsService.getProductById(pid)
    
            // Error customizado
            if (isNaN(newQuantity) || newQuantity < 0) {
                CustomError.createError ({
                    name: "update product quantity in cart error",
                    cause: updateProductQuantityInCartError(newQuantity),
                    message: "Error al actualizar la cantidad del producto en el carrito: ",
                    errorCode: EError.INVALID_BODY_ERROR
                })
            }

            if (req.user.role === "premium" && product.owner.toString() === req.user._id.toString()) {
                // Error customizado
                CustomError.createError ({
                    name: "update product quantity in cart error",
                    cause: "No podés agregar al carrito tu propio producto",
                    message: "Error al actualizar la cantidad del producto en el carrito: ",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            } else {
                const updatedQuantityProductInCart = await CartsService.updateProductQuantityInCart(cid, pid, newQuantity)
                res.json({ status: "success", message: "Cantidad del producto actualizada", updatedQuantityProductInCart })
            }
        } catch (error) {
            next(error)
        }
    }

    static deleteAllProductsInCart = async (req, res, next) => {
        try {
            const { cid } = req.params
            const { newCart } = req.body
    
            // Verificar que existe cid o lanzar el error correspondiente
            const cart = await CartsService.getCartById(cid)
    
            // Error customizado
            if (!cart) {
                CustomError.createError ({
                    name: "delete all products in cart error",
                    cause: paramError(cid),
                    message: "Error al obtener el carrito a vaciar: ",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }

            const emptyNewCart = await CartsService.deleteAllProductsInCart(cid, newCart)
            res.json({ status: "success", message: "Carrito vaciado", emptyNewCart })
        } catch (error) {
            next(error)
        }
    }

    static deleteProductInCart = async (req, res, next) => {
        try {
            const { cid, pid } = req.params
    
            // Verificar que existen cid y pid o lanzar el error correspondiente
            const cart = await CartsService.getCartById(cid)
            const product = await ProductsService.getProductById(pid)
    
            // Error customizado
            if (!cart) {
                CustomError.createError ({
                    name: "delete product in cart error",
                    cause: paramError(cid),
                    message: "Error al obtener el carrito a actualizar: ",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }

            if (!product) {
                CustomError.createError ({
                    name: "delete product in cart error",
                    cause: paramError(pid),
                    message: "Error al obtener el producto a eliminar: ",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }

            const newCart = await CartsService.deleteProductInCart(cid, pid)
            res.json({ status: "success", message: "Producto eliminado del carrito", newCart })
        } catch (error) {
            next(error)
        }
    }
}