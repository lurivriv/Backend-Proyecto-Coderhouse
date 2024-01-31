import { UserManagerDB } from "./mongo/managers/userManagerDB.js"
import { ProductManagerDB } from "./mongo/managers/productManagerDB.js"
import { CartManagerDB } from "./mongo/managers/cartManagerDB.js"
import { TicketManagerDB } from "./mongo/managers/ticketManagerDB.js"

export const usersDao = new UserManagerDB()
export const productsDao = new ProductManagerDB()
export const cartsDao = new CartManagerDB()
export const ticketsDao = new TicketManagerDB()