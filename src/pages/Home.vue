<script setup>
import { FolderKanban, ClipboardList, Loader, CheckCircle } from "lucide-vue-next";

const stats = [
  { title: "Total Projects", value: 12, icon: FolderKanban },
  { title: "Total Tasks", value: 58, icon: ClipboardList },
  { title: "In Progress", value: 8, icon: Loader },
  { title: "Completed", value: 42, icon: CheckCircle }
];
</script>

<template>
  <div class="dashboard">
    <h1 class="heading">Dashboard</h1>
    <p class="subheading">Welcome back, User</p>

    <div class="cards">
      <div class="card" v-for="(item, i) in stats" :key="i">
        <div class="text-section">
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-value">{{ item.value }}</p>
        </div>
        <component :is="item.icon" class="icon" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}

.heading {
  font-size: 28px;
  color: #222;
  margin-bottom: 5px;
}

.subheading {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  transition: 0.3s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
}

.text-section .card-title {
  font-size: 15px;
  color: #555;
  margin: 0;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #222;
  margin-top: 4px;
}

.icon {
  width: 32px;
  height: 32px;
  color: #3ca077;
}
</style>
