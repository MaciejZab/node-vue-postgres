interface Endpoints {
  userAuthPath: string;
  userSettingsThemePath: string;
}
const endpoints: Endpoints = {
  userAuthPath: "/api/user",
  userSettingsThemePath: "/api/user/settings/theme",
};

export { endpoints };
