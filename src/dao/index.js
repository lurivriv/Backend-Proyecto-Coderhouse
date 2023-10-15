import { ProductManagerDB } from "./mongo/productManagerDB.js"
import { CartManagerDB } from "./mongo/cartManagerDB.js"
import { SessionManagerDB } from "./mongo/sessionManagerDB.js"

export const productManagerService = new ProductManagerDB()
export const cartManagerService = new CartManagerDB()
export const sessionManagerService = new SessionManagerDB()