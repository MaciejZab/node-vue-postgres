<script setup lang="ts">
import { ref, computed } from "vue";
import axios from "axios";

interface Form {
  username: string;
  password: string;
}

const data = ref<Form>({
  username: "",
  password: "",
});

// Validation rules
const nameRules = computed(() => [(value: string) => !!value || "User name is required."]);

const passwordRules = computed(() => [(value: string) => !!value || "Password is required."]);

const submitForm = () => {
  // Define the API endpoint
  const reqUrl: string = "http://localhost:3000";
  const reqData: Form = data.value;

  axios
    .post(reqUrl, reqData)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};
</script>

<template>
  <v-sheet width="300" class="mx-auto pa-4" border>
    <v-form class="d-flex flex-column" @submit.prevent="submitForm">
      <v-text-field class="mb-2" v-model="data.username" :rules="nameRules" label="Username" required />
      <v-text-field class="mb-2" v-model="data.password" :rules="passwordRules" label="Password" type="password" required />
      <v-btn type="submit" variant="text">Submit</v-btn>
    </v-form>
  </v-sheet>
</template>
