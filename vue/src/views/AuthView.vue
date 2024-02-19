<script setup lang="ts">
import { VForm } from "vuetify/lib/components/VForm/index.mjs";
import { ref, computed } from "vue";
import axios from "axios";
import { usePermissionStore } from "../stores/permissionStore";
import { useRouter } from "vue-router";
import { nodeConfig } from "../config/env";
import { endpoints } from "../config/endpoints";

// Router
const router = useRouter();

// Permissions
const permissions = usePermissionStore();

// Form reference
const login = ref<typeof VForm | null>(null);

// Form data
interface LoginData {
  username: string;
  password: string;
}

const data = ref<LoginData>({
  username: "",
  password: "",
});

// Response error
interface LoginError {
  title: string;
  text: string;
}

const loginError = ref<LoginError | null>(null);

// Form Validation
const validation = ref<boolean>(false);
const nameRules = computed(() => [(value: string) => !!value || "User name is required."]);
const passwordRules = computed(() => [(value: string) => !!value || "Password is required."]);

// Form Methods
const loader = ref<boolean>(false);

const reset = (): Promise<boolean> => login.value?.reset();

const loading = (bool: boolean): boolean => {
  loader.value = bool;

  return loader.value;
};

const submitLogin = (): void => {
  if (validation.value) {
    loginError.value = null;
    loading(true);
    const reqUrl: string = `${nodeConfig.origin}:${nodeConfig.port}${endpoints.roleAuthPath}`;
    const reqData: LoginData = data.value;

    axios
      .post(reqUrl, reqData)
      .then(function (response) {
        permissions.change({
          read: response.data.read,
          write: response.data.write,
          control: response.data.control,
        });
        router.push({ path: "/pages" });
      })
      .catch(function (error) {
        loading(false);
        reset();
        switch (error.response.status) {
          case 401:
            loginError.value = {
              title: error.response.statusText,
              text: error.response.data.message,
            };
            break;
          default:
            break;
        }
      });
  }
};

const proceed = (): void => {
  loading(true);
  permissions.change({
    read: true,
    write: false,
    control: false,
  });
  router.push({ path: "/pages" });
};
</script>

<template>
  <v-container class="fill-height">
    <v-row>
      <v-col>
        <v-sheet :width="300" class="d-flex flex-column mx-auto">
          <v-container>
            <v-row>
              <v-col>
                <v-img :width="268" src="../intranet-logo.svg" class="d-flex flex-column"></v-img>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-form
                  ref="login"
                  class="d-flex flex-column"
                  v-model="validation"
                  @submit.prevent="submitLogin"
                >
                  <v-text-field
                    class="mb-2"
                    v-model="data.username"
                    :rules="nameRules"
                    label="Username"
                    required
                  />
                  <v-text-field
                    class="mb-2"
                    v-model="data.password"
                    :rules="passwordRules"
                    label="Password"
                    type="password"
                    required
                  />
                  <v-btn type="submit" variant="text">Login</v-btn>
                </v-form>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-alert
                  v-if="loginError"
                  type="error"
                  :text="`${loginError?.title}: ${loginError?.text}`"
                ></v-alert>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-form ref="continue" class="d-flex flex-column" @submit.prevent="proceed">
                  <v-btn type="submit" variant="text">Continue without Login</v-btn>
                </v-form>
              </v-col>
            </v-row>
            <v-spacer v-if="!loginError"></v-spacer>
          </v-container>

          <v-progress-linear :active="loader" :indeterminate="loader" bottom></v-progress-linear>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
@import "../assets/colors.scss";

.v-sheet {
  border: 1px solid $reconext-cool-gray7;
}
.v-progress-linear {
  color: $reconext-green;
}
</style>
