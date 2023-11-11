export class SessionsController {
    static redirectLogin = async (req, res) => {
        res.render("login", { message: "Usuario registrado :)"})
    }

    static failSignup = async (req, res) => {
        res.render("signup", { error: "Error al completar el registro" })
    }

    static redirectProducts = async (req, res) => {
        res.redirect("/products")
    }

    static failLogin = async (req, res) => {
        res.render("login", { error: "Error al iniciar sesión. Volve a ingresar los datos" })
    }

    static logout = async (req, res) => {
        try {
            req.session.destroy((err) => {
                if (err) {
                    return res.render("profile", { error: "Error al cerrar la sesión" })
                } else {
                    return res.redirect("/login")
                }
            })
        } catch (error) {
            res.render("logout", { error: "Error al cerrar la sesión" })
        }
    }
}