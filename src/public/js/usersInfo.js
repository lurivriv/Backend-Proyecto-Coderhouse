document.addEventListener("DOMContentLoaded", () => {
    const modifyRoleBtn = document.querySelectorAll(".btn-modify-rol")
    const deleteInactiveUsersBtn = document.querySelector(".btn-delete-inactive-users")
    const deleteUserBtn = document.querySelectorAll(".btn-delete-user")

    // Modificar rol
    modifyRoleBtn.forEach(async (btn) => {
        btn.addEventListener("click", async (e) => {
            try {
                const userId = e.currentTarget.getAttribute("data-user-id")
                const userFullName = e.currentTarget.getAttribute("data-user-full-name")
                const userRole = e.currentTarget.getAttribute("data-user-role")
                const userStatus = e.currentTarget.getAttribute("data-user-status")

                const response = await fetch(`/api/users/premium/${userId}`, {
                    method: "PUT"
                })

                if (response.ok) {
                    if (userStatus === "completo") {
                        if (userRole === "premium") {
                            localStorage.setItem("modifyRole", JSON.stringify({ userFullName, userRole: "usuario" }))
                        } else if (userRole === "usuario") {
                            localStorage.setItem("modifyRole", JSON.stringify({ userFullName, userRole: "premium" }))
                        }

                        location.reload()
                    } else if (userRole === "admin") {
                        Toastify({
                            text: `No se puede modificar el rol de este usuario`,
                            duration: 2000,
                            close: false,
                            position: "right",
                            gravity: "bottom",
                            className: "custom-toast"
                        }).showToast()
                    } else {
                        Toastify({
                            text: `El usuario '${userFullName}' no ha subido todos los documentos`,
                            duration: 2000,
                            close: false,
                            position: "right",
                            gravity: "bottom",
                            className: "custom-toast"
                        }).showToast()
                    }
                } else {
                    throw new Error(`Error al modificar el rol del usuario '${userFullName}'`)
                }
            } catch (error) {
                throw error
            }
        })
    })

    // Recuperar información del local storage al recargar la página
    window.addEventListener("load", () => {
        const modifyRole = JSON.parse(localStorage.getItem("modifyRole"))

        if (modifyRole) {
            Toastify({
                text: `El rol del usuario '${modifyRole.userFullName}' fue modificado a '${modifyRole.userRole}' con éxito`,
                duration: 2000,
                close: false,
                position: "right",
                gravity: "bottom",
                className: "custom-toast"
            }).showToast()

            localStorage.removeItem("modifyRole")
        }
    })

    // Eliminar usuario
    deleteUserBtn.forEach(async (btn) => {
        btn.addEventListener("click", async (e) => {
            try {
                const userId = e.currentTarget.getAttribute("data-user-id")
                const userFullName = e.currentTarget.getAttribute("data-user-full-name")

                const response = await fetch(`/api/users/${userId}`, {
                    method: "DELETE"
                })

                if (response.ok) {
                    localStorage.setItem("deletedUser", JSON.stringify({ userFullName }))

                    location.reload()
                } else {
                    throw new Error(`Error al eliminar el usuario '${userFullName}`)
                }
            } catch (error) {
                throw error
            }
        })
    })

    // Recuperar información del local storage al recargar la página
    window.addEventListener("load", () => {
        const deletedUser = JSON.parse(localStorage.getItem("deletedUser"))

        if (deletedUser) {
            Toastify({
                text: `El usuario '${deletedUser.userFullName}' fue eliminado`,
                duration: 2000,
                close: false,
                position: "right",
                gravity: "bottom",
                className: "custom-toast"
            }).showToast()

            localStorage.removeItem("deletedUser")
        }
    })

    // Eliminar usuarios inactivos
    let showToastAfterReload = false

    deleteInactiveUsersBtn.addEventListener("click", async () => {
        try {
            const response = await fetch(`/api/users`, {
                method: "DELETE"
            })

            if (response.ok) {
                showToastAfterReload = true
                localStorage.setItem("toastDeleteInactiveUsers", "true")

                location.reload()
            } else {
                throw new Error("Error al eliminar los usuarios inactivos")
            }
        } catch (error) {
            throw error
        }
    })

    // Recuperar información del local storage al recargar la página
    window.addEventListener("load", () => {
        const toastDeleteInactiveUsers = localStorage.getItem("toastDeleteInactiveUsers")

        if (toastDeleteInactiveUsers) {
            Toastify({
                text: "Los usuarios inactivos fueron eliminados",
                duration: 2000,
                close: false,
                position: "right",
                gravity: "bottom",
                className: "custom-toast"
            }).showToast()

            localStorage.removeItem("toastDeleteInactiveUsers")
        }
    })
})