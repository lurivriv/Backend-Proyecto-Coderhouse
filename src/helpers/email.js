import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import { transporter } from "../config/emailMailing.js"
import { logger } from "./logger.js"

export const generateEmailToken = (email, expireTime) => {
    const token = jwt.sign({ email }, config.gmail.tokenEmail, { expiresIn: expireTime })
    return token
}

export const sendChangePasswordEmail = async (req, userEmail, token) => {
    const domain = `${req.protocol}://${req.get('host')}`
    const link = `${domain}/reset-password?token=${token}`

    try {
        await transporter.sendMail({
            from: "Sabores verdes Uruguay",
            to: userEmail,
            subject: "Restablecer contraseña - Sabores verdes",
            html: `
                <div>
                    <h2>¡Hola!</h2>
                    <p>Para restablecer la contraseña de tu cuenta en Sabores verdes hacé click en el siguiente link:</p>
                    <a href="${link}">
                        <button>
                            Restablecer contraseña
                        </button>
                    </a>
                </div>
            `
        })
    } catch (error) {
        logger.error(`Ocurrió un error al enviar el email: ${error}`)
    }
}

export const verifyEmailToken = async (token) => {
    try {
        const info = jwt.verify(token, config.gmail.tokenEmail)
        return info.email
    } catch (error) {
        logger.error(error)
        return null
    }
}

export const sendDeleteUserEmail = async (req, userEmail) => {
    const domain = `${req.protocol}://${req.get('host')}`
    const link = `${domain}/signup`

    try {
        await transporter.sendMail({
            from: "Sabores verdes Uruguay",
            to: userEmail,
            subject: "Cuenta eliminada - Sabores verdes",
            html: `
                <div>
                    <h2>¡Hola!</h2>
                    <p>Tu cuenta en Sabores verdes ha sido eliminada. Podés volver a registrarte en nuestro sitio:</p>
                    <a href="${link}">
                        <button>
                            Registrarme nuevamente
                        </button>
                    </a>
                </div>
            `
        })
    } catch (error) {
        logger.error(`Ocurrió un error al enviar el email: ${error}`)
    }
}

export const sendDeleteInactiveUsersEmail = async (req, userEmail) => {
    const domain = `${req.protocol}://${req.get('host')}`
    const link = `${domain}/signup`

    try {
        await transporter.sendMail({
            from: "Sabores verdes Uruguay",
            to: userEmail,
            subject: "Cuenta eliminada por inactividad - Sabores verdes",
            html: `
                <div>
                    <h2>¡Hola!</h2>
                    <p>Tu cuenta en Sabores verdes ha sido eliminada debido a inactividad. Podés volver a registrarte en nuestro sitio:</p>
                    <a href="${link}">
                        <button>
                            Registrarme nuevamente
                        </button>
                    </a>
                </div>
            `
        })
    } catch (error) {
        logger.error(`Ocurrió un error al enviar el email: ${error}`)
    }
}

export const sendDeleteProductEmail = async (userEmail, productTitle) => {
    try{
        await transporter.sendMail({
            from: "Sabores verdes Uruguay",
            to: userEmail,
            subject: "Tu producto fue eliminado - Sabores verdes",
            html: `
                <div>
                    <h2>¡Hola!</h2>
                    <p>Te informamos que tu producto "${productTitle}" ha sido eliminado de Sabores Verdes :(</p>
                </div>
            `
        })
    } catch (error) {
        logger.error(`Ocurrió un error al enviar el email: ${error}`)
    }
}