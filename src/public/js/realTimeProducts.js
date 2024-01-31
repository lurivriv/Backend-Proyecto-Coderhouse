const cardProductsContainer = document.getElementById("card-products-container")
const userSessionRole = cardProductsContainer.getAttribute("data-user-role")
const userSessionId = cardProductsContainer.getAttribute("data-user-id")

const socketClient = io({
    auth: {
        user: {
            role: userSessionRole,
            _id: userSessionId
        }
    }
})

// Obtener productos
socketClient.on("productsArray", (data) => {
    const { productsData, userSessionRole, userSessionId } = data

    if (productsData.length > 0) {
        if (userSessionRole === "premium") {
            cardProductsContainer.innerHTML = `
                <h1 class="title-category">TUS PRODUCTOS</h1>
                <div>
                    <div class="item-list">
            `
        } else {
            cardProductsContainer.innerHTML = `
                <h1 class="title-category">TODOS LOS PRODUCTOS</h1>
                <div>
                    <div class="item-list">
            `
        }

        productsData.forEach((product) => {
            let cardProduct = `
                <div class="card-list">
                    <a href="/products/${product._id}">
                        <div class="card">
            `

            if (product.thumbnail) {
                cardProduct += `
                    <img class="card-img-top" src="${product.imageBuffer || "/assets/products/img/" + product.thumbnail}" alt="${product.title}">
                `
            }

            cardProduct += `
                        <div class="card-body row justify-content-evenly pb-2">
                            <h5 class="card-title mb-3">${product.title}</h5>
                            <p class="col-auto text-card-list">$${product.price}</p>
                            <p class="col-auto text-card-list category-card" data-category="${product.category}">
                                ${product.category}
                            </p>
                            <div class="d-block mt-3">
                                <p class="col-auto text-card-list product-info-card-list"><b>Stock: </b>${product.stock}</p>
                                <p class="col-auto text-card-list product-info-card-list"><b>Código: </b>${product.code}</p>
                                <p class="col-auto text-card-list product-info-card-list"><b>Propietario: </b>${product.owner}</p>
                            </div>
                        </div>
                    </div>
                </a>
                <button class="btn-update-product mx-1 mb-2 mb-md-0"
                        data-product-id="${product._id}" 
                        data-product-title="${product.title}" 
                        data-product-description="${product.description}" 
                        data-product-code="${product.code}" 
                        data-product-price="${product.price}" 
                        data-product-stock="${product.stock}" 
                        data-product-category="${product.category}" 
                        data-product-thumbnail="${product.thumbnail}">
                    Actualizar
                </button>
                <button class="btn-delete-product mx-1 mb-2 mb-md-3" data-product-id="${product._id}" data-product-title="${product.title}" data-product-owner="${product.owner}">Eliminar</button>
            `

            cardProductsContainer.querySelector(".item-list").innerHTML += cardProduct
        })

        cardProductsContainer.innerHTML += `</div></div></div>`
        
        // Eliminar productos
        const deleteProductBtn = document.querySelectorAll(".btn-delete-product")
        const addProductForm = document.getElementById("addProductForm")
        const userId = addProductForm.getAttribute("data-user-id")
        const userRole = addProductForm.getAttribute("data-user-role")

        deleteProductBtn.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const productId = e.target.getAttribute("data-product-id")
                const productTitle = e.target.getAttribute("data-product-title")
                const productOwner = e.target.getAttribute("data-product-owner")

                if ((userRole === "premium" && productOwner.toString() === userId.toString()) || userRole === "admin") {
                    const toast = Toastify({
                        text: "¿Querés eliminar este producto? <button id='accept-toast-btn'>Aceptar</button> <button id='cancel-toast-btn'>Cancelar</button>",
                        duration: 9999999999999,
                        gravity: "center",
                        position: "center",
                        className: "custom-toast",
                        escapeMarkup: false,
                        onToastClose: () => onCancel()
                    }).showToast()

                    const acceptBtn = document.getElementById("accept-toast-btn")
                    const cancelBtn = document.getElementById("cancel-toast-btn")
                
                    // Agregar eventos a los botones
                    acceptBtn.addEventListener("click", () => {
                        socketClient.emit("deleteProduct", { productId, productTitle, productOwner, userId, userRole })
                        toast.hideToast()
                    })
                
                    cancelBtn.addEventListener("click", () => {
                        toast.hideToast()
                    })
                } else {
                    Toastify({
                        text: `No tenés permisos para eliminar este producto`,
                        duration: 2000,
                        close: false,
                        position: "right",
                        gravity: "bottom",
                        className: "custom-toast"
                    }).showToast()
                }
            })
        })

        // Condicional de clases según la categoría del producto (para estilos)
        const categoryInfo = document.querySelectorAll("[data-category]")

        categoryInfo.forEach((cat) => {
            const category = cat.getAttribute("data-category")
            
            if (category === "vegetariano") {
                cat.classList.add("vegetarian-category-card")
            } else if (category === "vegano") {
                cat.classList.add("vegan-category-card")
            }
        })
    } else {
        if (userSessionRole === "premium") {
            cardProductsContainer.innerHTML = `
                <h1 class="title-category">TUS PRODUCTOS</h1>
                <h2 class="title-category">No tenés productos creados :(</h2>
            `
        } else {
            cardProductsContainer.innerHTML = `
                <h1 class="title-category">TODOS LOS PRODUCTOS</h1>
                <h2 class="title-category">No hay productos :(</h2>
            `
        }
    }
})

