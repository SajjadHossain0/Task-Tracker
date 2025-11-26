<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { Plus, FileText, X, UserRoundCheck  } from "lucide-vue-next";

const route = useRoute();
const projectId = route.params.id;

const showTaskModal = ref(false);

// Example users for dropdown
const users = ref(["John", "Alice", "Bob", "David"]);

const tasks = ref([
  { title: "UI Fix", description: "Fix navbar", assignee: "John", status: "To-Do" },
  { title: "API Integration", description: "Connect backend API", assignee: "Alice", status: "In-Progress" },
  { title: "Deploy", description: "Deploy to production", assignee: "Bob", status: "Done" },
  { title: "Bug Fix", description: "Fix login bug", assignee: "David", status: "To-Do" },
]);

const newTask = ref({
  title: "",
  description: "",
  file: null,
  assigned: "",
  status: "To-Do"
});

// Search & status filter
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

function addTask() {
  if (!newTask.value.assigned) return alert("Please assign a user!");
  tasks.value.push({ ...newTask.value });
  newTask.value = { title: "", description: "", file: null, assigned: "", status: "To-Do" };
  showTaskModal.value = false;
}
</script>

<template>
  <div class="page">
    <div class="header">
      <h1>Project #{{ projectId }}</h1>
      <div class="header-controls">
        <input v-model="searchQuery" placeholder="Search tasks..." class="search-input" />
        <select v-model="statusFilter" class="status-filter">
          <option value="">All Status</option>
          <option value="To-Do">To-Do</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Done">Done</option>
        </select>
        <button class="btn" @click="showTaskModal = true">
          <Plus class="icon" /> Add New Task
        </button>
      </div>
    </div>

    <!-- TASK LIST -->
    <div class="task-list">
      <div class="task-card" v-for="(t, i) in filteredTasks" :key="i">
        <!-- Main content -->
        <div class="task-info">
          <FileText class="task-icon" />
          <div>
            <h3>{{ t.title }}</h3>
            <p>{{ t.description }}</p>
            <small><UserRoundCheck /> {{ t.assignee }}</small>
          </div>
        </div>

        <!-- Status Select (top-right corner) -->
        <select v-model="t.status" class="status-select">
          <option value="To-Do">To-Do</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
    </div>

    <!-- ADD TASK MODAL remains unchanged -->
    <div v-if="showTaskModal" class="modal-bg" @click.self="showTaskModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>Add Task</h2>
          <button class="close-btn" @click="showTaskModal = false">
            <X class="icon" />
          </button>
        </div>

        <div class="modal-body">
          <div class="input-fields">
            <input v-model="newTask.title" placeholder="Title" class="input" />
            <textarea v-model="newTask.description" placeholder="Description" class="textarea"></textarea>
            <input type="file" class="input" />

            <select v-model="newTask.assigned" class="input">
              <option value="" disabled>Select User</option>
              <option v-for="(user, i) in users" :key="i" :value="user">{{ user }}</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn full" @click="addTask">
            <Plus class="icon" /> Add Task
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.header-controls .btn{
  flex-shrink: 0;
}
.search-input {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.status-filter {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  cursor: pointer;
}

.page {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}
.header h1 {
  margin: 0;
  line-height: 1.2;
}
.header .btn {
  margin: 0;
  padding: 8px 14px;
}
.btn {
  background: #3ca077;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  /* Scrollable */
  max-height: 500px;
  overflow-y: auto;
  padding-right: 5px;
}
.task-card {
  background: white;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  position: relative; /* for absolute select */
}
.task-info {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1; /* take available width */
}
.task-icon {
  width: 32px;
  height: 32px;
  color: #3ca077;
}

/* Status select on top-right corner */
.status-select {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #f9f9f9;
  cursor: pointer;
  width: 110px; /* small fixed width */
}

/* Modal */
.modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  width: 50%;
  height: 60%;
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
.modal-header h2 { margin: 0; }
.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
}
.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.input-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.input, .textarea, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  margin: 0;
}
.textarea { resize: none; min-height: 80px; }
.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
}
.full {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
</style>
