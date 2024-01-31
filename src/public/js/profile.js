document.addEventListener("DOMContentLoaded", async () => {
    try {
        const profileContainer = document.querySelector(".profile-container")
        const editProfileBtn = document.getElementById("edit-profile-btn")
        const editProfileFormContainer = document.querySelector(".edit-profile-form-container")
        const userId = editProfileBtn.getAttribute("data-user-id")

        // Botón para editar perfil
        editProfileBtn.addEventListener("click", () => {
            profileContainer.classList.add("d-none")
            editProfileFormContainer.classList.remove("d-none")
            editProfileFormContainer.classList.add("d-block", "d-lg-flex", "justify-content-center", "align-items-center")
        })
    
        // Formulario
        const editProfileForm = document.getElementById("edit-profile-form")

        editProfileForm.addEventListener("submit", async (e) => {
            try {
                e.preventDefault()

                const formData = new FormData(editProfileForm)

                const response = await fetch(`/api/users/${userId}`, {
                    method: "PUT",
                    body: formData
                })

                if (response.ok) {
                    location.reload()
                } else {
                    throw new Error("Error al actualizar los datos del perfil")
                }
            } catch (error) {
                throw error
            }
        })

        // Subir documentos
        const uploadDocumentsForm = document.getElementById("upload-documents-form")

        uploadDocumentsForm.addEventListener("submit", async (e) => {
            try {
                e.preventDefault()

                const formData = new FormData(uploadDocumentsForm)

                const response = await fetch(`/api/users/${userId}/documents`, {
                    method: "POST",
                    body: formData
                })

                if (response.ok) {
                    location.reload()
                } else {
                    throw new Error("Error al subir los documentos")
                }
            } catch (error) {
                throw error
            }
        })
    } catch (error) {
        throw error
    }

    // Eliminar usuario
    const deleteAccountBtn = document.querySelector(".btn-delete-account")

    deleteAccountBtn.addEventListener("click", async (e) => {
        try {
            const userId = e.currentTarget.getAttribute("data-user-id")
            
            const response = await fetch(`/api/users/${userId}`, {
                method: "DELETE"
            })

            if (response.ok) {
                location.reload()
            } else {
                throw new Error("Error al eliminar tu cuenta")
            }
        } catch (error) {
            throw error
        }
    })
})