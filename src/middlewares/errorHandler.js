import { EError } from "../enums/EError.js"

export const errorHandler = (error, req, res, next) => {
    switch (error.code) {
        case EError.DATABASE_ERROR:
            res.json({ status: "error", error: error.message + error.cause })
            break

        case EError.INVALID_PARAM_ERROR:
            res.json({ status: "error", error: error.message + error.cause })
            break

        case EError.INVALID_BODY_ERROR:
            res.json({ status: "error", error: error.message + error.cause })
            break

        default:
            res.json({ status: "error", error: error.message })
            break
    }
}