interface Endpoints {
  userAuthPath: string;
  userSettingsThemePath: string;
  userSettingsPermissionPath: string;
}
const endpoints: Endpoints = {
  userAuthPath: "/api/user",
  userSettingsThemePath: "/api/user/settings/theme",
  userSettingsPermissionPath: "/api/user/settings/permission",
};

export { endpoints };
