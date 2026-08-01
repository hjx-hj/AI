import { useState, useEffect } from 'react';
import { Card, Button, Space, Tag, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { BaseTable } from '@/components/BaseTable';
import { ModalForm } from '@/components/ModalForm';
import { SearchForm } from '@/components/SearchForm';
import { AuthBtn } from '@/components/AuthBtn';
import { PermissionEnum } from '@/types/auth';
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user';
import { getRoleList } from '@/api/role';
import { exportExcel } from '@/utils/export';

export const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Array<{ id: string; username: string; nickname: string; email: string; status: number; roleIds: string[]; createTime: string }>>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [roles, setRoles] = useState<Array<{ id: string; name: string }>>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<typeof dataSource[0] | undefined>(undefined);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [pagination]);

  const fetchUsers = async (keyword = '') => {
    setLoading(true);
    try {
      const { data } = await getUserList({ ...pagination, keyword });
      setDataSource(data.list);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data } = await getRoleList();
      setRoles(data.map((r: { id: string; name: string }) => ({ id: r.id, name: r.name })));
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const handleSearch = (values: Record<string, unknown>) => {
    fetchUsers(values.keyword as string);
  };

  const handleReset = () => {
    fetchUsers();
  };

  const handleEdit = (record: typeof dataSource[0]) => {
    setEditingUser(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      message.success('删除成功');
      fetchUsers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async (values: Record<string, unknown>) => {
    try {
      if (editingUser) {
        await updateUser({ id: editingUser.id, ...values } as { id: string });
        message.success('更新成功');
      } else {
        await createUser(values as { username: string; password: string; nickname: string; email: string; phone: string; roleIds: string[]; status: number });
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleExport = () => {
    exportExcel(dataSource, [
      { title: '用户名', dataIndex: 'username' },
      { title: '昵称', dataIndex: 'nickname' },
      { title: '邮箱', dataIndex: 'email' },
      { title: '状态', dataIndex: 'status' },
      { title: '创建时间', dataIndex: 'createTime' },
    ], '用户列表');
  };

  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '角色',
      dataIndex: 'roleIds',
      key: 'roleIds',
      render: (roleIds: string[]) => (
        <Space>
          {roleIds.map((id) => {
            const role = roles.find((r) => r.id === id);
            return <Tag key={id}>{role?.name || id}</Tag>;
          })}
        </Space>
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: typeof dataSource[0]) => (
        <Space>
          <AuthBtn permission={PermissionEnum.USER_EDIT}>
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
              编辑
            </Button>
          </AuthBtn>
          <AuthBtn permission={PermissionEnum.USER_DELETE}>
            <Popconfirm title="确定删除该用户吗？" onConfirm={() => handleDelete(record.id)}>
              <Button type="link" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </AuthBtn>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingUser(undefined);
    setModalVisible(true);
  };

  return (
    <Card
      title="用户管理"
      extra={
        <Space>
          <AuthBtn permission={PermissionEnum.EXPORT}>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出Excel
            </Button>
          </AuthBtn>
          <AuthBtn permission={PermissionEnum.USER_ADD} type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增用户
          </AuthBtn>
        </Space>
      }
    >
      <SearchForm
        fields={[
          { name: 'keyword', type: 'input', label: '关键词', placeholder: '用户名/昵称' },
        ]}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      <BaseTable
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          current: pagination.pageNum,
          pageSize: pagination.pageSize,
          total,
          onChange: (page, size) => setPagination({ pageNum: page, pageSize: size }),
        }}
      />
      <ModalForm
        visible={modalVisible}
        title={editingUser ? '编辑用户' : '新增用户'}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        initialValues={editingUser}
        fields={[
          { name: 'username', type: 'input', label: '用户名', placeholder: '请输入用户名', rules: [{ required: true }] },
          { name: 'nickname', type: 'input', label: '昵称', placeholder: '请输入昵称', rules: [{ required: true }] },
          { name: 'email', type: 'input', label: '邮箱', placeholder: '请输入邮箱', rules: [{ required: true, type: 'email' }] },
          { name: 'phone', type: 'input', label: '手机号', placeholder: '请输入手机号' },
          { name: 'password', type: 'password', label: '密码', placeholder: '请输入密码', rules: editingUser ? [] : [{ required: true }] },
          { name: 'roleIds', type: 'select', label: '角色', placeholder: '请选择角色', options: roles.map((r) => ({ value: r.id, label: r.name })) },
          { name: 'status', type: 'switch', label: '状态' },
        ]}
      />
    </Card>
  );
};