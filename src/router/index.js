import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Projects from "../pages/Projects.vue";
import Tasks from "../pages/Tasks.vue";
import ProjectDetails from "@/pages/ProjectDetails.vue";
import UserTable from "@/pages/UserTable.vue";
import Profile from "@/pages/Profile.vue";


const routes = [
  { path: '/', component: Home },
  { path: '/users', component: UserTable },
  { path: '/profile', component: Profile },
  { path: '/projects', component: Projects },
  { path: '/projects/:id', component: ProjectDetails },
  { path: '/tasks', component: Tasks },
];


export default createRouter({
  history: createWebHistory(),
  routes,
});