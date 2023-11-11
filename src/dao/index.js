import { ProductManagerDB } from "./mongo/managers/productManagerDB.js"
import { CartManagerDB } from "./mongo/managers/cartManagerDB.js"
import { UserManagerDB } from "./mongo/managers/userManagerDB.js"

export const productsDao = new ProductManagerDB()
export const cartsDao = new CartManagerDB()
export const usersDao = new UserManagerDB()