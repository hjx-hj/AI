import { useState, useEffect } from 'react';
import { Card, Button, Space, Tag, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { BaseTable } from '@/components/BaseTable';
import { ModalForm } from '@/components/ModalForm';
import { AuthBtn } from '@/components/AuthBtn';
import { PermissionEnum } from '@/types/auth';
import { getRoleList, createRole, updateRole, deleteRole } from '@/api/role';

const permissionOptions = [
  { value: 'user:view', label: '用户查看' },
  { value: 'user:add', label: '用户新增' },
  { value: 'user:edit', label: '用户编辑' },
  { value: 'user:delete', label: '用户删除' },
  { value: 'role:view', label: '角色查看' },
  { value: 'role:add', label: '角色新增' },
  { value: 'role:edit', label: '角色编辑' },
  { value: 'role:delete', label: '角色删除' },
  { value: 'task:view', label: '任务查看' },
  { value: 'task:add', label: '任务新增' },
  { value: 'task:start', label: '任务启动' },
  { value: 'task:pause', label: '任务暂停' },
  { value: 'task:stop', label: '任务终止' },
  { value: 'gpu:view', label: 'GPU查看' },
  { value: 'gpu:allocate', label: 'GPU分配' },
  { value: 'export', label: '导出' },
];

export const RoleList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Array<{ id: string; name: string; code: string; description: string; permissions: string[]; status: number; createTime: string }>>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<typeof dataSource[0] | undefined>(undefined);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data } = await getRoleList();
      setDataSource(data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: typeof dataSource[0]) => {
    setEditingRole(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRole(id);
      message.success('删除成功');
      fetchRoles();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async (values: Record<string, unknown>) => {
    try {
      if (editingRole) {
        await updateRole({ id: editingRole.id, ...values } as { id: string });
        message.success('更新成功');
      } else {
        await createRole(values as { name: string; code: string; description: string; menus: string[]; permissions: string[]; status: number });
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchRoles();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: '角色名称', dataIndex: 'name', key: 'name' },
    { title: '角色编码', dataIndex: 'code', key: 'code' },
    { title: '描述', dataIndex: 'description', key: 'description' },
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
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Space wrap>
          {permissions.map((p) => {
            const option = permissionOptions.find((o) => o.value === p);
            return <Tag key={p}>{option?.label || p}</Tag>;
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
          <AuthBtn permission={PermissionEnum.ROLE_EDIT}>
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
              编辑
            </Button>
          </AuthBtn>
          <AuthBtn permission={PermissionEnum.ROLE_DELETE}>
            <Popconfirm title="确定删除该角色吗？" onConfirm={() => handleDelete(record.id)}>
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
    setEditingRole(undefined);
    setModalVisible(true);
  };

  return (
    <Card
      title="角色管理"
      extra={
        <AuthBtn permission={PermissionEnum.ROLE_ADD} type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增角色
        </AuthBtn>
      }
    >
      <BaseTable
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={false}
      />
      <ModalForm
        visible={modalVisible}
        title={editingRole ? '编辑角色' : '新增角色'}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        initialValues={editingRole}
        width={600}
        fields={[
          { name: 'name', type: 'input', label: '角色名称', placeholder: '请输入角色名称', rules: [{ required: true }] },
          { name: 'code', type: 'input', label: '角色编码', placeholder: '请输入角色编码', rules: [{ required: true }] },
          { name: 'description', type: 'textarea', label: '描述', placeholder: '请输入角色描述' },
          { name: 'permissions', type: 'select', label: '权限', placeholder: '请选择权限', options: permissionOptions },
          { name: 'status', type: 'switch', label: '状态' },
        ]}
      />
    </Card>
  );
};