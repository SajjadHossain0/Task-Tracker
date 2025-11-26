<script setup>
import { ref, computed } from "vue";
import { FileText, UserRoundCheck, X } from "lucide-vue-next";

// Example tasks
const tasks = ref([
  {
    title: "UI Fix",
    description: "Fix navbar",
    assignee: "John",
    status: "To-Do",
    file: "ui_fix.png"
  },
  {
    title: "API Integration",
    description: "Connect backend API",
    assignee: "Alice",
    status: "In-Progress",
    file: "api_doc.pdf"
  },
  {
    title: "Deploy",
    description: "Deploy to production",
    assignee: "Bob",
    status: "Done",
    file: null
  },
  {
    title: "Bug Fix",
    description: "Fix login bug",
    assignee: "David",
    status: "To-Do",
    file: "login_bug.png"
  },
]);

// Search & filter
const searchQuery = ref("");
const statusFilter = ref("");

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const matchesQuery =
        task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = statusFilter.value ? task.status === statusFilter.value : true;
    return matchesQuery && matchesStatus;
  });
});

// Modal logic
const showTaskModal = ref(false);
const selectedTask = ref(null);

function openTaskModal(task) {
  selectedTask.value = task;
  showTaskModal.value = true;
}

function closeTaskModal() {
  showTaskModal.value = false;
  selectedTask.value = null;
}
</script>

<template>
  <div class="task-page">
    <h1>All Tasks</h1>

    <!-- Search & Filter -->
    <div class="filter-bar">
      <input
          type="text"
          placeholder="Search by title, description, assignee..."
          v-model="searchQuery"
          class="search-input"
      />
      <select v-model="statusFilter" class="status-filter">
        <option value="">All Status</option>
        <option value="To-Do">To-Do</option>
        <option value="In-Progress">In-Progress</option>
        <option value="Done">Done</option>
      </select>
    </div>

    <!-- Task List -->
    <div class="task-list">
      <div
          v-for="(t, i) in filteredTasks"
          :key="i"
          class="task-card"
          @click="openTaskModal(t)"
      >
        <div class="task-info">
          <FileText class="task-icon" />
          <div>
            <h3>{{ t.title }}</h3>
            <p>{{ t.description }}</p>
            <small><UserRoundCheck /> {{ t.assignee }}</small>
          </div>
        </div>
        <span :class="['task-status', t.status.toLowerCase().replace(' ', '-') ]">{{ t.status }}</span>
      </div>

      <!-- Empty state -->
      <div v-if="filteredTasks.length === 0" class="empty-state">
        No tasks found.
      </div>
    </div>

    <!-- Task Details Modal -->
    <div v-if="showTaskModal" class="modal-bg" @click.self="closeTaskModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ selectedTask.title }}</h2>
          <button class="close-btn" @click="closeTaskModal">
            <X class="icon" />
          </button>
        </div>

        <div class="modal-body">
          <p><strong>Description:</strong></p>
          <p>{{ selectedTask.description }}</p>

          <p><strong>Assignee:</strong> {{ selectedTask.assignee }}</p>
          <p><strong>Status:</strong> {{ selectedTask.status }}</p>

          <div v-if="selectedTask.file" class="file-preview">
            <p><strong>File:</strong></p>
            <template v-if="selectedTask.file.endsWith('.png') || selectedTask.file.endsWith('.jpg') || selectedTask.file.endsWith('.jpeg')">
              <img :src="selectedTask.file" alt="Task File" />
            </template>
            <template v-else>
              <a :href="selectedTask.file" target="_blank">{{ selectedTask.file }}</a>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-page {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  margin-bottom: 20px;
}

.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 14px;
}

.status-filter {
  width: 150px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 14px;
  cursor: pointer;
}

/*.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}*/
.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  /* Scrollable */
  //max-height: 500px;
  //overflow-y: auto;
  //padding-right: 5px;
}


.task-card {
  background: white;
  padding: 15px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  position: relative;
  cursor: pointer;
}

.task-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.task-icon {
  width: 32px;
  height: 32px;
  color: #3ca077;
}

.task-status {
  font-weight: bold;
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 12px;
  text-align: center;
}

.task-status.to-do { background: #e0f0ff; color: #007bff; }
.task-status.in-progress { background: #fff4e0; color: #ff9800; }
.task-status.done { background: #e0ffe0; color: #28a745; }

.empty-state {
  text-align: center;
  color: #888;
  padding: 20px 0;
}

/* Modal */
.modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  width: 60%;
  max-width: 700px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.file-preview img {
  max-width: 100%;
  border-radius: 6px;
  margin-top: 10px;
}

.file-preview a {
  color: #007bff;
  text-decoration: underline;
}
</style>
