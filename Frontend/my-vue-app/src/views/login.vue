<template>
  <div class="login-container">
    <h2>{{ isRegister ? "Register" : "Login" }}</h2>

    <div class="error" v-if="error">{{ error }}</div>

    <input
      v-if="isRegister"
      type="text"
      v-model="fullName"
      placeholder="Full Name"
    />
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />

    <button :disabled="isLoading" @click="isRegister ? handleRegister() : handleLogin()">
      {{ isLoading ? (isRegister ? "Registering..." : "Logging in...") : (isRegister ? "Register" : "Login") }}
    </button>

    <p class="toggle-text">
      <span v-if="!isRegister">Don't have an account?</span>
      <span v-else>Already have an account?</span>
      <a href="#" @click.prevent="toggleMode">
        {{ isRegister ? "Login here" : "Register here" }}
      </a>
    </p>
  </div>
</template>

<script>
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth } from "@/firebase";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      fullName: "",
      error: "",
      isRegister: false,
      isLoading: false
    };
  },
  methods: {
    toggleMode() {
      this.isRegister = !this.isRegister;
      this.error = "";
    },
    async handleLogin() {
      this.error = "";
      if (!this.email || !this.password) {
        this.error = "Email and password are required.";
        return;
      }

      this.isLoading = true;
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const token = await userCredential.user.getIdToken();

        const response = await fetch("http://localhost:8000/login-service/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");

        this.$router.push("/homepage");
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async handleRegister() {
      this.error = "";
      if (!this.email || !this.password || !this.fullName) {
        this.error = "All fields are required for registration.";
        return;
      }

      this.isLoading = true;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );

        await updateProfile(userCredential.user, {
          displayName: this.fullName
        });

        const token = await userCredential.user.getIdToken();

        const response = await fetch("http://localhost:8000/login-service/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token,
            full_name: this.fullName
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Registration failed");

        this.$router.push("/homepage");
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  width: 300px;
  margin: auto;
  margin-top: 100px;
}

.login-container h2 {
  margin-bottom: 20px;
  text-align: center;
}

.login-container input {
  width: 100%;
  padding: 12px;
  margin: 8px 0 16px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-container button {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.login-container button:hover:enabled {
  background: #0056b3;
}

.login-container button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-text {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.toggle-text a {
  color: #007bff;
  margin-left: 5px;
  cursor: pointer;
  text-decoration: underline;
}

.error {
  color: red;
  font-size: 14px;
  text-align: center;
  margin-bottom: 10px;
}
</style>
