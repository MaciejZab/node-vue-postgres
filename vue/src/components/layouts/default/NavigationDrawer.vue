<script setup lang="ts">
import { ref, computed, ComputedRef } from "vue";
import { useUserStore } from "../../../stores/userStore";
import { IUser } from "../../../interfaces/user/IUser";

const props = defineProps(["drawerVisible"]);

const smallScreen = ref<boolean>(window.innerWidth < 960);

const drawerLocation = computed((): "bottom" | "left" => (smallScreen.value ? "bottom" : "left"));

const userObj = ref<IUser | false>(useUserStore().info());
const username: ComputedRef<string> = computed(() => {
  const lowercased = userObj.value ? userObj.value.username?.split(".").at(0) : null;
  return lowercased ? lowercased.charAt(0).toUpperCase() + lowercased.slice(1) : "";
});

const listItems = [
  {
    id: 1,
    link: "/pages/home",
    content: "Home",
    icon: "home",
    onClick: "",
  },
  {
    id: 2,
    link: "/pages/tools",
    content: "Tools",
    icon: "tools",
    onClick: "",
  },
  {
    id: 3,
    link: "/pages/settings",
    content: "Settings",
    icon: "cogs",
    onClick: "",
  },
  {
    id: 4,
    link: "/",
    content: "Logout",
    icon: "account-arrow-left",
    onClick: "",
  },
];
</script>

<template>
  <v-navigation-drawer
    :location="drawerLocation"
    temporary
    v-model="props.drawerVisible"
    class="bg-primary"
  >
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Hello {{ username }} </v-list-item-title>
          <!-- <v-list-item-subtitle> </v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item
        v-for="item in listItems"
        :key="item.id"
        :link="item.link ? true : undefined"
        :to="item.link"
        @click="item.onClick"
      >
        <v-list-item-icon>
          <v-icon :icon="`mdi-${item.icon}`"></v-icon>
        </v-list-item-icon>
        <v-list-item-content class="pl-2">{{ item.content }}</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
