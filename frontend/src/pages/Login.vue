<script setup >
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "@/composables/useApi";

const router = useRouter();
const { fetchWithCsrf } = useApi();

const form = reactive({
  email: "",
  password: "",
  remember: false,
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
      headers: { "Content-Type": "application/json" },
    });

    message.value = "Login successful!";
    console.log("Login response:", res);
    router.push("/products");
  } catch (err) {
    console.error("Login error:", err);
    message.value = err.message || "Login failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    <Toast />
    <div class="w-full max-w-md bg-white p-8 rounded shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">Admin Login</h2>

      <div class="mb-4">
        <label for="email" class="block mb-1 font-semibold">Username or Email</label>
        <InputText
          id="email"
          v-model="form.email"
          placeholder="Enter your email"
          class="w-full"
        />
      </div>

      <div class="mb-4">
        <label for="password" class="block mb-1 font-semibold">Password</label>
        <Password
          v-model="form.password"
          :feedback="false"
          placeholder="Enter your password"
          class="w-full"
        />
      </div>

      <div class="flex items-center mb-4">
        <input
          type="checkbox"
          v-model="form.remember"
          id="remember"
          class="mr-2"
        />
        <label for="remember" class="select-none">Remember me</label>
      </div>

      <Button
        label="Login"
        icon="pi pi-sign-in"
        class="w-full"
        :loading="loading"
        @click="login"
      />

      <p v-if="message" class="mt-4 text-center text-red-500">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Make input fields look like Laravel defaults */
</style>
