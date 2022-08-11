import { AuthContext } from './../contexts/AuthContext';
import { useContext } from 'react';

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return false;
  }

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
