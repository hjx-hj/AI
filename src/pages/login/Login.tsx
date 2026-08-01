import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '@/api/auth';
import { useUserStore } from '@/store/user';

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useUserStore();

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await login(values);
      setToken(data.token);
      setUser(data.user);
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f7fa',
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 8,
          border: '1px solid #f0f0f0',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 48,
              height: 48,
              margin: '0 auto 16px',
              borderRadius: 8,
              background: '#1677ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RocketOutlined style={{ fontSize: 24, color: '#fff' }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1f1f1f', marginBottom: 8 }}>
            AI模型训练管理平台
          </h2>
          <p style={{ color: '#8c8c8c', fontSize: 13 }}>Training Platform</p>
        </div>
        <Form name="login" onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
            style={{ marginBottom: 20 }}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
            style={{ marginBottom: 24 }}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              登 录
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center', color: '#8c8c8c', fontSize: 13 }}>
            用户名: <span style={{ color: '#595959' }}>admin</span> | 密码:{' '}
            <span style={{ color: '#595959' }}>123456</span>
          </div>
        </Form>
      </Card>
    </div>
  );
};
