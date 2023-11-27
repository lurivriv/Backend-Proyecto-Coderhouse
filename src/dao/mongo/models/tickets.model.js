import mongoose from "mongoose"

const ticketsCollection = "tickets"

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "El código es obligatorio"],
        unique: [true, "El código ya existe"]
    },
    purchase_datetime: {
        type: String,
        default: Date.now
    },
    amount: {
        type: Number,
        required: [true, "El precio total de la compra es obligatorio"]
    },
    purchaser: {
        type: String,
        required: [true, "El dato del comprador es obligatorio"]
    },
    purchase_products: {
        type: Object,
        required: [true, "Debe haber productos para comprar"]
    }
})

export const ticketsModel = mongoose.model(ticketsCollection, ticketSchema)