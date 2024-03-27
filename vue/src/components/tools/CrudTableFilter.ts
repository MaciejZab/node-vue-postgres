import { Ref } from "vue";

const filter = (
  search: Ref<string>,
  searchBy: Array<string>,
  items: Ref<Array<any>>
): Array<any> => {
  if (search.value) {
    return items.value.filter((item: any) => {
      for (const key of searchBy) {
        const value = item[key]?.toLowerCase();
        const searchTerm = search.value.toLowerCase();
        if (value && value.includes(searchTerm)) {
          return true;
        }
      }
      return false;
    });
  } else return items.value;
};

export { filter };
