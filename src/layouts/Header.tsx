import { Dropdown, Avatar, Switch, Button, Space } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined, MoonOutlined, SunOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useUserStore } from '@/store/user';
import { useConfigStore } from '@/store/config';

export const Header = () => {
  const { user, logout: storeLogout } = useUserStore();
  const { theme, toggleTheme, watermarkEnabled, setWatermarkEnabled } = useConfigStore();

  const handleLogout = () => {
    storeLogout();
    window.location.href = '/login';
  };

  const menuItems = [
    { key: '1', label: '个人中心', icon: <UserOutlined /> },
    { key: '2', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout },
  ];

  return (
    <header
      style={{
        height: 56,
        background: theme === 'dark' ? '#1f1f1f' : '#fff',
        borderBottom: '1px solid ' + (theme === 'dark' ? '#303030' : '#f0f0f0'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'fixed',
        right: 0,
        left: 220,
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 500, color: theme === 'dark' ? '#fff' : '#1f1f1' }}>
        AI模型训练可视化管理平台
      </div>
      <Space size={16}>
        <Switch
          checked={theme === 'dark'}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
        />
        <Switch checked={watermarkEnabled} onChange={setWatermarkEnabled} />
        <Button
          type="text"
          icon={theme === 'dark' ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          onClick={() => document.documentElement.requestFullscreen?.()}
        />
        <Dropdown menu={{ items: menuItems }}>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '4px 8px', borderRadius: 4 }}>
            <Avatar
              icon={<UserOutlined />}
              size={32}
              style={{
                background: '#1677ff',
              }}
            />
            <span style={{ marginLeft: 8, color: theme === 'dark' ? '#fff' : '#1f1f1f', fontWeight: 500 }}>{user?.nickname || '用户'}</span>
          </div>
        </Dropdown>
      </Space>
    </header>
  );
};
