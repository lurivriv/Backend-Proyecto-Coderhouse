export class GetUserInfoDto {
    constructor(userInfo) {
        this.full_name = userInfo.full_name
        this.role = userInfo.role
        this.cart = userInfo.cart

        if (!userInfo.github_user) {
            this.email = userInfo.email
            this.age = userInfo.age
        }

        if (userInfo.github_user) {
            this.github_username = userInfo.github_username
        }
    }
}