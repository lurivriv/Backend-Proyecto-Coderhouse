export class CreateUserDto {
    constructor(userInfo) {
        this.full_name = !userInfo.github_user ? `${userInfo.first_name} ${userInfo.last_name}` : userInfo.github_name
        this.role = userInfo.role
        this.cart = userInfo.cart
        this.github_user = userInfo.github_user

        if (!userInfo.github_user) {
            this.first_name = userInfo.first_name
            this.last_name = userInfo.last_name
            this.email = userInfo.email
            this.age = userInfo.age
            this.password = userInfo.password

            // Para evitar errores con el unique de github_username
            this.github_username = `Registrado con email: ${userInfo.email}`
        } 

        if (userInfo.github_user) {
            this.github_username = userInfo.github_username

            // Para evitar errores con el unique de email
            this.email = `Registrado con GitHub: ${userInfo.github_username}`
        }
    }
}