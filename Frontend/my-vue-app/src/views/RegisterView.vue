<template>
  <div class="register-container">
    <h2>Register</h2>
    <div class="error" v-if="error">{{ error }}</div>
    <input type="text" v-model="full_name" placeholder="Full Name" />
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="handleRegister">Register</button>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default {
  name: "RegisterView",
  data() {
    return {
      full_name: "",
      email: "",
      password: "",
      error: ""
    };
  },
  methods: {
    async handleRegister() {
      this.error = "";

      if (!this.full_name || !this.email || !this.password) {
        this.error = "All fields are required.";
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);

        
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        const token = await userCredential.user.getIdToken();

        const response = await fetch("http://localhost:8000/login-service/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          full_name: this.full_name,
          token: token
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }


        alert("Registration successful!");
        this.$router.push("/login");
      } catch (err) {
        this.error = err.message;
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  width: 300px;
  margin: 100px auto;
}
.register-container input {
  width: 100%;
  padding: 12px;
  margin: 8px 0 16px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.register-container button {
  width: 100%;
  padding: 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
.register-container button:hover {
  background: #218838;
}
.error {
  color: red;
  font-size: 14px;
  text-align: center;
}
</style>
