import dotenv from "dotenv"

dotenv.config()

export const config = {
    server: {
        port: process.env.PORT,
        secretSession: process.env.SECRET_SESSION
    },
    mongo: {
        url: process.env.MONGO_URL
    },
    github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackUrl: process.env.GITHUB_CALLBACK_URL
    },
    adminInfo: {
        adminEmail: process.env.ADMIN_EMAIL,
        adminPassword: process.env.ADMIN_PASSWORD
    }
}