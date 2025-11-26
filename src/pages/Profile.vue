<script setup>
import {ref} from "vue";
import {X, Edit2, Lock, Mail} from "lucide-vue-next";

// Dummy user data
const user = ref({
  name: "John Doe",
  position: "Project Manager",
  email: "john@example.com",
  avatar: "https://i.pravatar.cc/150?img=3",
  emailNotification: true,
});

// Modals
const showChangePassword = ref(false);
const showEditProfile = ref(false);

// Change password data
const passwordForm = ref({current: "", new: "", confirm: ""});

function toggleEmailNotification() {
  user.value.emailNotification = !user.value.emailNotification;
}

function savePassword() {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert("New password and confirm password do not match!");
    return;
  }
  alert("Password updated successfully!");
  passwordForm.value = {current: "", new: "", confirm: ""};
  showChangePassword.value = false;
}

function saveProfile() {
  alert("Profile updated successfully!");
  showEditProfile.value = false;
}
</script>

<template>
  <div class="profile-page">
    <h1>My Profile</h1>

    <div class="profile-card">
      <!-- Avatar -->
      <div class="profile-avatar">
        <img :src="user.avatar" alt="Profile"/>
        <button @click="showEditProfile=true">
          <Edit2 class="icon"/>
        </button>
      </div>

      <!-- Info & Settings -->
      <div class="profile-info">
        <h2>{{ user.name }}</h2>
        <p class="position">{{ user.position }}</p>

        <div class="account-settings">
          <h3>Account Settings</h3>

          <!-- Email Notifications -->
          <div class="setting-row">
            <div class="label">
              <Mail class="icon"/>
              <span>Email Notifications</span>
            </div>
            <input type="checkbox" v-model="user.emailNotification"/>
          </div>

          <!-- Change Password -->
          <div class="setting-row clickable" @click="showChangePassword=true">
            <div class="label">
              <Lock class="icon"/>
              <span>Change Password</span>
            </div>
            <span class="action-btn">Update</span>
          </div>

          <!-- Edit Profile -->
          <div class="setting-row clickable" @click="showEditProfile=true">
            <div class="label">
              <Edit2 class="icon"/>
              <span>Edit Profile</span>
            </div>
            <span class="action-btn">Edit</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showChangePassword" class="modal-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <h2>Change Password</h2>
          <button @click="showChangePassword=false">
            <X class="icon"/>
          </button>
        </div>
        <div class="modal-body">
          <input type="password" v-model="passwordForm.current" placeholder="Current Password"/>
          <input type="password" v-model="passwordForm.new" placeholder="New Password"/>
          <input type="password" v-model="passwordForm.confirm" placeholder="Confirm New Password"/>
        </div>
        <div class="modal-footer">
          <button class="btn-save" @click="savePassword">Save</button>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditProfile" class="modal-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <h2>Edit Profile</h2>
          <button @click="showEditProfile=false">
            <X class="icon"/>
          </button>
        </div>
        <div class="modal-body">
          <input type="text" v-model="user.name" placeholder="Full Name"/>
          <input type="text" v-model="user.position" placeholder="Position"/>
          <input type="email" v-model="user.email" placeholder="Email"/>
        </div>
        <div class="modal-footer">
          <button class="btn-save" @click="saveProfile">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* PAGE */
.profile-page {
  background: #f4f6f8;
  min-height: 100vh;
  padding: 30px;
  font-family: 'Arial', sans-serif;
  color: #333;
}

h1 {
  font-size: 28px;
  margin-bottom: 20px;
}

/* PROFILE CARD */
.profile-card {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  gap: 20px;
}

.profile-avatar {
  position: relative;
}

.profile-avatar img {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #cbd5e0;
}

.profile-avatar button {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #3ca077;
  border: none;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.profile-avatar button:hover {
  background: #36a06c;
}

.profile-info {
  flex: 1;
  min-width: 200px;
}

.profile-info h2 {
  font-size: 22px;
  margin: 0;
}

.profile-info .position {
  color: #6b7280;
  margin-bottom: 15px;
}

/* ACCOUNT SETTINGS */
.account-settings {
  background: #f9fafb;
  padding: 15px;
  border-radius: 8px;
}

.account-settings h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-row .label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-row .action-btn {
  color: #3ca077;
  cursor: pointer;
  font-weight: 500;
}

.setting-row.clickable:hover .action-btn {
  text-decoration: underline;
}

.setting-row input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #3ca077;
  cursor: pointer;
}

/* MODALS */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-box {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.modal-body input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e0;
  outline: none;
}

.modal-body input:focus {
  border-color: #3ca077;
  box-shadow: 0 0 5px rgba(60, 160, 119, 0.3);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-save {
  background: #3ca077;
  color: #fff;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  border: none;
  transition: background 0.2s;
}

.btn-save:hover {
  background: #36a06c;
}

/* ICON SIZE */
.icon {
  width: 18px;
  height: 18px;
}
</style>
