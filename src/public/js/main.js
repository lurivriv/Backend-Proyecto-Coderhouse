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