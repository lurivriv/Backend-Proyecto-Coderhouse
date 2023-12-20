import { usersDao } from "../dao/index.js"

export class UsersService {
    static registerUser(signupForm) {
        return usersDao.registerUser(signupForm)
    }

    static loginUser(loginIdentifier, isGithubLogin = false) {
        return usersDao.loginUser(loginIdentifier, isGithubLogin)
    }

    static getUsers() {
        return usersDao.getUsers()
    }

    static getUserById(userId) {
        return usersDao.getUserById(userId)
    }

    static updateUser(userId, user) {
        return usersDao.updateUser(userId, user)
    }
}