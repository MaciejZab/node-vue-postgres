<script setup lang="ts">
import { VForm } from "vuetify/lib/components/VForm/index.mjs";
import { ref, computed } from "vue";
import axios from "axios";
import { usePermissionStore } from "../stores/permissionStore";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";
import { nodeConfig } from "../config/env";
import { endpoints } from "../config/endpoints";

// Router
const router = useRouter();

// Stores
const permissions = usePermissionStore();
const user = useUserStore();

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

// Password
const passwordVisibility = ref<boolean>(false);
const passwordIcon = computed((): string => (passwordVisibility.value ? "mdi-eye" : "mdi-eye-off"));
const passwordType = computed((): string => (passwordVisibility.value ? "text" : "password"));

// Form Validation
const validation = ref<boolean>(false);
const nameRules = computed(() => [(value: string) => !!value || "User name is required."]);
const passwordRules = computed(() => [(value: string) => !!value || "Password is required."]);

const loginError = ref<LoginError | null>(null);

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
        console.log(response.data);
        // user.set({
        //   id: response.data.id,
        //   username: response.data.username,
        // });
        // permissions.set({
        //   read: response.data.read,
        //   write: response.data.write,
        //   control: response.data.control,
        // });
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
            loginError.value = {
              title: "Unknown error occurred",
              text: "Please try again later",
            };
            break;
        }
      });
  }
};

const proceed = (): void => {
  loading(true);
  user.set({
    id: 3,
    username: "Operator",
  });
  permissions.set({
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
        <v-sheet :width="300" border class="d-flex flex-column mx-auto">
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
                  <v-container fluid>
                    <v-row>
                      <v-text-field
                        class="mb-2"
                        v-model="data.username"
                        :rules="nameRules"
                        label="Username"
                        required
                      ></v-text-field
                    ></v-row>
                    <v-row>
                      <v-select label="Domain" :items="['@reconext.com', '@tgn.com']"></v-select>
                    </v-row>
                    <v-row>
                      <v-text-field
                        class="mb-2"
                        v-model="data.password"
                        :rules="passwordRules"
                        :append-inner-icon="passwordIcon"
                        @click:append-inner="passwordVisibility = !passwordVisibility"
                        label="Password"
                        :type="passwordType"
                        required
                      />
                    </v-row>
                  </v-container>
                  <v-btn type="submit" class="bg-primaryVariant text-onPrimary" variant="tonal"
                    >Login</v-btn
                  >
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
                  <v-btn type="submit" class="bg-primaryVariant text-onPrimary" variant="tonal"
                    >Continue without Login</v-btn
                  >
                </v-form>
              </v-col>
            </v-row>
            <v-spacer v-if="!loginError"></v-spacer>
          </v-container>

          <v-progress-linear
            :active="loader"
            :indeterminate="loader"
            bottom
            color="secondary"
          ></v-progress-linear>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
@import "../assets/colors.scss";
</style>
