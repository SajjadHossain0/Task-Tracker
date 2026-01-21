<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { X, MoreVertical } from "lucide-vue-next";
import { getUsers, createUser, updateUser, deleteUser as deleteUserApi } from "@/services/users";

// Role mapping: backend vs frontend
const roleMap = {
  "User": "ROLE_USER",
  "Admin": "ROLE_ADMIN",
  "Project Manager": "ROLE_PROJECT_MANAGER"
};

const roleMapReverse = {
  "ROLE_USER": "User",
  "ROLE_ADMIN": "Admin",
  "ROLE_PROJECT_MANAGER": "Project Manager"
};

// Header reference
const headerRef = ref(null)
function getHeaderHeight() {
  return headerRef.value ? headerRef.value.offsetHeight : 80;
}

// Dropdown
const dropdownPosition = ref({ top: 0, left: 0 })
const openDropdownId = ref(null);
function toggleDropdown(userId, event) {
  if (openDropdownId.value === userId) {
    openDropdownId.value = null;
    return;
  }

  const rect = event.currentTarget.getBoundingClientRect();
  const dropdownHeight = 250;
  const dropdownWidth = 180;
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const HEADER_HEIGHT = getHeaderHeight();

  let top = rect.bottom + 6;
  const minTop = HEADER_HEIGHT + 12;
  if (top < minTop) top = minTop;
  if (top + dropdownHeight > viewportHeight) top = rect.top - dropdownHeight - 6;
  if (top < minTop) top = minTop;

  let left = rect.left;
  if (left + dropdownWidth > viewportWidth) left = viewportWidth - dropdownWidth - 10;

  dropdownPosition.value = { top, left }
  openDropdownId.value = userId
}

// Users
const users = ref([]);
async function loadUsers() {
  try {
    const res = await getUsers();
    let dataArray = [];
    if (Array.isArray(res)) dataArray = res;
    else if (Array.isArray(res.users)) dataArray = res.users;
    else if (Array.isArray(res.data)) dataArray = res.data;

    // Convert backend roles to frontend for display
    users.value = dataArray.map(u => ({
      ...u,
      role: u.role in roleMapReverse ? u.role : "ROLE_USER", // backend role
      displayRole: roleMapReverse[u.role] || "User"           // frontend display role
    }));
  } catch (err) {
    console.error("Load users error:", err);
    users.value = [];
  }
}

// Password
const showPassword = ref(false)
function togglePassword() { showPassword.value = !showPassword.value }
function regeneratePassword() { newUser.value.password = generatePassword() }

// Search & Pagination
const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = 5;

const filteredUsers = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  return users.value.filter(user => {
    return (
      (user.name && user.name.toLowerCase().includes(q)) ||
      (user.username && user.username.toLowerCase().includes(q)) ||
      (user.email && user.email.toLowerCase().includes(q)) ||
      (user.position && user.position.toLowerCase().includes(q)) ||
      (user.displayRole && user.displayRole.toLowerCase().includes(q))
    );
  });
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredUsers.value.slice(start, start + pageSize);
});
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize));

// Modals
const showViewModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showAddModal = ref(false)
const selectedUser = ref(null)

// Click outside dropdown
function handleClickOutside(event) {
  if (!event.target.closest(".dropdown") && !event.target.closest(".dropdown-wrapper")) {
    openDropdownId.value = null;
  }
}

