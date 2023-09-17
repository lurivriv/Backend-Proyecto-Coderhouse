const socketClient = io()

// Obtener productos
const cardProductsContainer = document.getElementById("cardProductsContainer")

socketClient.on("productsArray", (productsData) => {
    if (productsData.length > 0) {
        cardProductsContainer.innerHTML = `
            <h1>MENÚ</h1>
        `

        productsData.forEach((product) => {
            let cardProduct = `<div>`

            if (product.thumbnail) {
                cardProduct += `
                    <img src="/assets/imgProducts/${product.thumbnail}" alt="${product.title}">
                `
            }

            cardProduct += `
                <h2>${product.title}</h2>
                <p>$${product.price}</p>
                <p>${product.category}</p>
                <p>Stock: ${product.stock}</p>
                <p>Estado: ${product.status}</p>
                <h3>Ingredientes</h3>
                <ul>
                    ${product.description.map((item) => `<li>${item}</li>`).join("")}
                </ul>
                <button class="deleteProductBtn" data-product-id="${product.id}">Eliminar</button>
            `
            
            cardProduct += `</div>`
            cardProductsContainer.innerHTML += cardProduct
        })

        // Eliminar productos
        const deleteProductBtn = document.querySelectorAll(".deleteProductBtn")

        deleteProductBtn.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const productId = e.target.getAttribute("data-product-id")
                if (confirm("¿Queres eliminar este producto?")) {
                    socketClient.emit("deleteProduct", parseInt(productId))
                }
            })
        })
    } else {
        cardProductsContainer.innerHTML = `
            <h1>NO HAY MENÚ DISPONIBLE :(</h1>
        `
    }
})

// Agregar productos
const addProductForm = document.getElementById("addProductForm")

addProductForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(addProductForm)
    const jsonData = {}

    for (const [key, value] of formData.entries()) {
        jsonData[key] = value
    }

    jsonData.description = jsonData.description.split(",").map((item) => item.trim())
    jsonData.price = parseFloat(jsonData.price)
    jsonData.stock = parseInt(jsonData.stock)
    jsonData.status = (formData.get("status") === "true")
    jsonData.thumbnail = ""
    
    socketClient.emit("addProduct", jsonData)
    addProductForm.reset()
})