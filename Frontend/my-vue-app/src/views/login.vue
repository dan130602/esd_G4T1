<template>
  <div class="login-container">
    <h2>Login</h2>
    <div class="error" v-if="error">{{ error }}</div>
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="handleLogin">Login</button>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase"; // Adjust this path if your firebase config is elsewhere

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },
  methods: {
    async handleLogin() {
      this.error = "";

      if (!this.email || !this.password) {
        this.error = "Both fields are required.";
        return;
      }

      try {
        // 🔐 Sign in with Firebase and get ID token
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const token = await userCredential.user.getIdToken();

        // 🌐 Send token to backend via Kong
        const response = await fetch("http://localhost:8000/login-service/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token }) // Backend expects token, not email/pass
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        alert("Login successful!");
        this.$router.push("/homepage");
      } catch (err) {
        this.error = err.message;
      }
    }
  }
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-container {
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  width: 300px;
  margin: auto;
  margin-top: 100px;
}

.login-container h2 {
  margin-bottom: 20px;
  text-align: center;
}

.login-container input[type="email"],
.login-container input[type="password"] {
  width: 100%;
  padding: 12px;
  margin: 8px 0 16px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-container button {
  width: 100%;
  padding: 12px;
  background: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.login-container button:hover {
  background: #0056b3;
}

.error {
  color: red;
  font-size: 14px;
  text-align: center;
}
</style>
