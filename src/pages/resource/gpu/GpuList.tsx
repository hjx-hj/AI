import { useState, useEffect } from 'react';
import { Card, Tag, Progress, Statistic, Row, Col, Spin } from 'antd';
import { BaseTable } from '@/components/BaseTable';
import { SearchForm } from '@/components/SearchForm';
import { PieChart } from '@/components/PieChart';
import { GpuStatusEnum, GpuStatusMap, GpuStatusColorMap } from '@/types/resource';
import { getGpuList, getGpuStatistics, getServerList } from '@/api/gpu';

export const GpuList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Array<{ id: string; name: string; model: string; serverName: string; totalMemory: number; usedMemory: number; memoryUsage: number; temperature: number; utilization: number; status: GpuStatusEnum; currentTaskName?: string }>>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [statistics, setStatistics] = useState<{ total: number; idle: number; busy: number; full: number; offline: number; totalMemory: number; usedMemory: number; utilizationRate: number } | null>(null);
  const [servers, setServers] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    fetchGpus();
    fetchStatistics();
    fetchServers();
  }, [pagination]);

  const fetchGpus = async (status?: GpuStatusEnum, serverId?: string) => {
    setLoading(true);
    try {
      const { data } = await getGpuList({ ...pagination, status, serverId });
      setDataSource(data.list);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch GPUs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const { data } = await getGpuStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const fetchServers = async () => {
    try {
      const { data } = await getServerList();
      setServers(data.map((s: { id: string; name: string }) => ({ id: s.id, name: s.name })));
    } catch (error) {
      console.error('Failed to fetch servers:', error);
    }
  };

  const handleSearch = (values: Record<string, unknown>) => {
    fetchGpus(values.status as GpuStatusEnum, values.serverId as string);
  };

  const handleReset = () => {
    fetchGpus();
  };

  const columns = [
    { title: 'GPU名称', dataIndex: 'name', key: 'name' },
    { title: '型号', dataIndex: 'model', key: 'model' },
    { title: '所属服务器', dataIndex: 'serverName', key: 'serverName' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: GpuStatusEnum) => (
        <Tag color={GpuStatusColorMap[status]}>
          {GpuStatusMap[status]}
        </Tag>
      ),
    },
    {
      title: '显存使用',
      key: 'memory',
      render: (_: unknown, record: typeof dataSource[0]) => (
        <div>
          <Progress percent={record.memoryUsage} size="small" />
          <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>
            {record.usedMemory}/{record.totalMemory} GB
          </span>
        </div>
      ),
    },
    {
      title: '温度',
      dataIndex: 'temperature',
      key: 'temperature',
      render: (temp: number) => (
        <span style={{ color: temp > 80 ? '#ff4d4f' : '#52c41a' }}>{temp}°C</span>
      ),
    },
    {
      title: '使用率',
      dataIndex: 'utilization',
      key: 'utilization',
      render: (util: number) => (
        <Progress percent={util} size="small" strokeColor={util > 90 ? '#ff4d4f' : '#1890ff'} />
      ),
    },
    {
      title: '当前任务',
      dataIndex: 'currentTaskName',
      key: 'currentTaskName',
      ellipsis: true,
      render: (name: string | undefined) => name || '-',
    },
  ];

  const statusData = statistics
    ? [
      { name: '空闲', value: statistics.idle, color: '#52c41a' },
      { name: '占用中', value: statistics.busy, color: '#1890ff' },
      { name: '满载', value: statistics.full, color: '#ff4d4f' },
      { name: '离线', value: statistics.offline, color: '#d9d9d9' },
    ]
    : [];

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="GPU总数" value={statistics?.total || 0} suffix="张" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="空闲GPU" value={statistics?.idle || 0} suffix="张" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="总显存" value={statistics?.totalMemory || 0} suffix="GB" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="显存使用率" value={statistics?.utilizationRate || 0} suffix="%" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card title="GPU状态分布">
            <PieChart data={statusData} height={250} />
          </Card>
        </Col>
        <Col span={16}>
          <Card title="GPU资源列表">
            <SearchForm
              fields={[
                {
                  name: 'status',
                  type: 'select',
                  label: '状态',
                  placeholder: '请选择状态',
                  options: Object.entries(GpuStatusMap).map(([value, label]) => ({ value, label })),
                },
                {
                  name: 'serverId',
                  type: 'select',
                  label: '服务器',
                  placeholder: '请选择服务器',
                  options: servers.map((s) => ({ value: s.id, label: s.name })),
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
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};