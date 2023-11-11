// Actualizar la cantidad de un producto en el carrito (NO ESTÁ LEYENDO CARTID)
const updateProductQuantityInCartBtn = document.querySelectorAll(".update-product-quantity-in-cart")

updateProductQuantityInCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        const cartId = e.currentTarget.getAttribute("data-cart-id")
        const productId = e.currentTarget.getAttribute("data-product-id")

        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: "PUT"
        })
    })
})

// Eliminar un producto del carrito (NO ESTÁ LEYENDO CARTID)
const deleteProductInCartBtn = document.querySelectorAll(".delete-product-in-cart")

deleteProductInCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        const cartId = e.currentTarget.getAttribute("data-cart-id")
        const productId = e.currentTarget.getAttribute("data-product-id")
        const productTitle = e.currentTarget.getAttribute("data-product-title")

        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: "DELETE"
        }).then((response) => {
            if (response.status === 200) {
                alert(`SE ELIMINÓ "${productTitle}" DEL CARRITO`)
            } else {
                throw new Error("Error al vaciar el carrito")
            }
        })
    })
})

// Eliminar todos los productos de un carrito
const deleteAllProductsInCartBtn = document.querySelectorAll(".delete-all-products-in-cart")

deleteAllProductsInCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        const cartId = e.currentTarget.getAttribute("data-cart-id")

        const response = await fetch(`/api/carts/${cartId}`, {
            method: "DELETE"
        }).then((response) => {
            if (response.status === 200) {
                alert("SE ELIMINARON TODOS LOS PRODUCTOS DEL CARRITO")
            } else {
                throw new Error("Error al vaciar el carrito")
            }
        })
    })
})