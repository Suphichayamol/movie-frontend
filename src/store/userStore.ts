import { makeAutoObservable } from "mobx"

class UserStore {

role = "MANAGER"
isLoggedIn = false

constructor(){
    makeAutoObservable(this)
}

login(role:string){
    this.role = role
    this.isLoggedIn = true
}

logout(){
    this.isLoggedIn = false
    this.role = ""
}

setRole(role:string){
    this.role = role
}

}

export const userStore = new UserStore()