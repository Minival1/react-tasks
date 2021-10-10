export const routes = {
    common: {
        url: "/common",
        access: "admin" || "user",
    },
    admin: {
        url: "/admin",
        access: "admin",
    },
    login: {
        url: "/login",
        access: null,
    },
    user: {
        url: "/user",
        access: "user",
    },
}
