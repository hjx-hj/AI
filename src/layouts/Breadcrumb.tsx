import { Breadcrumb } from 'antd';
import { useLocation } from 'react-router-dom';
import { routes } from '@/router/routes';

export const BreadcrumbComponent = () => {
  const location = useLocation();
  const path = location.pathname;

  const findRouteByPath = (routePath: string): typeof routes[0] | undefined => {
    for (const route of routes) {
      if (route.path === routePath) {
        return route;
      }
      if (route.children) {
        const found = route.children.find((child) => child.path === routePath);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  };

  const route = findRouteByPath(path);

  return (
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item href="/">首页</Breadcrumb.Item>
      {route?.meta.title && <Breadcrumb.Item>{route.meta.title}</Breadcrumb.Item>}
    </Breadcrumb>
  );
};