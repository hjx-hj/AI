import { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Modal, message, Progress, Spin } from 'antd';
import { PlusOutlined, PlayCircleOutlined, PauseCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { BaseTable } from '@/components/BaseTable';
import { ModalForm } from '@/components/ModalForm';
import { SearchForm } from '@/components/SearchForm';
import { AuthBtn } from '@/components/AuthBtn';
import { PermissionEnum } from '@/types/auth';
import { TaskStatusEnum, TaskStatusMap, TaskStatusColorMap } from '@/types/train';
import { getTaskList, createTask, startTask, pauseTask, stopTask, getTaskLogs } from '@/api/train';

export const TaskList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Array<{ id: string; name: string; modelName: string; dataset: string; status: TaskStatusEnum; progress: number; gpuCount: number; duration: string; loss: number; accuracy: number; createTime: string }>>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [modalVisible, setModalVisible] = useState(false);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [logs, setLogs] = useState<Array<{ id: string; timestamp: string; level: string; message: string }>>([]);

  useEffect(() => {
    fetchTasks();
  }, [pagination]);

  const fetchTasks = async (status?: TaskStatusEnum, keyword = '') => {
    setLoading(true);
    try {
      const { data } = await getTaskList({ ...pagination, status, keyword });
      setDataSource(data.list);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values: Record<string, unknown>) => {
    fetchTasks(values.status as TaskStatusEnum, values.keyword as string);
  };

  const handleReset = () => {
    fetchTasks();
  };

  const handleStart = async (id: string) => {
    try {
      await startTask(id);
      message.success('任务已启动');
      fetchTasks();
    } catch (error) {
      message.error('启动失败');
    }
  };

  const handlePause = async (id: string) => {
    try {
      await pauseTask(id);
      message.success('任务已暂停');
      fetchTasks();
    } catch (error) {
      message.error('暂停失败');
    }
  };

  const handleStop = async (id: string) => {
    try {
      await stopTask(id);
      message.success('任务已终止');
      fetchTasks();
    } catch (error) {
      message.error('终止失败');
    }
  };

  const handleViewLogs = async () => {
    setLogModalVisible(true);
    try {
      const { data } = await getTaskLogs('1');
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const handleModalOk = async (values: Record<string, unknown>) => {
    try {
      await createTask(values as { name: string; modelName: string; dataset: string; gpuIds: string[]; learningRate: number; batchSize: number; epochs: number });
      message.success('创建成功');
      setModalVisible(false);
      fetchTasks();
    } catch (error) {
      message.error('创建失败');
    }
  };

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '模型名称', dataIndex: 'modelName', key: 'modelName' },
    { title: '数据集', dataIndex: 'dataset', key: 'dataset' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: TaskStatusEnum) => (
        <Tag color={TaskStatusColorMap[status]}>
          {TaskStatusMap[status]}
        </Tag>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      ),
    },
    { title: 'GPU数量', dataIndex: 'gpuCount', key: 'gpuCount' },
    { title: '运行时长', dataIndex: 'duration', key: 'duration' },
    { title: '损失', dataIndex: 'loss', key: 'loss', render: (v: number) => v?.toFixed(4) },
    { title: '准确率', dataIndex: 'accuracy', key: 'accuracy', render: (v: number) => `${(v * 100).toFixed(2)}%` },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: typeof dataSource[0]) => (
        <Space>
          <AuthBtn permission={PermissionEnum.TASK_VIEW}>
            <Button type="link" icon={<EyeOutlined />} onClick={handleViewLogs}>
              日志
            </Button>
          </AuthBtn>
          {record.status === TaskStatusEnum.PENDING && (
            <AuthBtn permission={PermissionEnum.TASK_START}>
              <Button type="link" icon={<PlayCircleOutlined />} onClick={() => handleStart(record.id)}>
                启动
              </Button>
            </AuthBtn>
          )}
          {record.status === TaskStatusEnum.RUNNING && (
            <AuthBtn permission={PermissionEnum.TASK_PAUSE}>
              <Button type="link" icon={<PauseCircleOutlined />} onClick={() => handlePause(record.id)}>
                暂停
              </Button>
            </AuthBtn>
          )}
          {(record.status === TaskStatusEnum.RUNNING || record.status === TaskStatusEnum.PAUSED) && (
            <AuthBtn permission={PermissionEnum.TASK_STOP}>
              <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => handleStop(record.id)}>
                终止
              </Button>
            </AuthBtn>
          )}
        </Space>
      ),
    },
  ];

  const logColumns = [
    { title: '时间', dataIndex: 'timestamp', key: 'timestamp' },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag color={{ info: 'blue', warn: 'orange', error: 'red', success: 'green' }[level] || 'gray'}>
          {level}
        </Tag>
      ),
    },
    { title: '日志内容', dataIndex: 'message', key: 'message', ellipsis: true },
  ];

  const handleAdd = () => {
    setModalVisible(true);
  };

  return (
    <Card
      title="训练任务管理"
      extra={
        <AuthBtn permission={PermissionEnum.TASK_ADD} type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          创建任务
        </AuthBtn>
      }
    >
      <SearchForm
        fields={[
          { name: 'keyword', type: 'input', label: '关键词', placeholder: '任务名/模型名' },
          {
            name: 'status',
            type: 'select',
            label: '状态',
            placeholder: '请选择状态',
            options: Object.entries(TaskStatusMap).map(([value, label]) => ({ value, label })),
          },
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
        title="创建训练任务"
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        width={600}
        fields={[
          { name: 'name', type: 'input', label: '任务名称', placeholder: '请输入任务名称', rules: [{ required: true }] },
          { name: 'modelName', type: 'input', label: '模型名称', placeholder: '请输入模型名称', rules: [{ required: true }] },
          { name: 'dataset', type: 'input', label: '数据集', placeholder: '请输入数据集名称', rules: [{ required: true }] },
          { name: 'learningRate', type: 'number', label: '学习率', placeholder: '请输入学习率' },
          { name: 'batchSize', type: 'number', label: '批次大小', placeholder: '请输入批次大小' },
          { name: 'epochs', type: 'number', label: '训练轮数', placeholder: '请输入训练轮数' },
        ]}
      />
      <Modal
        title="训练日志"
        open={logModalVisible}
        onCancel={() => setLogModalVisible(false)}
        width={800}
      >
        <Spin spinning={loading}>
          <Table
            columns={logColumns}
            dataSource={logs}
            rowKey="id"
            pagination={false}
            scroll={{ y: 400 }}
          />
        </Spin>
      </Modal>
    </Card>
  );
};