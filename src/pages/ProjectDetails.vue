<script setup>
import { ref, computed, onMounted,onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { Plus, FileText, X, UserRoundCheck } from "lucide-vue-next";
import { getTasksByProject, createTask, getProjectById, updateTask,deleteTaskById } 
  from "@/services/taskApi";
import { getUsers, getUserById } from "@/services/users.js";


const users = ref([]);
const selectedUser = ref("");
const route = useRoute();
const projectId = route.params.id;
const project = ref(null);
const selectedFile = ref(null);

function handleFile(e) {
  selectedFile.value = e.target.files[0];
}

const showTaskModal = ref(false);
const tasks = ref([]);
const newTask = ref({
  title: "",
  description: "",
  assigned: "",
  status: "PENDING"
});

// filters
const searchQuery = ref("");
const statusFilter = ref("");

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const q = searchQuery.value.toLowerCase();
    const matchText =
      task.title.toLowerCase().includes(q) ||
      task.description.toLowerCase().includes(q) ||
     String(task.assignedUserId).includes(q);


    const matchStatus = statusFilter.value
      ? task.status === statusFilter.value
      : true;

    return matchText && matchStatus;
  });
});

// 🔥 LOAD TASKS BY PROJECT ID
async function loadTasks() {
  try {
    const data = await getTasksByProject(projectId);
    console.log("RAW TASK API DATA 👉", data);

    const mappedTasks = [];

    for (const t of data) {
    const assignedId =
  t.assignedUserId ??
  t.assignedTo ??              // 🔥 VERY IMPORTANT
  t.assignedUser?.id ??
  t.assigned_user_id ??        // safety
  null;

      const userName = await resolveUserName(assignedId);

      mappedTasks.push({
        id: t.id,
        title: t.title,
        description: t.description,
        assignedUserId: assignedId,
        assignedUserName: userName,
        status: t.status
      });
    }

    tasks.value = mappedTasks;
    console.log("Tasks with username 👉", tasks.value);

  } catch (err) {
    console.error("Failed to load project tasks", err);
  }
}


onMounted(async () => {
  await loadUsers();   
  await loadTasks();   
  await loadProject();
});


//loadProject//

async function loadProject() {
  try {
    project.value = await getProjectById(projectId);
  } catch (err) {
    console.error(err);
  }
}



async function addTask() {
  if (!newTask.value.title || !newTask.value.assigned) {
    alert("Please fill all required fields");
    return;
  }

  const formData = new FormData();

  const taskPayload = {
    title: newTask.value.title,
    description: newTask.value.description,
    status: newTask.value.status,        // PENDING / DONE
    assignedUserId: Number(newTask.value.assigned),
    projectId: Number(projectId),
  };
  console.log(taskPayload);

  // 🔥 MUST be JSON STRING
  formData.append(
  "task",
  new Blob([JSON.stringify(taskPayload)], {
    type: "application/json"
  })
); 
console.log(formData.get("task"))

  // 🔥 optional file
  if (selectedFile.value) {
    formData.append("file", selectedFile.value);
  }
const savedTask = await createTask(formData);

  try {
const assignedId =
  savedTask.assignedUserId ??
  savedTask.assignedUser?.id;

const userName = await resolveUserName(assignedId);

tasks.value.push({
  id: savedTask.id,
  title: savedTask.title,
  description: savedTask.description,
  assignedUserId: assignedId,
  assignedUserName: userName,
  status: savedTask.status,
});


    newTask.value = {
      title: "",
      description: "",
      assigned: "",
      status: "PENDING",
    };

    selectedFile.value = null;
    showTaskModal.value = false;
window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Task create failed");
  }
}

//fucntion loadUser//
async function loadUsers() {
  try {
    const data = await getUsers();
    console.log("Users Loaded 👉", data);
    users.value = data.map(u => ({
      id: u.id,
      name: u.name || u.fullName || u.username || "Unknown"
    }));
    console.log("Normalized Users 👉", users.value);
  } catch (err) {
    console.error("Failed to load users:", err.message);
  }
}



