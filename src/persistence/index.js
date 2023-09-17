import path from "path"
import { __dirname } from "../utils.js"
import { ProductManager } from "./files/productManager.js"
import { CartManager } from "./files/cartManager.js"

export const productManagerService = new ProductManager(path.join(__dirname, "/data/products.json"))
export const cartManagerService = new CartManager(path.join(__dirname, "/data/carts.json"))