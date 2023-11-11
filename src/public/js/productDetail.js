// Agregar producto al carrito
const addToCartBtn = document.querySelectorAll(".btn-add-to-cart")

addToCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        const cartId = e.currentTarget.getAttribute("data-cart-id")
        const productId = e.currentTarget.getAttribute("data-product-id")
        const productTitle = e.currentTarget.getAttribute("data-product-title")

        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: "POST"
        }).then((response) => {
            if (response.status === 200) {
                alert(`"${productTitle}" AGREGADO AL CARRITO`)
            } else {
                throw new Error("Error al agregar el producto al carrito")
            }
        })
    })
})