export class GetUserInfoDto {
    constructor(userInfo) {
        this._id = userInfo._id
        this.avatar = userInfo.avatar
        this.full_name = userInfo.full_name
        this.email = userInfo.email
        this.age = userInfo.age
        this.role = userInfo.role
        this.cart = userInfo.cart

        if (userInfo.github_user) {
            this.github_username = userInfo.github_username
        }
    }
}