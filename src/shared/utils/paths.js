const path = (root, path) => `${root}${path}`;

export const removeFirstSlash = (path) => {
  const [_, ...rest] = path.split("/");
  return rest.join("/");
};

export const ROOT_ROUTE = "/";
export const AUTH_ROOT = "/auth";
export const DASHBOARD_ROOT = "/dashboard";

export const PUBLIC_ROUTES = {
  home: path(ROOT_ROUTE, "/"),
  privacy: path(ROOT_ROUTE, "/privacy"),
  terms: path(ROOT_ROUTE, "/terms"),
};

export const AUTH_ROUTES = {
  login: path(AUTH_ROOT, "/login"),
  register: path(AUTH_ROOT, "/register"),
  forgotPassword: path(AUTH_ROOT, "/forgotpassword"),
  termsAndConditions: path(AUTH_ROOT, "/terms"),
  verifyToken: path(AUTH_ROOT, `/verify`),
};

export const DASHBOARD_ROUTES = {
  home: path(DASHBOARD_ROOT, "/home"),
  calendar: path(DASHBOARD_ROOT, "/calendar"),
  accounts: path(DASHBOARD_ROOT, "/accounts"),
  profile: path(DASHBOARD_ROOT, "/profile"),
  tasks: path(DASHBOARD_ROOT, "/tasks"),
};
