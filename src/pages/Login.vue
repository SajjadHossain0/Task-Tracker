
<template>

  <div class="login-page">
    <header><h1 class="title">Login</h1></header>
    <!-- Login Box -->
    <div class="login-box">

      <input
        type="text"
        placeholder="Username"
        v-model="username"
        class="input"
      />

      <input
        type="password"
        placeholder="Password"
        v-model="password"
        class="input"
      />

      <button class="login-btn" @click="handleLogin">
        Login
      </button>

 <!-- 🔥 Toast Popup -->
  <LoginToast
    :show="showToast"
    :message="toastMessage"
    :type="toastType"
  />

    </div>

    <!-- Study Message Button -->
    <!-- <button class="study-btn">
      Status Message
    </button> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "@/services/auth";
import LoginToast from "@/components/MassegeToast.vue";


const username = ref("");
const password = ref("");
const loading = ref(false);

//ToastMesage//
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

const router = useRouter();

async function handleLogin() {
  if (!username.value || !password.value) {
    toastMessage.value = "Please enter username & password";
    toastType.value = "error";
    showToast.value = true;
    autoHide();
    return;
  }

  loading.value = true;

  try {
    const data = await loginUser(username.value, password.value);

    localStorage.setItem("token", data.token);

    toastMessage.value = "Login Successfully";
    toastType.value = "success";
    showToast.value = true;

    setTimeout(() => {
      router.push("/");
    }, 1000);

  } catch (error) {
    // toastMessage.value = error.message || "Wrong password, try again";
     toastMessage.value = error.message || "Login Failed";
    toastType.value = "error";
    showToast.value = true;
  } finally {
    loading.value = false;
    autoHide();
  }
}

function autoHide() {
  setTimeout(() => {
    showToast.value = false;
  }, 2000);
}

</script>

<style scoped>
/* Page */
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
 background: white;
  position: relative;
  font-family: Arial, sans-serif;
}

/* Login Box */
.login-box {
  background: white;
  padding: 30px;
  width: 320px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
}

/* Title */
.title {
  text-align: center;
  margin-bottom: 20px;
  margin-top: -200px;
  font-size: x-large;
  font-weight: bold;
}

/* Input */
.input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

/* Login Button */
.login-btn {
  margin-top: 8px;
  width: 100%;
  padding: 8px;
  background-color: #3ca077;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
}

.login-btn:hover {
  background:  #1c764f;
}

/* Study Message Button */
.study-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  color: #4f46e5;
  border: none;
  padding: 8px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.study-btn:hover {
  background: #e0e7ff;
}
</style>