//getUserNameById//
function getUserNameById(userId) {
  const user = users.value.find(
    u => Number(u.id) === Number(userId)
  );
  return user ? user.name : "Unknown";
}
//resolve function//

async function resolveUserName(userId) {
  if (!userId) return "Unknown";

  // 🔥 already loaded?
  const existing = users.value.find(
    u => Number(u.id) === Number(userId)
  );
  if (existing) return existing.name;

  // 🔥 fetch from API
  try {
    const user = await getUserById(userId);

    const normalized = {
      id: user.id,
      name: user.name || user.username || "Unknown"
    };

    // 🔥 cache it (VERY IMPORTANT)
    users.value.push(normalized);

    return normalized.name;
  } catch (err) {
    console.error("User resolve failed:", err);
    return "Unknown";
  }
}

//activeMenu//

const activeMenu = ref(null);

function toggleMenu(taskId) {
  activeMenu.value = activeMenu.value === taskId ? null : taskId;
}

//deleteFunction//
async function deleteTask(task) {
  if (!confirm("Are you sure to delete?")) return;

  try {
    await deleteTaskById(task.id);
    tasks.value = tasks.value.filter(t => t.id !== task.id);
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
}

//viewfunction//
const showViewModal = ref(false);
const activeTask = ref(null);

function viewTask(task) {
  activeTask.value = task;
  showViewModal.value = true;
  activeMenu.value = null;
}
//EditFunction//
const showEditModal = ref(false);
const editTaskData = ref({});
function editTask(task) {
  if (!task.id) {
    alert("Cannot edit task: ID missing");
    console.error("Task id missing:", task);
    return;
  }

  editTaskData.value = {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    assignedUserId: task.assignedUserId || task.assigned || null,
    file: null, // optional new file
  };

  showEditModal.value = true;
  activeMenu.value = null;
  console.log("Editing task:", editTaskData.value);
}


//closeMenu//

function closeMenuOnClick(e) {
  if (!e.target.closest(".task-actions")) {
    activeMenu.value = null;
  }
}

onMounted(() => {
  window.addEventListener("click", closeMenuOnClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", closeMenuOnClick);
});

//edit fucntion//
async function saveEdit() {
  try {
    if (!editTaskData.value.id) return;

    const formData = new FormData();

    const payload = {
      title: editTaskData.value.title,
      description: editTaskData.value.description,
      status: editTaskData.value.status,
      assignedUserId: Number(editTaskData.value.assignedUserId), // 🔥 updated
      projectId: Number(projectId),
    };

    formData.append(
      "task",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    if (editTaskData.value.file) {
      formData.append("file", editTaskData.value.file);
    }

    // Call API
    const updated = await updateTask(editTaskData.value.id, formData);

    // 🔹 Resolve assigned username
    const userName = await resolveUserName(updated.assignedUserId);

    // 🔹 Update tasks array
    const index = tasks.value.findIndex(t => t.id === updated.id);
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        ...updated,
        assignedUserName: userName,
      };
    }

    // 🔹 Close modal & reset
    showEditModal.value = false;
    editTaskData.value = {
      id: null,
      title: "",
      description: "",
      status: "PENDING",
      assignedUserId: null,
      file: null,
    }; window.location.reload();
  } 
  catch (err) {
    console.error("Update failed:", err);
    alert("Update failed: " + err.message);
  }
}



// Add this near the top with other refs
const showEditUserModal = ref(false);
const editUserData = ref({
  id: null,
  name: "",
  username: "",
  password: "",
  role: "",
  position: ""
});

</script>


<template>
  <div class="page">
    <div class="header">
      <h1>Project #{{ projectId }}</h1>
      <div class="header-controls">
        <input v-model="searchQuery" placeholder="Search tasks..." class="search-input" />
        <select v-model="statusFilter" class="status-filter">
          <option value="">All Status</option>
          <option value="PENDING">PENDING</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
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
            <!-- <p>{{ t.description }}</p> -->
            <small>
  <UserRoundCheck />
  {{ t.assignedUserName || "Unknown" }}

</small>

          </div>
        </div>

        <!-- Status Select (top-right corner) [DONE, IN_PROGRESS, PENDING]-->
 <div class="task-actions">
  <button class="dot-btn" @click="toggleMenu(t.id)">⋮</button>

  <div v-if="activeMenu === t.id" class="dropdown">
    <div @click="viewTask(t)">View</div>
    <div @click="editTask(t)">Edit</div>
    <div class="danger" @click="deleteTask(t)">Delete</div>
  </div>
</div>


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
            <input type="file" class="input" @change="handleFile" />

            <select v-model="newTask.assigned" class="input">
  <option value="" disabled>Select User</option>
  <option 
    v-for="user in users" 
    :key="user.id" 
    :value="user.id"
  >
    {{ user.name }}
  </option>
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

<!-- showViewModal -->

<div v-if="showViewModal" class="modal-bg" @click.self="showViewModal=false">
  <div class="modal">
    <div class="modal-header">
      <h2>{{ activeTask.title }}</h2>
      <button class="close-btn" @click="showViewModal=false">
        <X />
      </button>
    </div>

    <div class="modal-body">
      <p><b>Description:</b></p>
      <p>{{ activeTask.description }}</p>

      <p><b>Assigned To:</b> {{ activeTask.assignedUserName }}</p>
      <p><b>Status:</b> {{ activeTask.status }}</p>
    </div>
  </div>
</div>

<!-- EDIT TASK MODAL -->
<div v-if="showEditModal" class="modal-bg" @click.self="showEditModal=false">
  <div class="modal">
    <div class="modal-header">
      <h2>Edit Task</h2>
      <button class="close-btn" @click="showEditModal=false"><X /></button>
    </div>

    <div class="modal-body">
      <input v-model="editTaskData.title" class="input" placeholder="Title" />
      <textarea v-model="editTaskData.description" class="textarea" placeholder="Description"></textarea>

      <select v-model="editTaskData.status" class="input">
        <option value="PENDING">PENDING</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="DONE">DONE</option>
      </select>

      <select v-model="editTaskData.assignedUserId" class="input">
  <option value="" disabled>Select User</option>
  <option 
    v-for="user in users" 
    :key="user.id" 
    :value="user.id"
  >
    {{ user.name }}
  </option>
</select>
      <label class="input">
        Upload File (optional)
        <input type="file" @change="e => editTaskData.file = e.target.files[0]" />
      </label>
    </div>

    <div class="modal-footer">
      <button class="btn full" @click="saveEdit">Save</button>
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 5px;
}
.task-card {
  background: white;
  padding: 16px;
  border-radius: 14px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.task-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1; /* take available width */
}

.task-info h3 {
  margin: 0;
  font-size: 16px;
}

.task-info p {
  margin: 4px 0;
  font-size: 13px;
  color: #555;
}

.task-info small {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #777;
  font-size: 12px;
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
  width: 500px;
  max-height: 80vh;
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
   overflow-y: auto;
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
  display: flex;
  margin-left: auto;
  color: #3ca077;
  text-align: right;
  right: 0;
  padding: 10px 10%;
  border-top: 1px solid #eee;
}
.full {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.task-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-label {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 20px;
  background: #f1f1f1;
  font-weight: 600;
}

.dot-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
}

.dropdown {
  position: absolute;
  top: 22px;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  overflow: hidden;
  z-index: 100;
  min-width: 140px;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown div {
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
}

.dropdown div:hover {
  background: #f5f5f5;
}

.dropdown .danger {
  color: #d9534f;
}

</style>
