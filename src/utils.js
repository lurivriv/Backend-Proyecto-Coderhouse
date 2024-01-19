import path from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcrypt"
import multer from "multer"

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
const checkUserValidFields = (user, isUpdate = false) => {
    const { first_name, last_name, email, age, password } = user

    if (!isUpdate) {
        if (!first_name || !last_name || !email || !age || !password) {
            return false
        }
    }

    return true
}

const profileMulterFilter = (req, file, cb) => {
    const isUpdate = req.method === "PUT"
    const user = isUpdate ? req.user : req.body
    
    if (!checkUserValidFields(user, isUpdate)) {
        cb(null, false)
    } else {
        cb(null, true)
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
const checkProductValidFields = (product, isUpdate = false) => {
    const { title, description, code, price, stock, category } = product

    if (!isUpdate) {
        if (!title || !description || !code || !price || !stock || !category) {
            return false
        }
    }

    return true
}

const productsMulterFilter = (req, file, cb) => {
    const isUpdate = req.method === "PUT"
    const product = isUpdate ? req.product : req.body
    
    if (!checkProductValidFields(product, isUpdate)) {
        cb(null, false)
    } else {
        cb(null, true)
    }
}

// Multer para imágenes de productos
const productsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "/public/assets/products/img"))
    },

    filename: (req, file, cb) => {
        const product = req.method === "PUT" ? req.product : req.body
        cb(null, `${product.code}-product-${file.originalname}`)
    }
})

const uploadProducts = multer({ storage: productsStorage, fileFilter: productsMulterFilter })

export { uploadProfile, uploadDocuments, uploadProducts }