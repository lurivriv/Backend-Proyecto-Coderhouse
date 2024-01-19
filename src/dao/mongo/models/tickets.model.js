import mongoose from "mongoose"

const ticketsCollection = "tickets"

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    purchase_products: {
        type: Object,
        required: true
    }
})

export const ticketsModel = mongoose.model(ticketsCollection, ticketSchema)