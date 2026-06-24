export const authConfig = {
  defaultRole: "USER" as const,
  signInPath: "/login",
  signUpPath: "/signup",
  profileRedirectPath: "/profile",
  dashboardRedirectPath: "/dashboard",
  sessionMaxAge: 30 * 24 * 60 * 60,
};

export type AuthRole = typeof authConfig.defaultRole | "ADMIN";
