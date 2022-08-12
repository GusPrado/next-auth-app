import { AuthContext } from './../contexts/AuthContext';
import { useContext } from 'react';

import { validateUserPerms } from '../utils/validateUserPerms';

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return false;
  }

  let userHasValidPermissions = false;

  if (user) {
    userHasValidPermissions = validateUserPerms({
      user,
      permissions,
      roles,
    });
  }

  return userHasValidPermissions;
}
