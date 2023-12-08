import winston from "winston"
import path from "path"
import { __dirname } from "../utils.js"
import { config } from "../config/config.js"

const currentEnv = config.server.envMode

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "black",
        error: "red",
        warning: "yellow",
        info: "green",
        http: "blue",
        debug: "magenta"
    }
}

winston.addColors(customLevels.colors)

// Logger para development
const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: "debug" })
    ]
})

// Logger para production
const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: "info" }),
        new winston.transports.File({ filename: path.join(__dirname, "/logs/errors.log"), level: "error" })
    ]
})

let logger

if (currentEnv === "development") {
    logger = devLogger
} else {
    logger = prodLogger
}

export { logger }