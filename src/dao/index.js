import { ProductManagerDB } from "./mongo/productManagerDB.js"
import { CartManagerDB } from "./mongo/cartManagerDB.js"

export const productManagerService = new ProductManagerDB()
export const cartManagerService = new CartManagerDB()