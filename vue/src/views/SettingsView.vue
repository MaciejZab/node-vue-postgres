<script setup lang="ts">
import { ref, watch } from "vue";
import { useTheme } from "vuetify";

const tab = ref(1);
const theme = ref("light");
const themeInstance = useTheme();

const changeTheme = () => {
  try {
    console.log(1);
    themeInstance.global.name.value = theme.value; // Check if this is the correct method for your Vuetify version
  } catch (error) {
    console.error("Error changing theme:", error);
  }
};

watch(theme, (newTheme: string, oldTheme: string) => {
  // Perform an action when theme changes
  console.log("Theme changed from", oldTheme, "to", newTheme);
  // You can call your custom function or update other parts of your app here
  changeTheme();
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="bg-surface text-onSurface mt-3">
          <v-tabs v-model="tab" class="" align-tabs="center">
            <v-tab :value="1">Application</v-tab>
            <v-tab :value="2">User</v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item v-for="n in 2" :key="n" :value="n">
              <v-container fluid>
                <v-row>
                  <v-col md="4">
                    <v-select v-model="theme" label="Theme" :items="['light', 'dark']"></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
