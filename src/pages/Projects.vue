<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Plus, FolderKanban, X, MoreVertical } from "lucide-vue-next";
import { useRouter } from "vue-router";

import {
  getProjects,
  createProject as createProjectApi,
  updateProject,
  deleteProject
} from "../services/projectApi";

const router = useRouter();

// State
const projects = ref([]);
const newProject = ref({ name: "", description: "" });
const activeProject = ref(null);
const showModal = ref(false);
const showViewModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const openMenuId = ref(null);

// Search
const searchQuery = ref("");
const filteredProjects = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  return projects.value.filter(
    p =>
      (p.name ?? "").toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q)
  );
});

// Load Projects
async function loadProjects() {
  try {
    const res = await getProjects();
    projects.value = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Failed to load projects", err);
    projects.value = [];
  }
}

// CRUD
async function createProject() {
  if (!newProject.value.name.trim()) return;
  try {
    const created = await createProjectApi(newProject.value);
    projects.value.push(created);
    newProject.value = { name: "", description: "" };
    showModal.value = false;
  } catch (err) {
    console.error("Failed to create project", err);
  }
}

function openProject(id) {
  router.push(`/projects/${id}`);
}

function openViewModalFunc(project) {
  activeProject.value = project;
  openMenuId.value = null;
  showViewModal.value = true;
}

function openEditModalFunc(project) {
  activeProject.value = { ...project };
  openMenuId.value = null;
  showEditModal.value = true;
}

async function saveEditProject() {
  try {
    const updated = await updateProject(activeProject.value.id, activeProject.value);
    const index = projects.value.findIndex(p => p.id === activeProject.value.id);
    if (index !== -1) projects.value[index] = updated;
    showEditModal.value = false;
  } catch (err) {
    console.error("Failed to update project", err);
  }
}

function openDeleteModalFunc(project) {
  activeProject.value = project;
  openMenuId.value = null;
  showDeleteModal.value = true;
}

async function confirmDeleteProject() {
  try {
    await deleteProject(activeProject.value.id);
    projects.value = projects.value.filter(p => p.id !== activeProject.value.id);
    showDeleteModal.value = false;
  } catch (err) {
    console.error("Failed to delete project", err);
  }
}

// Dropdown
function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

// Click outside to close
function handleClickOutside(event) {
  const dropdowns = document.querySelectorAll('.dropdown');
  let clickedInside = false;
  dropdowns.forEach(d => {
    if (d.contains(event.target)) clickedInside = true;
  });
  if (!clickedInside) openMenuId.value = null;
}

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
  loadProjects();
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>

<template>
<div class="page">
  <!-- HEADER -->
  <div class="header">
    <h1>Projects</h1>
    <div class="header-right">
      <input v-model="searchQuery" type="text" placeholder="Search projects..." class="search-input"/>
      <button class="btn" @click="showModal = true">
        <Plus class="icon"/> Create New Project
      </button>
    </div>
  </div>

  <!-- ADD PROJECT MODAL -->
  <div v-if="showModal" class="modal-bg" @click.self="showModal = false">
    <div class="modal">
      <div class="modal-header">
        <h2>Create Project</h2>
        <button class="close-btn" @click="showModal = false"><X class="icon"/></button>
      </div>
      <input v-model="newProject.name" placeholder="Project Name" class="input"/>
      <textarea v-model="newProject.description" placeholder="Project Description" class="textarea"></textarea>
      <button class="btn full" @click="createProject">Create</button>
    </div>
  </div>

  <!-- PROJECT CARDS -->
  <div class="card-grid">
    <div class="card" v-for="p in filteredProjects" :key="p.id">
      <div class="card-left" @click="openProject(p.id)">
        <FolderKanban class="icon-big"/>
        <div class="info">
          <h3>{{ p.name }}</h3>
          <p>{{ p.description }}</p>
        </div>
      </div>

      <!-- THREE DOTS -->
      <div class="card-right">
        <button class="dots-btn" @click.stop="toggleMenu(p.id)">
          <MoreVertical/>
        </button>
        <div class="dropdown" :class="{ show: openMenuId === p.id }" @click.stop>
          <div @click="openViewModalFunc(p)">View</div>
          <div @click="openEditModalFunc(p)">Edit</div>
          <div class="danger" @click="openDeleteModalFunc(p)">Delete</div>
        </div>
      </div>
    </div>
  </div>

  <!-- VIEW MODAL -->
  <div v-if="showViewModal && activeProject" class="modal-bg" @click.self="showViewModal = false">
    <div class="modal">
      <h2>{{ activeProject.name }}</h2>
      <p>{{ activeProject.description }}</p>
      <button class="btn full" @click="showViewModal = false">Close</button>
    </div>
  </div>

  <!-- EDIT MODAL -->
  <div v-if="showEditModal && activeProject" class="modal-bg" @click.self="showEditModal = false">
    <div class="modal">
      <div class="modal-header">
        <h2>Edit Project</h2>
        <button class="close-btn" @click="showEditModal = false"><X class="icon"/></button>
      </div>
      <input v-model="activeProject.name" placeholder="Project Name" class="input"/>
      <textarea v-model="activeProject.description" placeholder="Project Description" class="textarea"></textarea>
      <button class="btn full" @click="saveEditProject">Save Changes</button>
    </div>
  </div>

  <!-- DELETE MODAL -->
  <div v-if="showDeleteModal && activeProject" class="modal-bg" @click.self="showDeleteModal = false">
    <div class="modal">
      <h2>Are you sure?</h2>
      <p>Do you really want to delete "{{ activeProject.name }}"?</p>
      <div style="display:flex; gap:10px; justify-content:center; margin-top:20px;">
        <button class="btn" @click="confirmDeleteProject">Yes, Delete</button>
        <button class="btn" @click="showDeleteModal = false">Cancel</button>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.page { padding: 20px; }