onMounted(async () => {
  await loadUsers();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Actions
function openView(user) {
  selectedUser.value = { ...user, displayRole: roleMapReverse[user.role] || "User" }
  showViewModal.value = true
}

function openEdit(user) {
  selectedUser.value = {
    ...user,
    role: roleMapReverse[user.role] || "User" // for dropdown
  }
  showEditModal.value = true
}

function openDelete(user) {
  selectedUser.value = { ...user }
  showDeleteModal.value = true
}

// Confirm delete
async function confirmDeleteUser() {
  try {
    await deleteUserApi(selectedUser.value.id);
    await loadUsers();
    showDeleteModal.value = false;
  } catch (err) {
    console.error("Delete user error:", err);
  }
}

// Add user
const newUser = ref({
  name: '',
  username: '',
  password: '123456',
  position: '',
  role: 'User'
});

function generatePassword(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$_%&*';
  let pass = ''
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pass
}

function openAddUser() {
  newUser.value = { name: '', username: '', password: '123456', position: '', role: 'User' }
  showAddModal.value = true
}

async function addUser() {
  try {
    await createUser({
      name: newUser.value.name,
      username: newUser.value.username,
      password: newUser.value.password,
      role: roleMap[newUser.value.role] || "ROLE_USER",
      position: newUser.value.position,
    });
    await loadUsers();
    showAddModal.value = false;
  } catch (err) {
    console.error("Create user error:", err);
  }
}

// Save edit
async function saveEdit() {
  try {
    await updateUser(selectedUser.value.id, {
      name: selectedUser.value.name,
      username: selectedUser.value.username,
      role: roleMap[selectedUser.value.role] || "ROLE_USER",
      position: selectedUser.value.position
    });
    await loadUsers();
    showEditModal.value = false;
  } catch (err) {
    console.error("Update User Error:", err);
  }
}

// Update role from dropdown
async function updateRole(user, role) {
  try {
    await updateUser(user.id, { role: roleMap[role] || "ROLE_USER" });
    await loadUsers();
  } catch (err) {
    console.error("Role update error:", err);
  }
}

function handleOverlayClick(e) {
  if (e.target.classList.contains("modal-overlay")) {
    showDeleteModal.value = false;
  }
}
</script>


<template>
  <div class="page">
    <header class="page-header" ref="headerRef">
      <h1>User Management</h1>
      <div style="display:flex; gap:12px; align-items:center;">
        <input v-model="searchQuery" type="text" placeholder="Search users..." class="search-input" />
        <button class="add-user-btn" @click="openAddUser">+ Add User</button>
      </div>
    </header>

    <!-- Users Table -->
    <div class="table-wrapper">
      <table class="users-table">
        <thead>
          <tr>
            <th>Fullname</th>
            <th>Username/Email</th>
            <th>Position</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email || user.username}}</td>
            <td>{{ user.position }}</td>
            <td>
              <span :class="['role', user.displayRole.replace(' ', '')]">
                {{ user.displayRole }}
              </span>
            </td>
            <td class="relative">
              <div class="dropdown-wrapper">
                <button @click.stop="toggleDropdown(user.id, $event)">
                  <MoreVertical class="w-5 h-5"/>
                </button>
                <Teleport to="body">
                  <div v-if="openDropdownId === user.id" class="dropdown"
                       :style="{ top: dropdownPosition.top + 'px', left: dropdownPosition.left + 'px' }"
                       @click.stop>
                    <ul>
                      <li @click="openView(user); openDropdownId=null">View</li>
                      <li @click="openEdit(user); openDropdownId=null">Edit</li>
                      <li @click="openDelete(user); openDropdownId=null">Delete</li>
                      <li @click="updateRole(user, 'User'); openDropdownId=null">Make User</li>
                      <li @click="updateRole(user, 'Admin'); openDropdownId=null">Make Admin</li>
                      <li @click="updateRole(user, 'Project Manager'); openDropdownId=null">Make Project Manager</li>
                    </ul>
                  </div>
                </Teleport>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button :disabled="currentPage===1" @click="currentPage--">Prev</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage===totalPages" @click="currentPage++">Next</button>
    </div>

    <!-- VIEW MODAL -->
    <div v-if="showViewModal" class="modal-overlay" @click.self="showViewModal=false">
      <div class="modal-box">
        <div class="modal-header">
          <h2>User Details</h2>
          <button class="modal-close-btn" @click="showViewModal=false"><X /></button>
        </div>
        <div class="modal-body">
          <p><strong>Name:</strong> {{ selectedUser.name }}</p>
          <p><strong>Username:</strong> {{ selectedUser.username }}</p>
          <p><strong>Position:</strong> {{ selectedUser.position }}</p>
          <p><strong>Role:</strong> {{ roleMapReverse[selectedUser.role] || selectedUser.displayRole }}</p>
        </div>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal=false">
      <div class="modal-box edit-modal">
        <div class="modal-header">
          <h2>Edit User</h2>
          <button class="modal-close-btn" @click="showEditModal=false"><X /></button>
        </div>
        <div class="modal-body form-page">
          <label>Name</label>
          <input v-model="selectedUser.name" placeholder="Name"/>
          <label>Username</label>
          <input v-model="selectedUser.username" placeholder="Username"/>
          <label>Position</label>
          <input v-model="selectedUser.position" placeholder="Position"/>
          <label>Role</label>
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
    <div v-if="showDeleteModal" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-box">
        <div class="modal-header">
          <h2>Delete User?</h2>
          <button class="modal-close-btn" @click="showDeleteModal=false"><X /></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>{{ selectedUser.name }}</strong>?</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal=false">Cancel</button>
          <button class="bg-red" @click="confirmDeleteUser">Delete</button>
        </div>
      </div>
    </div>

    <!-- ADD USER MODAL -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal=false">
      <div class="modal-box add-user-modal">
        <div class="modal-header">
          <h2>Add New User</h2>
          <button class="cross" @click="showAddModal=false"><X class="w-5 h-5"/></button>
        </div>
        <div class="modal-body form-page">
          <label>Full Name</label>
          <input v-model="newUser.name" placeholder="Enter full name"/>
          <div class="form-row">
            <div class="form-col">
              <label>Username / Email</label>
              <input v-model="newUser.username" placeholder="Enter username"/>
            </div>
            <div class="form-col">
              <label>Password</label>
              <div class="password-field">
                <input :type="showPassword ? 'text' : 'text'" v-model="newUser.password" placeholder="Password"/>
                <button class="regen-btn" @click="regeneratePassword">↻</button>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <label>Position</label>
              <input v-model="newUser.position" placeholder="Position"/>
            </div>
            <div class="form-col">
              <label>Role</label>
              <select v-model="newUser.role">
                <option>User</option>
                <option>Admin</option>
                <option>Project Manager</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancle" @click="showAddModal=false">Cancel</button>
          <button class="bg-green" @click="addUser">Add User</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.page {
  margin-left: 0;
  padding-left: 0;
  background-color: #f4f6f8;
  width: 100%;
  min-height: 100vh;
  color: #333;
}
.page-header {
  position: sticky;
  top: 0;
  z-index: 50;
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
  overflow-y: auto;
  position: relative;
  z-index: 1;
  overflow-x: visible; /* 🔥 */
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


.dropdown-wrapper button {
  border: none;
  background:transparent;
  padding: 4px;
  cursor: pointer;
}

.dropdown-wrapper button:hover {
  background-color: transparent;
}

/* .table-wrapper {
  max-height: 400px; 
  overflow-y: auto;
  margin-bottom: 20px;
} */

/* Table */
.users-table thead th {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
}

/* Dropdown */
.dropdown {
  position: fixed;          /* 🔥 FIX */
  max-height: 250px;
  overflow-y: auto;
  width: 180px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 9999;            /* 🔥 header er upor thakbe */
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


/* Edit Modal specific */
.modal-box.edit-modal {
  width: 360px; /* halko compact width */
  max-width: 90%;
}

/* Inputs & select boxes full width */
.modal-box.edit-modal .modal-body input,
.modal-box.edit-modal .modal-body select {
  width: 100%;
  margin-bottom: 12px; /* vertical spacing */
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e0;
  box-sizing: border-box;
  font-size: 14px;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: calc(var(--header-height, 80px) + 10px);
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
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
  width: 360px;
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
  border: transparent;
}
.modal-footer .cancle{
  background: #3ca077;
  color: #fff;
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: transparent;
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

.modal-close-btn {
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #6b7280; /* normal gray */
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn:hover {
  color: #374151; /* slightly darker */
  background: transparent;
}

.modal-close-btn:focus {
  outline: none;
  box-shadow: none;
}

.modal-close-btn svg {
  width: 20px;
  height: 20px;
}



.add-user-btn {
  background: #3ca077;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  z-index: 60;
}

.add-user-btn:hover {
  background: #329e6a;
}

/**add-user-madal */

/* ===== Beautiful Add User Modal ===== */
.add-user-modal {
  width: 420px;
  padding: 24px;
  overflow: hidden; /* scrollbar remove */
}


/* Table clean look */
.add-user-modal table {
  box-shadow: none;
}

.add-user-modal table td {
  padding: 2px 6px;   /* row gap কম */
  font-size: 12.5px;
  vertical-align: middle;
}

.add-user-modal table td:first-child {
  font-weight: 600;
  width: 110px;
  color: #374151;
}

/* Password field */
/* Password field professional look */
.add-user-modal .password-field {
  display: flex;
  align-items: center;
  gap: 8px; /* more space between input & buttons */
}

.add-user-modal .password-field input {
  flex: 1;
  padding: 10px 14px; /* match other inputs */
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e0;
}

.add-user-modal .eye-btn,
.add-user-modal .regen-btn {
  padding: 6px 10px;
  font-size: 14px;
  border-radius: 6px;
}

.add-user-modal .eye-btn {
  cursor: pointer;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-user-modal .regen-btn {
  border: none;
  background: #e5f7ef;
  color: #3ca077;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-user-modal .regen-btn:hover {
  background: #d1fae5;
}


/* Eye button */
.eye-btn {
  cursor: pointer;
  font-size: 14px;
 
}

/* Regenerate button */
.regen-btn {
  border: none;
  background: #e5f7ef;
  color: #3ca077;
  font-weight: bold;
  padding: 4px 6px;
  border-radius: 6px;
  cursor: pointer;
}

.regen-btn:hover {
  background: #d1fae5;
}

/* Modal header polish */
.cross{
  border: none;
  border-radius: none;
  background: white;
}
.add-user-modal .modal-header {
  margin-bottom: 4px;
}

.add-user-modal .modal-header h2 {
  font-size: 20px;
}

.add-user-modal .modal-header button {
  padding: 2px;
}
/* Footer */
.add-user-modal .modal-footer {
  margin-top: 10px;
}

.add-user-modal .modal-footer button {
  min-width: 90px;
  height: 34px;
  font-size: 13px;
  border-radius: 5px;

}

/* ===== Page style form ===== */
.form-page {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-page label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-top: 4px;
}

/* Modal body inputs professional look */
.add-user-modal .modal-body input,
.add-user-modal .modal-body select {
  width: 100%;
  padding: 10px 14px; /* spacious padding */
  font-size: 14px;    /* readable font */
  border-radius: 8px; /* smooth rounded edges */
  border: 1px solid #cbd5e0;
  outline: none;
  transition: all 0.2s ease;
}

.add-user-modal .modal-body input:focus,
.add-user-modal .modal-body select:focus {
  border-color: #3ca077;
  box-shadow: 0 0 6px rgba(60, 160, 119, 0.25);
}

/* Form labels */
.add-user-modal label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  display: block;
}

/* Form row spacing */
.add-user-modal .form-row {
  display: flex;
  gap: 16px;   /* more breathing space */
  margin-bottom: 14px;
}



/* Two column row */
.add-user-modal .form-row {
  display: flex;
  gap: 16px; /* professional spacing */
  margin-bottom: 16px; /* row er niche spacing */
}

.form-col {
  flex: 1;
}


.add-user-modal .modal-body input,
.add-user-modal .modal-body select {
  width: 100%;
  padding: 12px 14px;  /* spacious padding */
  font-size: 14px;      /* readable font */
  border-radius: 8px;   /* smooth rounded edges */
  border: 1px solid #cbd5e0;
  outline: none;
  box-sizing: border-box;
}

.add-user-modal .modal-body input:focus,
.add-user-modal .modal-body select:focus {
  border-color: #3ca077;
  box-shadow: 0 0 6px rgba(60, 160, 119, 0.25);
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


</style>
