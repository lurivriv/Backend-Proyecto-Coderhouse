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
}

export const verifyEmailToken = (token) => {
    try {
        const info = jwt.verify(token, config.gmail.tokenEmail)
        return info.email
    } catch (error) {
        logger.error(error)
        return null
    }
}