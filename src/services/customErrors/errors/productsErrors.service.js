export const addProductError = (product) => {
    return `        
        Todos los campos son obligatorios:

        * Título: debe ser un texto. Se recibió: '${product.title}'
        * Descripción: debe ser una lista. Se recibió: '${product.description}'
        * Código: debe ser único y un texto (alfanumérico). Se recibió: '${product.code}'
        * Precio: debe ser un número mayor o igual a 0. Se recibió: '${product.price}'
        * Stock: debe ser un número mayor o igual a 0. Se recibió: '${product.stock}'
        * Categoría: debe ser un texto, las opciones son 'vegano' o 'vegetariano'. Se recibió: '${product.category}'
    `
}

export const updateProductError = (product) => {
    return `
        Los campos a actualizar deben ser válidos:

        Título: debe ser un texto. Se recibió: "${product.title}"
        Descripción: debe ser una lista. Se recibió: "${product.description}"
        Código: debe ser único y un texto (alfanumérico). Se recibió: "${product.code}"
        Precio: debe ser un número mayor o igual a 0. Se recibió: "${product.price}"
        Stock: debe ser un número mayor o igual a 0. Se recibió: "${product.stock}"
        Categoría: debe ser un texto, las opciones son "vegano" o "vegetariano". Se recibió: "${product.category}"
    `
}

export const mockingProductsError = () => {
    return `Ocurrió un error al crear los productos con faker`
}