export const createCartError = () => {
    return `Ocurrió un error al crear el carrito en la base de datos`
}

export const addProductToCartError = (quantity) => {
    return `La cantidad debe ser un número mayor a 0. Se recibió: '${quantity}'`
}

export const updateProductsInCartError = (product) => {
    return `
        * La cantidad debe ser un número mayor a 0. Se recibió: '${product.quantity}'
        * El ID del producto debe existir. Se recibió: '${product.product}'
    `
}

export const updateProductQuantityInCartError = (quantity) => {
    return `La cantidad debe ser un número mayor a 0. Se recibió: '${quantity}'`
}