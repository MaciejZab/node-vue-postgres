enum Endpoints {
  UserAuth = "/api/user",
  UserSettingsTheme = "/api/user/settings/theme",
  UserSettingsLanguage = "/api/user/settings/language",
  UserSettingsPermission = "/api/user/settings/permission",
  DocumentDepartments = "/api/document/department",
  DocumentCategories = "/api/document/category",
  DocumentCatByDep = "/api/document/category/byDepName",
  DocumentSubcategories = "/api/document/subcategory",
  DocumentSubcategoriesByDepCat = "/api/document/subcategory/byDepCatName",
}

export { Endpoints };
