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
            logger.error(`purchase cart error: Error al crear el ticket de compra: ${error}`)
            throw new Error(`purchase cart error: Error al crear el ticket de compra: ${error}`)
        }
    }

    // Obtener todos los tickets de compra
    async getTickets() {
        try {
            const result = await this.model.find().lean()
            return result
        } catch (error) {
            logger.error(`get tickets error: Error al obtener los tickets de compra: ${error}`)
            throw new Error(`get tickets error: Error al obtener los tickets de compra: ${error}`)
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
            logger.error(`get ticket by id error: Error al obtener el ticket de compra: ${error}`)
            throw new Error(`get ticket by id error: Error al obtener el ticket de compra: ${error}`)
        }
    }
}