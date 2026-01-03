<template>
  <transition name="fade">
    <div
      v-if="show"
      class="toast"
      :class="type"
    >
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String,
  type: {
    type: String, // success | error
    default: 'success'
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 16px;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  z-index: 9999;
}

.success {
  background-color: #22c55e; /* green */
}

.error {
  background-color: #ef4444; /* red */
}

/* animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
