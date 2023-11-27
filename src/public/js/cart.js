// Emitir evento cartUpdated
const cartUpdatedEvent = () => {
    document.dispatchEvent(new Event("cartUpdated"))
}

// Actualizar cantidad de los productos en el carrito
const updateProductQuantityInCartBtn = document.querySelectorAll(".update-product-quantity-in-cart")

updateProductQuantityInCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        try {
            const cartId = e.currentTarget.getAttribute("data-cart-id")
            const productId = e.currentTarget.getAttribute("data-product-id")
            const productPrice = parseFloat(e.currentTarget.getAttribute("data-product-price"))

            const quantityElement = e.currentTarget.parentElement.querySelector(".quantity-product-in-cart")
            let currentQuantity = parseInt(quantityElement.innerText)

            if (e.currentTarget.innerText === "+") {
                currentQuantity++
            } else {
                currentQuantity = Math.max(1, currentQuantity - 1)
            }

            quantityElement.innerText = currentQuantity

            // Actualizar precios
            const subtotalPriceElement = e.currentTarget.parentElement.parentElement.querySelector(".subtotal-price-element")
            const totalPriceElement = document.querySelector(".total-price-element")

            const currentSubtotalPrice = currentQuantity * productPrice
            subtotalPriceElement.innerText = `$${currentSubtotalPrice}`

            const updatedSubtotalPrices = document.querySelectorAll(".subtotal-price-element")
            const newTotalPrice = Array.from(updatedSubtotalPrices).reduce((acc, elem) => acc + parseFloat(elem.innerText.replace("$", "")), 0)
            totalPriceElement.innerText = `TOTAL: $${newTotalPrice}`

            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newQuantity: currentQuantity })
            })

            if (response.ok) {
                cartUpdatedEvent()
            } else {
                throw new Error("Error al actualizar la cantidad del producto en el carrito")
            }
        } catch (error) {
            console.error(error)
        }
    })
})

// Eliminar un producto del carrito
const deleteProductInCartBtn = document.querySelectorAll(".delete-product-in-cart")

deleteProductInCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        try {
            const cartId = e.currentTarget.getAttribute("data-cart-id")
            const productId = e.currentTarget.getAttribute("data-product-id")
            const productTitle = e.currentTarget.getAttribute("data-product-title")

            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: "DELETE"
            })

            if (response.ok) {
                localStorage.setItem("deletedProductInCart", JSON.stringify({ productTitle }))

                location.reload()
            } else {
                throw new Error("Error al eliminar el producto del carrito")
            }
        } catch (error) {
            throw error
        }
    })
})

// Recuperar producto eliminado del local storage para Toastify
window.addEventListener("load", () => {
    const deletedProductInCart = JSON.parse(localStorage.getItem("deletedProductInCart"))

    if (deletedProductInCart) {
        Toastify({
            text: `Se eliminó "${deletedProductInCart.productTitle}" del carrito`,
            duration: 2000,
            close: false,
            position: "right",
            gravity: "bottom",
            className: "custom-toast",
        }).showToast()

        localStorage.removeItem("deletedProductInCart")
    }
})

// Eliminar todos los productos de un carrito
const deleteAllProductsInCartBtn = document.querySelectorAll(".delete-all-products-in-cart")

deleteAllProductsInCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        try {
            const cartId = e.currentTarget.getAttribute("data-cart-id")

            const response = await fetch(`/api/carts/${cartId}`, {
                method: "DELETE"
            })
            
            if (response.ok) {
                localStorage.setItem("deletedAllProductsInCart", JSON.stringify({}))

                location.reload()
            } else {
                throw new Error("Error al vaciar el carrito")
            }
        } catch (error) {
            throw error
        }
    })
})

// Recuperar productos eliminados del local storage para Toastify
window.addEventListener("load", () => {
    const deletedAllProductsInCart = JSON.parse(localStorage.getItem("deletedAllProductsInCart"))

    if (deletedAllProductsInCart) {
        Toastify({
            text: `Se vació el carrito`,
            duration: 2000,
            close: false,
            position: "right",
            gravity: "bottom",
            className: "custom-toast",
        }).showToast()

        localStorage.removeItem("deletedAllProductsInCart")
    }
})

// Finalizar compra
const finishPurchaseBtn = document.querySelectorAll(".finish-purchase")

finishPurchaseBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        try {
            const cartId = e.currentTarget.getAttribute("data-cart-id")

            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: "POST"
            })

            if (response.ok) {
                const result = await response.json()

                if (result.message) {
                    localStorage.setItem("messagePurchase", result.message)
                }
                
                if (result.error) {
                    localStorage.setItem("errorPurchase", result.error)
                }

                location.reload()
            } else {
                throw new Error("Error al finalizar la compra")
            }
        } catch (error) {
            throw error
        }
    })
})

// Recuperar message y error del local storage
window.addEventListener("load", () => {
    const messagePurchase = localStorage.getItem("messagePurchase")
    const errorPurchase = localStorage.getItem("errorPurchase")

    if (messagePurchase) {
        const message = document.createElement("p")
        message.className = "mb-sm-3 mb-0 text-center"
        message.innerHTML = messagePurchase
        document.querySelector(".message-session").appendChild(message)

        localStorage.removeItem("messagePurchase")
    }

    if (errorPurchase) {
        const error = document.createElement("p")
        error.className = "mb-sm-3 mb-0 text-center"
        error.innerHTML = errorPurchase
        document.querySelector(".error-session").appendChild(error)

        localStorage.removeItem("errorPurchase")
    }
})