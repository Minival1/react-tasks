import {User} from "../interfaces/User"
import { makeAutoObservable } from "mobx"

class Auth {
    isAuth = false
    user = {}

    constructor() {
        makeAutoObservable(this)
    }

    login(user: User) {
        this.user = {...user}
        this.isAuth = true
        localStorage.setItem("user", JSON.stringify({...user}))
    }

    logout() {
        this.isAuth = false
        this.user = {}
        localStorage.clear()
    }
}

export default new Auth()
