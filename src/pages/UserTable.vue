<script setup>
import {ref, computed} from "vue";
import {X, MoreVertical} from "lucide-vue-next";

// Example user data
const users = ref([
  {id: 1, name: "John Doe", email: "john@example.com", role: "User"},
  {id: 2, name: "Alice Smith", email: "alice@example.com", role: "Project Manager"},
  {id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Admin"},
  {id: 4, name: "David Lee", email: "david@example.com", role: "User"},
  {id: 5, name: "Eve Taylor", email: "eve@example.com", role: "User"},
]);

const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = 5;

const filteredUsers = computed(() =>
    users.value.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredUsers.value.slice(start, start + pageSize);
});

// Modals
const showViewModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedUser = ref(null);

// Actions
function openView(user) {
  selectedUser.value = {...user};
  showViewModal.value = true;
}

function openEdit(user) {
  selectedUser.value = {...user};
  showEditModal.value = true;
}

function openDelete(user) {
  selectedUser.value = {...user};
  showDeleteModal.value = true;
}

function updateRole(user, role) {
  const idx = users.value.findIndex((u) => u.id === user.id);
  if (idx !== -1) users.value[idx].role = role;
}

function saveEdit() {
  const idx = users.value.findIndex((u) => u.id === selectedUser.value.id);
  if (idx !== -1) users.value[idx] = {...selectedUser.value};
  showEditModal.value = false;
}

function deleteUser() {
  users.value = users.value.filter((u) => u.id !== selectedUser.value.id);
  showDeleteModal.value = false;
}
</script>

<template>
  <div class="page">
    <h1>User Management</h1>

    <!-- Search -->
    <input
        v-model="searchQuery"
        type="text"
        placeholder="Search users..."
        class="search-input"
    />

    <!-- Users Table -->
    <div class="overflow-x-auto">
      <table class="users-table">
        <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span :class="['role', user.role.replace(' ', '')]">{{ user.role }}</span>
          </td>
          <td class="relative">
            <!-- Action dropdown -->
            <div class="dropdown-wrapper">
              <button @click="user.showDropdown = !user.showDropdown">
                <MoreVertical class="w-5 h-5"/>
              </button>
              <div v-if="user.showDropdown" class="dropdown">
                <ul>
                  <li @click="openView(user); user.showDropdown=false">View</li>
                  <li @click="openEdit(user); user.showDropdown=false">Edit</li>
                  <li @click="openDelete(user); user.showDropdown=false">Delete</li>
                  <li @click="updateRole(user, 'User'); user.showDropdown=false">Make User</li>
                  <li @click="updateRole(user, 'Admin'); user.showDropdown=false">Make Admin</li>
                  <li @click="updateRole(user, 'Project Manager'); user.showDropdown=false">Make Project Manager</li>
                </ul>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button :disabled="currentPage===1" @click="currentPage--">Prev</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage===totalPages" @click="currentPage++">Next</button>
    </div>

    <!-- VIEW MODAL -->
    <div v-if="showViewModal" class="modal-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <h2>User Details</h2>
          <button @click="showViewModal=false">
            <X class="w-5 h-5"/>
          </button>
        </div>
        <div class="modal-body">
          <p><strong>Name:</strong> {{ selectedUser.name }}</p>
          <p><strong>Email:</strong> {{ selectedUser.email }}</p>
          <p><strong>Role:</strong> {{ selectedUser.role }}</p>
        </div>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <h2>Edit User</h2>
          <button @click="showEditModal=false">
            <X class="w-5 h-5"/>
          </button>
        </div>
        <div class="modal-body">
          <input v-model="selectedUser.name" placeholder="Name"/>
          <input v-model="selectedUser.email" placeholder="Email"/>
          <select v-model="selectedUser.role">
            <option>User</option>
            <option>Admin</option>
            <option>Project Manager</option>
          </select>
        </div>
        <div class="modal-footer">
          <button class="bg-green" @click="saveEdit">Save</button>
        </div>
      </div>
    </div>

    <!-- DELETE MODAL -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <h2>Delete User?</h2>
          <button @click="showDeleteModal=false">
            <X class="w-5 h-5"/>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>{{ selectedUser.name }}</strong>?</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal=false">Cancel</button>
          <button class="bg-red" @click="deleteUser">Delete</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.page {
  background-color: #f4f6f8;
  padding: 30px;
  min-height: 100vh;
  color: #333;
}

h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
}

/* Search */
.search-input {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e0;
  width: 100%;
  max-width: 300px;
  margin-bottom: 16px;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #3ca077;
  box-shadow: 0 0 5px rgba(60, 160, 119, 0.4);
}

/* Table */
.users-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

th, td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

tbody tr:hover {
  background-color: #f1f5f9;
}

/* Role badges */
.role {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

.role.User {
  background-color: #6b7280;
}

.role.Admin {
  background-color: #ef4444;
}

.role.ProjectManager {
  background-color: #3b82f6;
}

/* Dropdown */
.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown-wrapper button {
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  background: #fff;
  padding: 6px;
  cursor: pointer;
}

.dropdown-wrapper button:hover {
  background-color: #f3f4f6;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  width: 180px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 50;
}

.dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown ul li {
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.dropdown ul li:hover {
  background-color: #f3f4f6;
}

/* Pagination */
.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.pagination button {
  border: 1px solid #cbd5e0;
  padding: 6px 12px;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.pagination button:hover:not([disabled]) {
  background-color: #f3f4f6;
}

.pagination button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  font-weight: 600;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  z-index: 50;
}

.modal-box {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 420px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-body input, .modal-body select {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e0;
  outline: none;
  font-size: 14px;
}

.modal-body input:focus, .modal-body select:focus {
  border-color: #3ca077;
  box-shadow: 0 0 6px rgba(60, 160, 119, 0.3);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-footer .bg-green {
  background: #3ca077;
  color: #fff;
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.modal-footer .bg-green:hover {
  background: #36a06c;
}

.modal-footer .bg-red {
  background: #ef4444;
  color: #fff;
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.modal-footer .bg-red:hover {
  background: #dc2626;
}
</style>
