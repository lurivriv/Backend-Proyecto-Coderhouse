import mongoose from "mongoose"
import { config } from "./config.js"

export class ConnectDB {
    static #instance

    static #connectMongo() {
        const connection = mongoose.connect(config.mongo.url)
        console.log("Base de datos conectada con éxito")
        return connection
    }

    static getInstance() {
        if(this.#instance) {
            console.log("Base de datos ya conectada")
            return this.#instance
        } else {
            this.#instance = this.#connectMongo()
            return this.#instance
        }
    }
}