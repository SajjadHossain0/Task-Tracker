<script setup>

import {ref, computed} from "vue";
import {X, MoreVertical} from "lucide-vue-next";

//Dropdown//
 const openDropdownId = ref(null);
const dropdownPosition = ref({ top: 0, left: 0 });

function toggleDropdown(userId, event) {
  if (openDropdownId.value === userId) {
    openDropdownId.value = null;
    return;
  }

  const rect = event.currentTarget.getBoundingClientRect();
  const dropdownHeight = 250; // max dropdown height
  const dropdownWidth = 180;
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Vertical position
  let top = rect.bottom + 6;
  if (top + dropdownHeight > viewportHeight) {
    top = rect.top - dropdownHeight - 6; // show above button if overflow
  }

  // Horizontal position
  let left = rect.left;
  if (left + dropdownWidth > viewportWidth) {
    left = viewportWidth - dropdownWidth - 10; // fit to viewport
  }

  dropdownPosition.value = { top, left };
  openDropdownId.value = userId;
}




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

// handleclick and onmount//

function handleClickOutside(event) {
  if (!event.target.closest(".dropdown") &&
      !event.target.closest(".dropdown-wrapper")) {
    openDropdownId.value = null;
  }
}

import { onMounted, onBeforeUnmount } from "vue";

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});



//Ctions//

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
    <header class="page-header">
 <h1>User Management</h1>

    <!-- Search -->
    <input
        v-model="searchQuery"
        type="text"
        placeholder="Search users..."
        class="search-input"
    />
    </header>
  

    <!-- Users Table -->
    <div class="table-wrapper">
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
              <button @click="toggleDropdown(user.id, $event )">
                <MoreVertical class="w-5 h-5"/>
              </button>
              <div v-if="openDropdownId === user.id" class="dropdown" :style="{
                top: dropdownPosition.top + 'px',
                left: dropdownPosition.left + 'px'
              }">
                <ul>
                  <li @click="openView(user); openDropdownId=null">View</li>
                  <li @click="openEdit(user); openDropdownId=null">Edit</li>
                  <li @click="openDelete(user); openDropdownId=null">Delete</li>
                  <li @click="updateRole(user, 'User'); openDropdownId=null">Make User</li>
                  <li @click="updateRole(user, 'Admin'); openDropdownId=null">Make Admin</li>
                  <li @click="updateRole(user, 'Project Manager'); openDropdownId=null">Make Project Manager</li>
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
  padding: 0px;
  min-height: 100vh;
  color: #333;
}
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between; /* left & right */
  align-items: center;
  padding: 15px 30px ;
  background:#ffffff;
  border-bottom: 1px solid #ddd;

}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin:0;
}

/* Search */
.search-input {
  width: 260px;
  display: flex;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e0;
  /*width: 100%;
  max-width: 300px;
  margin-bottom: 16px;
  outline: none;*/
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #3ca077;
  box-shadow: 0 0 5px rgba(60, 160, 119, 0.4);
}
/* table-wrapper*/

.table-wrapper {
  max-height: 250px ;/* header + pagination বাদ */
  overflow-y: auto;

}


/* Table */
.users-table {
 
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.users-table thead th {
  max-height: 250px;
  top: 0;
  background: #ffffff;
  z-index: 10;
}

/*.users-table tbody tr {
  height: 44px;   
}*/


th, td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
  line-height: 1.4;
}

tbody tr:hover {
  background-color: #f1f5f9;
}

/* Remove dropdown hover color */
.dropdown ul li:hover {
  background-color: transparent;
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
/*.dropdown-wrapper {
  height: calc(100vh - 140px);
  overflow: auto;
}*/

.dropdown-wrapper button {
  border: none;
  background:transparent;
  padding: 4px;
  cursor: pointer;
}

.dropdown-wrapper button:hover {
  background-color: transparent;
}

.table-wrapper {
  max-height: 400px; /* header + pagination adjust */
  overflow-y: auto;
  margin-bottom: 20px;
}

/* Table */
.users-table thead th {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
}

/* Dropdown */
.dropdown {
  max-height: 250px;
  overflow-y: auto; /* scroll if options exceed */
  position: absolute;
  width: 180px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 9999;
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
  background-color: transparent;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  background: #f4f6f8;
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
