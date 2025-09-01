<script setup>
import { reactive, ref } from "vue";
import { useApi } from "@/composables/useApi";

const { fetchWithCsrf } = useApi();

const form = reactive({
  email: "",
  password: "",
});

const message = ref("");
const loading = ref(false);

const login = async () => {
  message.value = "";
  loading.value = true;

  try {
    const res = await fetchWithCsrf("/login", {
      method: "POST",
      body: JSON.stringify({ ...form }),
    });

    message.value = "Login successful!";
    console.log("Login response:", res);
  } catch (err) {
    console.error("Login error:", err);
    message.value = err.message || "Login failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <input v-model="form.email" placeholder="Email" />
    <input v-model="form.password" placeholder="Password" type="password" />

    <button @click="login" :disabled="loading">
      {{ loading ? "Logging in..." : "Login" }}
    </button>

    <p>{{ message }}</p>
  </div>
</template>
