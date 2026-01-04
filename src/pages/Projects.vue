<script setup>
import { ref, computed } from "vue";
import { Plus, FolderKanban } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { X } from "lucide-vue-next"
import { MoreVertical } from "lucide-vue-next";



const router = useRouter();

const showModal = ref(false);

const newProject = ref({
  name: "",
  description: ""
});

const projects = ref([
  { id: 1, name: "Website Redesign", description: "UI update & bug fixes" },
  { id: 2, name: "Mobile App", description: "Android + iOS App" },
]);

// Search
const searchQuery = ref("");
const filteredProjects = computed(() => {
  return projects.value.filter(p =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function createProject() {
  if (!newProject.value.name.trim()) return;

  const id = Date.now();
  projects.value.push({
    id,
    name: newProject.value.name,
    description: newProject.value.description
  });

  newProject.value = { name: "", description: "" };
  showModal.value = false;
}

function openProject(id) {
  router.push(`/projects/${id}`);
}



const openMenuId = ref(null);

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function viewProject(id) {
  openMenuId.value = null;
  router.push(`/projects/${id}`);
}

function editProject(project) {
  openMenuId.value = null;
  alert("Edit: " + project.name);
}

function deleteProject(id) {
  openMenuId.value = null;
  projects.value = projects.value.filter(p => p.id !== id);
}

</script>

<template>
  <div class="page">
    <!-- HEADER -->
    <div class="header">
      <h1>Projects</h1>
      <div class="header-right">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects..."
            class="search-input"
        />
        <button class="btn" @click="showModal = true">
          <Plus class="icon" /> Create New Project
        </button>
      </div>
    </div>

    <!-- ADD PROJECT MODAL -->
<div v-if="showModal" class="modal-bg" @click.self="showModal = false">
  <div class="modal">
    <div class="modal-header">
      <h2>Create Project</h2>
      <button class="close-btn" @click="showModal = false">
        <X class="icon" />
      </button>
    </div>

    <input
      v-model="newProject.name"
      placeholder="Project Name"
      class="input"
    />

    <textarea
      v-model="newProject.description"
      placeholder="Project Description"
      class="textarea"
    ></textarea>

    <button class="btn full" @click="createProject">
      Create
    </button>
  </div>
</div>


    <!-- PROJECT CARDS -->
    <div class="card-grid">
    <div class="card" v-for="p in filteredProjects" :key="p.id">
  
  <!-- LEFT CONTENT -->
  <div class="card-left" @click="openProject(p.id)">
    <FolderKanban class="icon-big" />
    <div class="info">
      <h3>{{ p.name }}</h3>
      <p>{{ p.description }}</p>
    </div>
  </div>

<!-- RIGHT THREE DOTS -->
<div class="card-right">
  <button class="dots-btn" @click.stop="toggleMenu(p.id, $event)">
    <MoreVertical />
  </button>

  <div v-if="openMenuId === p.id" class="dropdown" :style="dropdownStyle">
    <div @click="viewProject(p.id)">View</div>
    <div @click="editProject(p)">Edit</div>
    <div class="danger" @click="deleteProject(p.id)">Delete</div>
  </div>
</div>

</div>
</div>
  </div>
  
</template>

<style scoped>
  h2{
    text-align: center;
  }
.page {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 15px;
}
.header h1 {
  margin: 0;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.search-input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 14px;
}
.btn {
  background: #3ca077;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  gap: 6px;
  text-align: right;
  justify-items: right;
}
button{
  position: relative;
  right: 0;
  margin-left: auto;
}
.icon {
  width: 18px;
  height: 18px;
}
/*.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 5px;
  padding-left: 5px;
}*/

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  max-height: 500px;
  overflow-y: auto;
  padding: 5px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: default;
  transition: 0.3s;
  position: relative;
}
.info h3{
  margin: 0;
  font-size: 16px;

}
.card-left{
  display:flex ;
  align-items: center;
  gap: 15px;
  cursor: pointer;
}
.card-right{
  position: relative;
}
.dots-btn{
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.card:hover {
  transform: translateY(-4px);
}
.icon-big {
  width: 40px;
  height: 40px;
  color: #3ca077;
}
/*.modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 25px;
  width: 360px;
  border-radius: 10px;
}
*/

.modal-bg {
  position: fixed;
  inset: 0; /* top, right, bottom, left = 0 */
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100; /* make sure above everything */
  overflow-y: auto;
}
.modal {
  background: white;
  padding: 25px;
  width: 360px;
  max-width: 90%;
  border-radius: 10px;
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

.input, .textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  margin: 10px 0;
  border-radius: 6px;
  box-sizing: border-box;
}
.full {
  width: 100%;
}
.empty-state {
  text-align: center;
  color: #888;
  padding: 20px 20px;
}

/* DROPDOWN MENU */
.dropdown {
  position: absolute; /* card er relative parent er upor */
  top: 100%;          /* button er niche */
  right: 0;           /* right aligned */
  background: white;
  border-radius: 6px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  width: 140px;
  z-index: 50;
}

.dropdown div {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown div:hover {
  background: #f3f4f6;
}

.dropdown .danger {
  color: #ef4444;
}
</style>
