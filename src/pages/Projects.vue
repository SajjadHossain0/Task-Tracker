<script setup>
import { ref, computed } from "vue";
import { Plus, FolderKanban } from "lucide-vue-next";
import { useRouter } from "vue-router";

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

    <!-- PROJECT CARDS -->
    <div class="card-grid">
      <div class="card" v-for="p in filteredProjects" :key="p.id" @click="openProject(p.id)">
        <div class="info">
          <h3>{{ p.name }}</h3>
          <p>{{ p.description }}</p>
        </div>
        <FolderKanban class="icon-big" />
      </div>

      <div v-if="filteredProjects.length === 0" class="empty-state">
        No projects found.
      </div>
    </div>

    <!-- ADD PROJECT MODAL -->
    <div v-if="showModal" class="modal-bg" @click.self="showModal = false">
      <div class="modal">
        <h2>Create Project</h2>
        <input v-model="newProject.name" placeholder="Project Name" class="input" />
        <textarea v-model="newProject.description" placeholder="Project Description" class="textarea"></textarea>
        <button class="btn full" @click="createProject">Create</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  align-items: center;
  gap: 6px;
}
.icon {
  width: 18px;
  height: 18px;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 5px;
}
.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: 0.3s;
}
.card:hover {
  transform: translateY(-4px);
}
.icon-big {
  width: 40px;
  height: 40px;
  color: #3ca077;
}
.modal-bg {
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
.input, .textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  margin: 10px 0;
  border-radius: 6px;
}
.full {
  width: 100%;
}
.empty-state {
  text-align: center;
  color: #888;
  padding: 20px 0;
}
</style>
