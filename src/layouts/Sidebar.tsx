import { useState } from 'react';
import { Menu, type MenuProps } from 'antd';
import { HomeOutlined, SettingOutlined, UserOutlined, TeamOutlined, SlackSquareOutlined, PlayCircleOutlined, MonitorOutlined, BarChartOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuRoutes } from '@/router/routes';
import { usePermission } from '@/hooks/usePermission';

const iconMap: Record<string, React.ReactNode> = {
  Home: <HomeOutlined />,
  Setting: <SettingOutlined />,
  User: <UserOutlined />,
  Team: <TeamOutlined />,
  TaskSquare: <SlackSquareOutlined />,
  PlayCircle: <PlayCircleOutlined />,
  Monitor: <MonitorOutlined />,
  BarChart3: <BarChartOutlined />,
};

const parentMenuMap: Record<string, { title: string; icon: string; key: string }> = {
  '系统管理': { title: '系统管理', icon: 'Setting', key: '/system' },
  '训练任务': { title: '训练任务', icon: 'TaskSquare', key: '/train' },
  '资源管理': { title: '资源管理', icon: 'Monitor', key: '/resource' },
};

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>(['/system', '/train', '/resource']);
  const { checkPermission } = usePermission();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const groupedRoutes = menuRoutes.reduce((acc, route) => {
    const parentTitle = route.meta.parentTitle;
    if (parentTitle && parentMenuMap[parentTitle]) {
      if (!acc[parentTitle]) {
        acc[parentTitle] = [];
      }
      acc[parentTitle].push(route);
    } else {
      acc['root'] = acc['root'] || [];
      acc['root'].push(route);
    }
    return acc;
  }, {} as Record<string, typeof menuRoutes>);

  const getMenuItems = (): MenuProps['items'] => {
    const items: MenuProps['items'] = [];

    if (groupedRoutes['root']) {
      groupedRoutes['root'].forEach((route) => {
        if (route.meta.permission && !checkPermission(route.meta.permission)) {
          return;
        }
        items.push({
          key: route.path,
          icon: iconMap[route.meta.icon || ''],
          label: route.meta.title,
        });
      });
    }

    Object.keys(parentMenuMap).forEach((parentTitle) => {
      const parent = parentMenuMap[parentTitle];
      const children = groupedRoutes[parentTitle] || [];

      const hasPermission = children.some((child) => !child.meta.permission || checkPermission(child.meta.permission));
      if (!hasPermission) return;

      const subItems: MenuProps['items'] = children.map((route) => {
        if (route.meta.permission && !checkPermission(route.meta.permission)) {
          return null;
        }
        return {
          key: route.path,
          icon: iconMap[route.meta.icon || ''],
          label: route.meta.title,
        };
      }).filter(Boolean) as MenuProps['items'];

      if (!subItems || subItems.length === 0) return;

      items.push({
        key: parent.key,
        icon: iconMap[parent.icon],
        label: parent.title,
        children: subItems,
      });
    });

    return items;
  };

  const selectedKey = location.pathname || '/';

  return (
    <aside
      style={{
        width: 220,
        minHeight: '100vh',
        background: '#001529',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 99,
      }}
    >
      <div
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          borderBottom: '1px solid #002140',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: '#1677ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <RocketOutlined style={{ fontSize: 16, color: '#fff' }} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>AI训练平台</div>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>Training Platform</div>
        </div>
      </div>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        onClick={handleMenuClick}
        style={{
          height: 'calc(100vh - 60px)',
          borderRight: 0,
          background: '#001529',
        }}
        items={getMenuItems()}
      />
    </aside>
  );
};
