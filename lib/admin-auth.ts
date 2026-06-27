const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin";

export function adminCredentialStatus() {
  const username = process.env.ADMIN_USERNAME || "";
  const password = process.env.ADMIN_PASSWORD || "";

  if (!username || !password) {
    return "missing";
  }

  if (username === DEFAULT_ADMIN_USERNAME && password === DEFAULT_ADMIN_PASSWORD) {
    return "default_credentials";
  }

  return "configured";
}

export function hasConfiguredAdminAuth() {
  return adminCredentialStatus() === "configured";
}