// Agregar productos
const addProductForm = document.getElementById("addProductForm")
const userId = addProductForm.getAttribute("data-user-id")

addProductForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(addProductForm)
    const jsonData = {}

    for (const [key, value] of formData.entries()) {
        jsonData[key] = key === "description" ? value.split(",").map((item) => item.trim()) : value
    }

    const reader = new FileReader()

    reader.onload = () => {
        jsonData.price = parseInt(jsonData.price)
        jsonData.stock = parseInt(jsonData.stock)
        jsonData.imageName = jsonData.thumbnail.name
        jsonData.imageBuffer = reader.result
        jsonData.owner = userId

        socketClient.emit("addProduct", jsonData)
    }

    const file = formData.get("thumbnail")
    reader.readAsDataURL(file)

    addProductForm.reset()
})

// Actualizar productos
const formAddProductContainer = document.querySelector(".form-add-product-container")
const updateProductFormContainer = document.getElementById("update-product-form-container")
const updateProductTitle = document.querySelector(".title-category")

cardProductsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-update-product")) {
        const productInfo = {
            _id: e.target.getAttribute("data-product-id"),
            title: e.target.getAttribute("data-product-title"),
            description: e.target.getAttribute("data-product-description"),
            code: e.target.getAttribute("data-product-code"),
            price: e.target.getAttribute("data-product-price"),
            stock: e.target.getAttribute("data-product-stock"),
            category: e.target.getAttribute("data-product-category"),
            thumbnail: e.target.getAttribute("data-product-thumbnail")
        }

        formAddProductContainer.style.display = "none"
        cardProductsContainer.style.display = "none"
        updateProductTitle.textContent = "ACTUALIZAR PRODUCTO"
        updateProductFormContainer.classList.remove("d-none")
        updateProductFormContainer.classList.add("d-block")

        document.getElementById("update-product-form").querySelector("[name=title]").value = productInfo.title
        document.getElementById("update-product-form").querySelector("[name=description]").value = productInfo.description
        document.getElementById("update-product-form").querySelector("[name=code]").value = productInfo.code
        document.getElementById("update-product-form").querySelector("[name=price]").value = productInfo.price
        document.getElementById("update-product-form").querySelector("[name=stock]").value = productInfo.stock
        document.getElementById("update-product-form").querySelector("[name=category]").value = productInfo.category
        
        // Actualizar y guardar cambios
        const updateProductForm = document.getElementById("update-product-form")
        const productId = productInfo._id

        updateProductForm.addEventListener("submit", async (e) => {
            try {
                e.preventDefault()

                const formData = new FormData(updateProductForm)
            
                const response = await fetch(`/api/products/${productId}`, {
                    method: "PUT",
                    body: formData
                })
            
                if (response.ok) {
                    location.reload()
                } else {
                    throw new Error("Error al actualizar la información del producto")
                }
            } catch (error) {
                throw error
            }
        })
    }
})