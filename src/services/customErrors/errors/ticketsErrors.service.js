export const purchaseCartError = (ticket) => {
    return `
        Ocurrió un error al crear el ticket de compra
        
        * El código debe ser un texto alfanumérico único. Se recibió: '${ticket.code}'
        * El precio total es obligatorio y debe ser un número. Se recibió: '${ticket.amount}'
        * El dato del comprador es obligatorio. Se recibió: '${ticket.purchaser}'
        * El carrito no puede estar vacío
    `
}