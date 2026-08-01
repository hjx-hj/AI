import { Button, type ButtonProps } from 'antd';
import { usePermission } from '@/hooks/usePermission';

interface AuthBtnProps extends ButtonProps {
  permission?: string;
}

export const AuthBtn = ({ permission, children, ...props }: AuthBtnProps) => {
  const { checkPermission } = usePermission();

  if (permission && !checkPermission(permission)) {
    return null;
  }

  return <Button {...props}>{children}</Button>;
};