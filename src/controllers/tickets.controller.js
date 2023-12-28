import { v4 as uuidv4 } from "uuid"
import { TicketsService } from "../services/tickets.service.js"
import { CartsService } from "../services/carts.service.js"
import { ProductsService } from "../services/products.service.js"
import { ticketsModel } from "../dao/mongo/models/tickets.model.js"
import { GetUserInfoDto } from "../dao/dto/getUserInfo.dto.js"
import { EError } from "../enums/EError.js"
import { CustomError } from "../services/customErrors/customError.service.js"
import { databaseGetError, paramError } from "../services/customErrors/errors/generalErrors.service.js"
import { purchaseCartError } from "../services/customErrors/errors/ticketsErrors.service.js"

export class TicketsController {
    static purchaseCart = async (req, res, next) => {
        try {
            const { cid } = req.params

            // Verificar que existe cid o lanzar el error correspondiente
            const cart = await CartsService.getCartById(cid)

            if (cart.products.length) {
                const ticketProducts = []
                const rejectedProducts = []

                // Verificar el stock de los productos
                for (let i = 0; i < cart.products.length; i++) {
                    const productInCart = cart.products[i]
                    const productInfo = productInCart.product

                    if (productInCart.quantity <= productInfo.stock) {
                        ticketProducts.push(productInCart)

                        // Restar la cantidad del stock
                        const updateStock = productInfo.stock - productInCart.quantity
                        await ProductsService.updateProduct(productInfo._id, { stock: updateStock })
                    } else {
                        rejectedProducts.push(productInCart)
                    }
                }

                const userInfoDto = new GetUserInfoDto(req.user)

                // Crear ticket
                const newTicket = {
                    code: uuidv4(),
                    purchase_datetime: new Date().toLocaleString("en-UY", { timeZone: "America/Montevideo" }),
                    amount: ticketProducts.reduce((acc, prod) => acc + prod.quantity * prod.product.price, 0),
                    purchaser: userInfoDto.email || userInfoDto.github_username,
                    purchase_products: ticketProducts
                }

                // Error customizado
                const infoTicket = new ticketsModel(newTicket)

                try {
                    await infoTicket.validate()
                } catch {
                    CustomError.createError ({
                        name: "purchase cart error",
                        cause: purchaseCartError(newTicket),
                        message: "Error al completar la compra",
                        errorCode: EError.INVALID_BODY_ERROR
                    })
                }

                // Actualizar carrito con los productos rechazados
                const productsRejectedInCart = await CartsService.updateProductsInCart(cid, rejectedProducts)

                if (rejectedProducts.length) {
                    if (ticketProducts.length) {
                        const newPurchase = await TicketsService.purchaseCart(newTicket)
                
                        res.json({
                            status: "success",
                            message: `
                                Compra realizada :)

                                Código de compra: ${newTicket.code}
                                Comprador: ${newTicket.purchaser}
                                Precio total: $${newTicket.amount}

                            `,
                            error: "Estos productos no se compraron por falta de stock:",
                            productsRejectedInCart
                        })
                    } else {
                        res.json({ status: "error", error: "Estos productos no se compraron por falta de stock:", productsRejectedInCart })
                    }
                } else {
                    const newPurchase = await TicketsService.purchaseCart(newTicket)

                    res.json({
                        status: "success",
                        message: `
                            Compra realizada :)

                            Código de compra: ${newTicket.code}
                            Comprador: ${newTicket.purchaser}
                            Precio total: $${newTicket.amount}
                        `,
                        newPurchase
                    })
                }
            } else {
                res.json({ status: "error", error: "El carrito está vacío" })
            }
        } catch (error) {
            next(error)
        }
    }

    static getTickets = async (req, res, next) => {
        try {
            const tickets = await TicketsService.getTickets()

            // Error customizado
            if (!tickets) {
                CustomError.createError ({
                    name: "get tickets error",
                    cause: databaseGetError(),
                    message: "Error al obtener los tickets de compra: ",
                    errorCode: EError.DATABASE_ERROR
                })
            }

            res.json({ status: "success", tickets })
        } catch (error) {
            next(error)
        }
    }

    static getTicketById = async (req, res, next) => {
        try {
            const { tid } = req.params
            const ticket = await TicketsService.getTicketById(tid)

            // Error customizado
            if (!ticket) {
                CustomError.createError ({
                    name: "get ticket by id error",
                    cause: paramError(tid),
                    message: "Error al obtener el ticket de compra: ",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }

            res.json({ status: "success", ticket })
        } catch (error) {
            next(error)
        }
    }
}