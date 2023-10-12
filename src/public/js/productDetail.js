// Agregar producto al carrito
const addToCartBtn = document.querySelectorAll(".btn-add-to-cart")

addToCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        const cartId = "652793267676b6d069fc33e9" // Por el momento
        const productId = e.target.getAttribute("data-product-id")
        const productTitle = e.target.getAttribute("data-product-title")

        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: "POST"
        })
        
        if (response.status === 200) {
            alert(`"${productTitle}" AGREGADO AL CARRITO`)
        } else {
            throw new Error("Error al agregar el producto al carrito")
        }
    })
})