<script setup lang="ts">
import { VForm } from "vuetify/lib/components/VForm/index.mjs";
import { ref, computed } from "vue";
import axios from "axios";
import { usePermissionStore } from "../stores/permissionStore";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";
import { nodeConfig } from "../config/env";
import { endpoints } from "../config/endpoints";
import { User } from "../models/user/User";
import { Permission } from "../models/user/Permission";
import { useSettingsStore } from "../stores/settingsStore";
import { ResponseStatus } from "../models/common/ResponseStatus";
import { IResponseStatus } from "../interfaces/common/IResponseStatus";
import alertResponseStatus from "../components/common/alertResponseStatus.vue";

// Router
const router = useRouter();

// Stores
const permissionStore = usePermissionStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

// Form reference
const login = ref<typeof VForm | null>(null);

// Form loading animation
const loader = ref<boolean>(false);

// Form data
interface LoginData {
  username: string;
  domain: string;
  password: string;
}

const data = ref<LoginData>({
  username: "",
  domain: "reconext.com",
  password: "",
});

const responseStatus = ref<IResponseStatus | null>(null);

// const loginError = ref<LoginError | null>(null);

// Password
const passwordVisibility = ref<boolean>(false);
const passwordIcon = computed((): string => (passwordVisibility.value ? "mdi-eye" : "mdi-eye-off"));
const passwordType = computed((): string => (passwordVisibility.value ? "text" : "password"));

// Form Validation
const validation = ref<boolean>(false);
const nameRules = computed(() => [
  (value: string) => !!value || "User name is required.",
  (value: string) => {
    if (/^[a-zA-Z]+\.[a-zA-Z]+$/.test(value)) return true;
    return "Please enter the user name in the format: 'name.surname'";
  },
]);
const domainRules = computed(() => [(value: string) => !!value || "Domain is required."]);
const passwordRules = computed(() => [(value: string) => !!value || "Password is required."]);

// Form Methods

const reset = (): Promise<boolean> => login.value?.reset();

const loading = (bool: boolean): boolean => {
  loader.value = bool;
  return loader.value;
};

const submitLogin = (): void => {
  if (validation.value) {
    responseStatus.value = null;
    loading(true);
    const reqUrl: string = `${nodeConfig.origin}:${nodeConfig.port}${endpoints.userAuthPath}`;
    data.value.username.toLocaleLowerCase();
    const reqData: LoginData = data.value;

    axios
      .post(reqUrl, reqData)
      .then(function (response) {
        userStore.set(new User(response.data.userExist));
        permissionStore.set(new Permission(response.data.userExist.permission));
        settingsStore.set(response.data.userExist.settings);
        router.push({ path: "/pages" });
      })
      .catch(function (error) {
        console.log(error);

        loading(false);
        reset();
        responseStatus.value = new ResponseStatus({
          code: error.response.status,
          message: error.response.data.message,
        });
      });
  }
};

// const proceed = (): void => {
//   loading(true);
//   const user = {
//     id: null,
//     username: null,
//     domain: null,
//   };
//   const permission = {
//     read: true,
//     write: false,
//     control: false,
//   };
//   userStore.set(new User(user));
//   permissionStore.set(new Permission(permission));
//   router.push({ path: "/pages" });
// };
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
                      <v-select
                        label="Domain"
                        v-model="data.domain"
                        :items="['reconext.com', 'tgn.teleplan.com']"
                        :rules="domainRules"
                        required
                      ></v-select>
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
                  <v-btn type="submit" class="bg-secondary" variant="tonal">Login</v-btn>
                </v-form>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <alert-response-status :status="responseStatus" :persist="true" />
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col>
                <v-form ref="continue" class="d-flex flex-column" @submit.prevent="proceed">
                  <v-btn type="submit" class="bg-primaryVariant text-onPrimary" variant="tonal"
                    >Continue without Login</v-btn
                  >
                </v-form>
              </v-col>
            </v-row> -->
            <v-spacer v-if="!responseStatus"></v-spacer>
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
