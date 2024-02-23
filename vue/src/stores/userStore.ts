import { defineStore } from "pinia";
import { ref } from "vue";
import { User } from "../intefaces/User";

export const useUserStore = defineStore("user", () => {
  const user = ref<User>({
    id: null,
    username: null,
  });

  const set = (data: User): boolean => {
    try {
      user.value.id = data.id;
      user.value.username = data.username;

      localStorage.setItem("user", JSON.stringify(user.value));
    } catch (error) {
      return false;
    }

    return true;
  };

  const info = (): User | false => {
    try {
      const json: string | null = localStorage.getItem("user");
      if (!json) throw new Error("No user data found in localStorage");

      const user: User = JSON.parse(json);
      return user;
    } catch (error) {
      console.error("Error retrieving user info:", error);
      return false;
    }
  };

  return { set, info };
});
