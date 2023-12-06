import { ticketsModel } from "../models/tickets.model.js"

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
            throw new Error("Error al crear el ticket de compra")
        }
    }

    // Obtener todos los tickets de compra
    async getTickets() {
        try {
            const result = await this.model.find().lean()
            return result
        } catch (error) {
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
            throw new Error("Error al obtener el ticket de compra")
        }
    }
}