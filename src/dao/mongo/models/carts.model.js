import mongoose from "mongoose"

const cartsCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],
        default: []
    }
})

export const cartsModel = mongoose.model(cartsCollection, cartSchema)