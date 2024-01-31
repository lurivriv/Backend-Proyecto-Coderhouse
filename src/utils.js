import path from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcrypt"
import multer from "multer"
import { productsModel } from "./dao/mongo/models/products.model.js"

export const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Contraseñas
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync())
}

export const isValidPassword = (password, user) => {
    return bcrypt.compareSync(password, user.password)
}

// Multer
// Filtro para subir perfil de usuarios
const checkUserValidFields = async (req, user, isUpdate = false) => {
    try {
        const { usersModel } = await import("./dao/mongo/models/users.model.js")
        const { uid } = req.params
        const { first_name, last_name, email, age, password } = user
        
        if (!isUpdate) {
            if (!first_name || !last_name || !email || !age || !password) {
                return false
            }

            const existingEmail = await usersModel.findOne({ email })

            if (existingEmail) {
                return false
            }

            if (isNaN(age) || age < 0) {
                return false
            }
        }

        if (isUpdate) {
            const existingEmail = await usersModel.findOne({ email })
            const updatedUser = await usersModel.findById(uid)

            if (existingEmail && existingEmail._id.toString() !== updatedUser._id.toString()) {
                return false
            }

            if ((age && isNaN(age)) || age < 0) {
                return false
            }
        }

        return true
    } catch (error) {
        throw error
    }
}

const profileMulterFilter = async (req, file, cb) => {
    const isUpdate = req.method === "PUT"    
    let user 

    if (isUpdate || req.method === "POST") {
        user = req.body
    }

    try {
        if (!(await checkUserValidFields(req, user, isUpdate))) {
            cb(null, false)
            return
        }
        
        cb(null, true)
    } catch (error) {
        cb(error, false)
    }
}

// Multer para perfil de usuarios
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "/public/assets/users/img"))
    },

    filename: (req, file, cb) => {
        const user = req.method === "PUT" ? req.user : req.body
        cb(null, `${user.email}-profile-${file.originalname}`)
    }
})

const uploadProfile = multer({ storage: profileStorage, fileFilter: profileMulterFilter })

// Multer para documentos de usuarios
const documentsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "/public/assets/users/documents"))
    },

    filename: (req, file, cb) => {
        cb(null, `${req.user.email}-document-${file.originalname}`)
    }
})

const uploadDocuments = multer({ storage: documentsStorage })

// Filtro para subir imágenes de productos
const checkProductValidFields = async (req, product, isUpdate = false) => {
    try {
        const { pid } = req.params
        const { title, description, code, price, stock, category } = product

        if (!isUpdate) {
            if (!title || !description || !code || !price || !stock || !category) {
                return false
            }

            const existingCode = await productsModel.findOne({ code })

            if (existingCode) {
                return false
            }

            if (isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
                return false
            }

            if (category !== "vegano" && category !== "vegetariano") {
                return false
            }
        }

        if (isUpdate) {
            const existingCode = await productsModel.findOne({ code })
            const updatedProduct = await productsModel.findById(pid)

            if (existingCode && existingCode._id.toString() !== updatedProduct._id.toString()) {
                return false
            }

            if ((price && isNaN(price)) || (stock && isNaN(stock)) || price < 0 || stock < 0) {
                return false
            }

            if (category && category !== "vegano" && category !== "vegetariano") {
                return false
            }
        }

        return true
    } catch (error) {
        throw error
    }
}

const productsMulterFilter = async (req, file, cb) => {
    const isUpdate = req.method === "PUT"
    let product

    if (isUpdate || req.method === "POST") {
        product = req.body
    }

    try {
        if (!(await checkProductValidFields(req, product, isUpdate))) {
            cb(null, false)
            return
        } 

        cb(null, true)
    } catch (error) {
        cb(error, false)
    }
}

// Multer para imágenes de productos
const productsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "/public/assets/products/img"))
    },

    filename: async (req, file, cb) => {
        try {
            const { pid } = req.params
            let product

            if (req.method === "PUT" || req.method === "POST") {
                product = req.body
            }

            if (req.method === "PUT" && !product.code) {
                const existingProduct = await productsModel.findById(pid)
                
                if (existingProduct) {
                    product.code = existingProduct.code
                }
            }
            
            cb(null, `${product.code}-product-${file.originalname}`)
        } catch (error) {
            cb(error, false)
        }
    }
})

const uploadProducts = multer({ storage: productsStorage, fileFilter: productsMulterFilter })

export { uploadProfile, uploadDocuments, uploadProducts }