import mongoose from "mongoose"
import { config } from "./config.js"
import { logger } from "../helpers/logger.js"

export class ConnectDB {
    static #instance

    static #connectMongo = async () => {
        try {
            const connection = await mongoose.connect(config.mongo.url)
            logger.info("Base de datos conectada con éxito")
            return connection
        } catch (error) {
            logger.error(`Error al conectar la base de datos: ${error}`)
        }
    }

    static getInstance = () => {
        if(this.#instance) {
            logger.info("Base de datos ya conectada")
            return this.#instance
        } else {
            this.#instance = this.#connectMongo()
            return this.#instance
        }
    }
}