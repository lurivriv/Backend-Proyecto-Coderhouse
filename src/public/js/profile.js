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
            editProfileFormContainer.classList.add("d-md-flex", "justify-content-center", "align-items-center")
        })
    
        // Formulario
        const editProfileForm = document.getElementById("edit-profile-form")

        editProfileForm.addEventListener("submit", async (e) => {
            e.preventDefault()

            const formData = new FormData(editProfileForm)

            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                body: formData,
            })

            if (response.ok) {
                const updatedUserInfo = await response.json()

                localStorage.setItem("editedInfoProfile", JSON.stringify(updatedUserInfo))
                updateProfileInfo(updatedUserInfo)

                profileContainer.classList.remove("d-none")
                editProfileFormContainer.classList.remove("d-md-flex", "justify-content-center", "align-items-center")
                editProfileFormContainer.classList.add("d-none")
            } else {
                throw new Error("Error al actualizar los datos del perfil")
            }
        })
    } catch (error) {
        throw error
    }
})

// Actualizar perfil en el DOM
const updateProfileInfo = (updatedUserInfo) => {
    const avatarProfile = document.querySelector(".avatar-profile")
    const fullNameProfile = document.querySelector(".full-name-profile")
    const emailProfile = document.querySelector(".email-profile")
    const ageProfile = document.querySelector(".age-profile")
    
    avatarProfile.src = `/assets/users/img/${updatedUserInfo.userInfoDto.avatar}`
    fullNameProfile.textContent = updatedUserInfo.userInfoDto.full_name
    emailProfile.textContent = updatedUserInfo.userInfoDto.email
    ageProfile.textContent = updatedUserInfo.userInfoDto.age
}

// Recuperar información actualizada del perfil del localStorage
window.addEventListener("load", () => {
    const editedInfoProfile = JSON.parse(localStorage.getItem("editedInfoProfile"))

    if (editedInfoProfile) {
        updateProfileInfo(editedInfoProfile)
        localStorage.removeItem("editedInfoProfile")
    }
})