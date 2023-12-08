import { ticketsModel } from "../models/tickets.model.js"
import { logger } from "../../../helpers/logger.js"

export class TicketManagerDB {
    constructor() {
        this.model = ticketsModel
    }

    // Crear un ticket de compra
    async purchaseCart(newTicket) {
        try {
            const result = await this.model.create(newTicket)
            return result
        } catch (error) {
            logger.error("purchase cart: Error al crear el ticket de compra")
            throw new Error("Error al crear el ticket de compra")
        }
    }

    // Obtener todos los tickets de compra
    async getTickets() {
        try {
            const result = await this.model.find().lean()
            return result
        } catch (error) {
            logger.error("get tickets: Error al obtener los tickets de compra")
            throw new Error("Error al obtener los tickets de compra")
        }
    }

    // Obtener un ticket de compra por ID
    async getTicketById(ticketId) {
        try {
            const result = await this.model.findById(ticketId).lean()

            if (!result) {
                throw error
            }

            return result
        } catch (error) {
            logger.error("get ticket by id: Error al obtener el ticket de compra")
            throw new Error("Error al obtener el ticket de compra")
        }
    }
}