<template>
  <div class="app-container">
    <!-- Fixed Navbar -->
    <Navbar @toggleSidebar="toggleSidebar" />

    <div class="layout">
      <!-- Fixed Sidebar -->
      <Sidebar :collapsed="isCollapsed" />

      <!-- Main scrollable content -->
      <main class="content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";

const isCollapsed = ref(false);

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden; /* prevent body scroll, scroll only content */
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Layout below navbar */
.layout {
  display: flex;
  flex: 1;
  //margin-top: 10px;
  height: calc(100vh - 60px);
}

/* Sidebar fixed on left */
.sidebar {
  position: fixed;
  top: 40px; /* below navbar */
  left: 0;
  bottom: 0;
  width: 220px;
  background: #3ca077;
  color: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: width 0.3s;
}

.sidebar.collapsed {
  width: 60px;
}

/* Scrollable main content */
.content {
  margin-left: 220px; /* same as sidebar width */
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  transition: margin-left 0.3s;
  background: #f4f5f7;
}

.sidebar.collapsed + .content {
  margin-left: 60px; /* adjust when sidebar collapsed */
}
</style>
