import { ProductsService } from "../services/products.service.js"

export class ProductsController {
    static getProducts = async (req, res) => {
        try {
            const { limit = 8, page = 1, sort, category, stock } = req.query
    
            const query = {}
    
            const options = {
                limit,
                page,
                sort,
                lean: true
            }
    
            // Filtrar por categoría (http://localhost:8080/api/products?category=vegano)
            if (category) {
                query.category = category
            }
    
            // Filtrar por stock (http://localhost:8080/api/products?stock=0 || http://localhost:8080/api/products?stock=20)
            if (stock) {
                if (stock === "false" || stock == 0) {
                    query.stock = 0
                } else {
                    query.stock = stock
                }
            }
    
            // Ordenar por precio (http://localhost:8080/api/products?sort=desc || http://localhost:8080/api/products?sort=asc)
            if (sort) {
                if (sort === "asc") {
                    options.sort = { price: 1 }
                } else if (sort === "desc") {
                    options.sort = { price: -1 }
                }
            }
    
            const products = await ProductsService.getProducts(query, options)
            
            const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl
            
            const dataProducts = {
                status: "success",
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `${baseUrl.replace(`page=${products.page}`, `page=${products.prevPage}`)}` : null,
                nextLink: products.hasNextPage ? baseUrl.includes("page") ? baseUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : baseUrl.concat(`?page=${products.nextPage}`) : null,
            }
    
            res.status(201).json({ data: dataProducts })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static getProductById = async (req, res) => {
        try {
            const { pid } = req.params
            const product = await ProductsService.getProductById(pid)
            res.status(201).json({ data: product })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static addProduct = async (req, res) => {
        try {
            const productInfo = req.body
            const thumbnailFile = req.file ? req.file.filename : undefined
    
            productInfo.thumbnail = thumbnailFile
    
            const addedProduct = await ProductsService.addProduct(productInfo)
            res.status(201).json({ data: addedProduct })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static updateProduct = async (req, res) => {
        try {
            const { pid } = req.params
            const updateFields = req.body
            const thumbnailFile = req.file ? req.file.filename : undefined
    
            updateFields.thumbnail = thumbnailFile
    
            const updatedProduct = await ProductsService.updateProduct(pid, updateFields)
            res.status(201).json({ data: updatedProduct })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static deleteProduct = async (req, res) => {
        try {
            const { pid } = req.params
            const deletedProduct = await ProductsService.deleteProduct(pid)
            res.status(200).json({ data: deletedProduct })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}