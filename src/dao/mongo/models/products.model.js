import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = "products"

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "El título es obligatorio"]
    },
    description: {
        type: Array,
        required: [true, "La descripción es obligatoria"]
    },
    code: {
        type: String,
        required: [true, "El código es obligatorio"],
        unique: [true, "El código ingresado ya existe"],
    },
    price: {
        type: Number,
        required: [true, "El precio es obligatorio"],
        min: [0, "El precio debe ser mayor o igual a 0"]
    },
    stock: {
        type: Number,
        required: [true, "El stock es obligatorio"],
        min: [0, "El stock debe ser mayor o igual a 0"]
    },
    category: {
        type: String,
        required: [true, "La categoría es obligatoria"],
        enum: {
            values: ["vegano", "vegetariano"],
            message: "La categoría debe ser 'vegano' o 'vegetariano'"
        },
    },
    thumbnail: {
        type: String
    }
})

productSchema.plugin(mongoosePaginate)

export const productsModel = mongoose.model(productsCollection, productSchema)