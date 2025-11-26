<template>
  <nav class="navbar">
    <!-- Toggle Sidebar Button -->
    <button class="toggle-btn" @click="handleSidebarToggle">
      <component :is="sidebarOpen ? PanelRightClose : PanelRightOpen" class="w-6 h-6"/>
    </button>

    <div class="title">Riggcorp Task Tracker</div>

    <!-- Profile & Dropdown -->
    <div class="right-section" ref="avatarSection" @click="toggleMenu">
      <img src="https://i.pravatar.cc/40" alt="avatar" class="avatar"/>

      <div v-if="menuOpen" class="dropdown">
        <div class="dropdown-item" @click="handleProfileClick">
          <UserRound class="icon"/>
          <span>Profile</span>
        </div>
        <div class="dropdown-item logout-item" @click="handleLogout">
          <LogOut class="icon"/>
          <span>Logout</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineEmits } from 'vue';
import { UserRound, LogOut, PanelRightClose, PanelRightOpen } from "lucide-vue-next";
import { useRouter } from 'vue-router';

const emit = defineEmits(['toggleSidebar']);

const menuOpen = ref(false);
const avatarSection = ref(null);
const sidebarOpen = ref(false);

const router = useRouter();

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function handleClickOutside(event) {
  if (menuOpen.value && avatarSection.value && !avatarSection.value.contains(event.target)) {
    menuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

function handleProfileClick() {
  menuOpen.value = false;
  router.push('/profile');
}

function handleLogout() {
  menuOpen.value = false;
  alert("Logged out!");
}

// Toggle sidebar icon + emit event to parent
function handleSidebarToggle() {
  sidebarOpen.value = !sidebarOpen.value;
  emit('toggleSidebar');
}
</script>

<style>
/* Navbar fixed at top */
.navbar {
  height: 40px;
  background: #3ca077;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  margin-right: 15px;
  display: flex;
  align-items: center;
}

.title {
  font-size: 20px;
  font-weight: 600;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.right-section {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-right: 20px;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 50px;
  background: #ffffff;
  border-radius: 6px;
  padding: 8px 0;
  width: 130px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 50;
}

.dropdown-item {
  padding: 10px 15px;
  cursor: pointer;
  color: #3ca077;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-item:hover {
  background: #eef7ff;
}

.icon {
  width: 18px;
  height: 18px;
}

.logout-item {
  color: #ed5353;
}

/* Push content down so it doesn't hide under navbar */
.layout, .content {
  padding-top: 60px; /* same as navbar height */
}
</style>
