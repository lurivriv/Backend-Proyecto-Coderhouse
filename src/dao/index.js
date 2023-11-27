import { ProductManagerDB } from "./mongo/managers/productManagerDB.js"
import { CartManagerDB } from "./mongo/managers/cartManagerDB.js"
import { TicketManagerDB } from "./mongo/managers/ticketManagerDB.js"
import { UserManagerDB } from "./mongo/managers/userManagerDB.js"

export const productsDao = new ProductManagerDB()
export const cartsDao = new CartManagerDB()
export const ticketsDao = new TicketManagerDB()
export const usersDao = new UserManagerDB()