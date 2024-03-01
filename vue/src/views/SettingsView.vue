<script setup lang="ts">
import { ref } from "vue";
import alertResponseStatus from "../components/common/alertResponseStatus.vue";
import ApplicationWindow from "../components/views/settings/ApplicationWindow.vue";
import UserWindow from "../components/views/settings/UserWindow.vue";
import { IResponseStatus } from "../interfaces/common/IResponseStatus";

const responseStatus = ref<IResponseStatus | null>(null);

const handleResponseStatus = (status: IResponseStatus) => (responseStatus.value = status);
const tab = ref<number>(1);
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="bg-surface text-onSurface mt-3">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <alert-response-status :status="responseStatus" :persist="false" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-tabs v-model="tab" align-tabs="center">
                  <v-tab :value="1">Application</v-tab>
                  <v-tab :value="2">User</v-tab>
                </v-tabs>
                <v-window v-model="tab">
                  <v-window-item :value="1">
                    <v-container fluid v-if="tab === 1">
                      <v-row>
                        <v-col>
                          <application-window @response-status="handleResponseStatus" />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-window-item>
                  <v-window-item :value="2">
                    <v-container fluid v-if="tab === 2">
                      <v-row>
                        <v-col>
                          <user-window @response-status="handleResponseStatus" />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-window-item>
                </v-window>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
