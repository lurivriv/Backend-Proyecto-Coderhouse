import mongoose from "mongoose"
import { config } from "./config.js"
import { logger } from "../helpers/logger.js"

export class ConnectDB {
    static #instance

    static #connectMongo() {
        const connection = mongoose.connect(config.mongo.url)
        logger.info("Base de datos conectada con éxito")
        return connection
    }

    static getInstance() {
        if(this.#instance) {
            logger.info("Base de datos ya conectada")
            return this.#instance
        } else {
            this.#instance = this.#connectMongo()
            return this.#instance
        }
    }
}