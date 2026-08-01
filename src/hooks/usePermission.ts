import { useUserStore } from '@/store/user';
import { PermissionEnum } from '@/types/auth';

export const usePermission = () => {
  const { permissions, hasPermission } = useUserStore();

  const checkPermission = (permission: string): boolean => {
    return hasPermission(permission);
  };

  const checkPermissions = (permissionList: string[]): boolean => {
    return permissionList.some((p) => hasPermission(p));
  };

  return {
    permissions,
    hasPermission,
    checkPermission,
    checkPermissions,
    isAdmin: hasPermission(PermissionEnum.USER_DELETE),
  };
};