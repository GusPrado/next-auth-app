type User = {
  permissions: string[];
  roles: string[];
};

type ValidateUserPermsParams = {
  user: User;
  permissions?: string[];
  roles?: string[];
};

export function validateUserPerms({
  user,
  permissions,
  roles,
}: ValidateUserPermsParams) {
  if (permissions?.length) {
    const hasAllPermissions = permissions?.every((permission) => {
      return user?.permissions.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles?.length) {
    const hasAllRoles = roles?.some((permission) => {
      return user?.roles.includes(permission);
    });

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
}
