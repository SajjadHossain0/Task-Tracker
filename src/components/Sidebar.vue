<template>
  <aside :class="['sidebar', collapsed ? 'collapsed' : '']">
    <router-link to="/" class="item" :class="{ active: $route.path === '/' }">
      <Home class="icon"/>
      <span v-if="!collapsed">Dashboard</span>
    </router-link>

    <router-link to="/users" class="item" :class="{ active: $route.path === '/users' }">
      <UsersRound class="icon"/>
      <span v-if="!collapsed">Users</span>
    </router-link>

    <router-link to="/projects" class="item" :class="{ active: $route.path === '/projects' }">
      <FolderKanban class="icon"/>
      <span v-if="!collapsed">Projects</span>
    </router-link>

    <router-link to="/tasks" class="item" :class="{ active: $route.path === '/tasks' }">
      <ListTodo class="icon"/>
      <span v-if="!collapsed">Tasks</span>
    </router-link>
  </aside>
</template>

<script setup>
import { Home, UsersRound, FolderKanban, ListTodo } from "lucide-vue-next";
import { useRoute } from "vue-router";

defineProps({ collapsed: Boolean });

const route = useRoute();
</script>

<style>
.sidebar {
  width: 220px;
  background: #3ca077;
  color: white;
  height: 100vh;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 60px;
}

.item {
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s;
}

.item:hover {
  background: #2d7758;
}

/* Active link style */
.item.active {
  background: #2d7758;
  font-weight: 600;
  border-left: 4px solid #36a06c;
}

.icon {
  width: 20px;
  height: 20px;
}
</style>
