import {ROLE} from "./roles"

export const routes = {
    "common-page": {
        url: "/common-page",
        name: "Common",
        roles: [ROLE.admin, ROLE.user]
    },
    "admin-page": {
        url: "/admin-page",
        name: "Admin",
        roles: [ROLE.admin]
    },
    "user-page": {
        url: "/user-page",
        name: "User",
        roles: [ROLE.user]
    },
    "login-page": {
        url: "/login-page",
        name: "Login",
        roles: [ROLE.admin, ROLE.user]
    },
}
