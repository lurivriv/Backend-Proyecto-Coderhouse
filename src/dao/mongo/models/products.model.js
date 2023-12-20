import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = "products"

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: Array,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ["vegano", "vegetariano"]
    },
    thumbnail: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
})

productSchema.plugin(mongoosePaginate)

export const productsModel = mongoose.model(productsCollection, productSchema)