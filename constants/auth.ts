export const USER_ROLES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ADMIN_REGISTER_REDIRECT_PATH = "/admin/login";

export const DEFAULT_ADMIN_LOGIN_VALUES = {
  email: "",
  password: "",
};

export const ADMIN_MIN_PASSWORD_LENGTH = 8;

export const DEFAULT_ADMIN_REGISTER_VALUES = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