.header { display:flex; 
  justify-content:space-between;
  align-items:center;
  margin-bottom:25px; 
  gap:15px; }
.header-right { display:flex; 
  align-items:center; 
  gap:10px; }
.search-input { padding:10px; 
  border-radius:6px; 
  border:1px solid #ddd; 
  font-size:14px; }
.btn { background:#3ca077;
   color:white; 
   padding:10px 16px; 
   border:none; 
   border-radius:6px; 
   cursor:pointer; 
   display:flex; 
   gap:6px; }
.card-grid { display:grid; 
  grid-template-columns:repeat(auto-fit, minmax(260px,1fr)); 
  gap:20px; 
  max-height:500px; 
  overflow-y:auto; 
  padding:5px; }
.card { background:white; 
  padding:20px; 
  border-radius:12px; 
  box-shadow:0 3px 10px rgba(0,0,0,0.08); 
  display:flex; 
  justify-content:space-between; 
  align-items:center; 
  position:relative; }
.card-left { display:flex; 
  align-items:center; 
  gap:15px; 
  cursor:pointer; }
.icon-big { 
   width:40px;
   height:40px; 
   color:#3ca077; }
.card-right { 
  position:relative; 
  display:flex; 
  justify-content:flex-end; 
  align-items:center; 
  z-index:10; }
.dots-btn { 
  background:transparent; 
  border:none; 
  cursor:pointer; 
  padding:4px; 
  z-index:20; }
.dropdown { 
  position:absolute; 
  top:100%; 
  right:0; 
  background:white; 
  border-radius:6px; 
  box-shadow:0 6px 20px rgba(0,0,0,0.15); 
  width:140px; 
  z-index:50; 
  opacity:0; 
  visibility:hidden; 
  transform:translateY(-10px); 
  transition:all 0.2s ease; }
.dropdown.show { 
  opacity:1; 
  visibility:visible; 
  transform:translateY(0); }
.dropdown div { 
  padding:8px 12px; 
  cursor:pointer; 
  font-size:14px; }
.dropdown div:hover { 
  background:#f3f4f6; }
.dropdown .danger { color:#ef4444; }
.modal-bg { 
  position:fixed; 
  inset:0; 
  background:rgba(0,0,0,0.4); 
  display:flex; 
  justify-content:center; 
  align-items:center; 
  z-index:100; 
  overflow-y:auto; 
  padding:20px; }
.modal { 
  background:white; 
  padding:25px; 
  width:360px; 
  max-width:90%; 
  border-radius:10px; 
  max-height:90vh; 
  overflow-y:auto; }
.modal-header { 
  display:flex; 
  justify-content:space-between; 
  align-items:center; 
  padding:15px 20px; 
  border-bottom:1px solid #eee; }
.input, .textarea { 
  width:100%; 
  padding:10px; 
  border:1px solid #ddd; 
  margin:10px 0; 
  border-radius:6px; 
  box-sizing:border-box; }
.full { width:100%; }
</style>
