<template>
  <nav class="navbar">
    <!-- Toggle Sidebar Button -->
    <button class="toggle-btn" @click="handleSidebarToggle">
      <component :is="sidebarOpen ? PanelRightClose : PanelRightOpen" class="w-6 h-6"/>
    </button>

    <div class="title">Riggcorp Task Tracker</div>
  
<div class="right-section" ref="avatarSection">
  <!-- Notification -->
  <div class="notification-wrapper" @click.stop="toggleNotification">
    <BellRing class="bell-icon" />

    <!-- Badge -->
    <span v-if="unreadCount()" class="badge">
      {{ unreadCount() }}
    </span>

    <!-- Dropdown -->
    <transition name="fade-slide">
      <div
        v-if="notificationOpen"
        class="notification-dropdown"
      >
        <div
          v-for="item in notifications"
          :key="item.id"
          class="notification-item"
          :class="{ read: item.read }"
          @click="markAsRead(item)"
        >
          {{ item.text }}
        </div>

        <div
          v-if="notifications.length === 0"
          class="empty"
        >
          No notifications
        </div>
      </div>
    </transition>
  </div>

  <!-- Avatar -->
  <div class="avatar-wrapper" @click.stop="toggleMenu">
    <img
      src="https://i.pravatar.cc/40"
      class="avatar"
    />

    <transition name="fade-slide">
      <div v-if="menuOpen" class="dropdown">
        <div class="dropdown-item">
          Profile
        </div>
        <div class="dropdown-item logout-item" @click="handleLogout">
  Logout
</div>

      </div>
    </transition>
  </div>
</div>


  </nav>
</template>

<script setup>

import { BellRing } from 'lucide-vue-next';
import { ref, onMounted, onBeforeUnmount, defineEmits } from 'vue';
import { UserRound, LogOut, PanelRightClose, PanelRightOpen } from "lucide-vue-next";
import { useRouter } from 'vue-router';



const notificationOpen = ref(false);
const notifications = ref([
  { id: 1, text: "New task assigned", read: false },
  { id: 2, text: "Project deadline updated", read: false },
  { id: 3, text: "Comment added to task", read: false },
  { id: 4, text: "Weekly report ready", read: false },
]);


const emit = defineEmits(['toggleSidebar']);

const menuOpen = ref(false);
const avatarSection = ref(null);
const sidebarOpen = ref(false);

const router = useRouter();

//unreadCount//
const unreadCount = () =>
 notifications.value.filter(n => !n.read).length

//notification//
function toggleNotification() {
  notificationOpen.value = !notificationOpen.value;
  menuOpen.value = false; // profile dropdown close
}

function markAsRead(item) {
  item.read = true;
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
  notificationOpen.value = false;
}

function handleClickOutside(event) {
  if (
    avatarSection.value &&
    !avatarSection.value.contains(event.target)
  ) {
    menuOpen.value = false;
    notificationOpen.value = false;
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
  // 1️⃣ Remove token
  localStorage.removeItem("token")

  // 2️⃣ Close dropdown
  menuOpen.value = false

  // 3️⃣ Redirect to login
  router.push("/login")
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
  z-index: 99999;
}

/* Badge */
.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 50%;
}

/* Notification*/

.notification {
  display: flex;
  align-items: center;
  cursor: pointer;
}

/* Notification Dropdown */
.notification-dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  width: 240px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  z-index: 100000;
  padding: 6px 0;
}

.notification-item {
  padding: 10px 14px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}

.notification-item:hover {
  background: #f1f5f9;
}

/* Bell */
.notification-wrapper {
  position: relative;
  cursor: pointer;
}


.notification-item.read {
  color: #9ca3af;
}

/* Animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}



/* bell-icon*/
.bell-icon {
  width: 20px;
  height: 20px;
  color: white;
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
  gap: 22px;
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
