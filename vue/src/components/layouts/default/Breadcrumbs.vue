<script setup lang="ts">
import { ref, watch } from "vue";
import { RouteRecordName, useRouter } from "vue-router";

const router = useRouter();

const blackList: Array<RouteRecordName | undefined> = ["pages"];

const getBreadcrumbItems = () => {
  // Retrieve matched route records for the current route
  const matchedRoutes = router.currentRoute.value.matched;

  // Check if the current route is not '/pages/home'
  const isNotHomePage = router.currentRoute.value.path !== "/pages/home";

  // Initialize an empty array to store breadcrumb items
  const breadcrumbItems = [];

  // Insert home route before all breadcrumb items if the current route is not '/pages/home'
  if (isNotHomePage) {
    breadcrumbItems.push({
      title: "Home",
      disabled: false,
      href: "/pages/home",
    });
  }

  // Iterate through each matched route record
  for (const routeRecord of matchedRoutes) {
    // Get the route name and path
    const { name, path } = routeRecord;

    // Check if the route name is not in the blackList and skip 'home' route if it's already added
    if (!blackList.includes(name) && !(isNotHomePage && name === "home")) {
      // Create a breadcrumb item object
      const breadcrumbItem = {
        title: (name as string).charAt(0).toUpperCase() + (name as string).slice(1),
        disabled: false,
        href: path,
      };

      // Push the breadcrumb item to the array
      breadcrumbItems.push(breadcrumbItem);
    }
  }

  // Return the array of breadcrumb items
  return breadcrumbItems;
};

interface Breadcrumbs {
  title: string;
  disabled: boolean;
  href: string;
}

const breadcrumbsItems = ref<Array<Breadcrumbs>>(getBreadcrumbItems());

watch(router.currentRoute, () => {
  breadcrumbsItems.value = getBreadcrumbItems();
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-breadcrumbs :items="breadcrumbsItems" class="text-h6">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>
  </v-container>
</template>
