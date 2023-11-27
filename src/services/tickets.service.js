import { ticketsDao } from "../dao/index.js"

export class TicketsService {
    static purchaseCart(newTicket) {
        return ticketsDao.purchaseCart(newTicket)
    }

    static getTickets() {
        return ticketsDao.getTickets()
    }

    static getTicketById(ticketId) {
        return ticketsDao.getTicketById(ticketId)
    }
}