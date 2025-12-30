import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Projects from "../pages/Projects.vue";
import Tasks from "../pages/Tasks.vue";
import ProjectDetails from "@/pages/ProjectDetails.vue";
import UserTable from "@/pages/UserTable.vue";
import Profile from "@/pages/Profile.vue";
import Login from "@/pages/Login.vue";

const routes = [{
        path: "/login",
        component: Login,
        meta: { public: true }, // ✅ public
    },
    {
        path: "/",
        component: Home,
    },
    {
        path: "/users",
        component: UserTable,
    },
    {
        path: "/profile",
        component: Profile,
    },
    {
        path: "/projects",
        component: Projects,
    },
    {
        path: "/projects/:id",
        component: ProjectDetails,
    },
    {
        path: "/tasks",
        component: Tasks,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});




router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");

    // 🔐 If route is protected & no token
    if (!to.meta.public && !token) {
        next("/login");
    }
    // 🚫 Login page এ গেলে token থাকলে redirect
    else if (to.path === "/login" && token) {
        next("/");
    }
    // ✅ All good
    else {
        next();
    }
});

export default router;