import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Tag, Table, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, SlackSquareOutlined, PlayCircleOutlined, MonitorOutlined, BarChartOutlined, RiseOutlined, CloudOutlined, DatabaseOutlined } from '@ant-design/icons';
import { LineChart } from '@/components/LineChart';
import { PieChart } from '@/components/PieChart';
import { BarChart } from '@/components/BarChart';
import { getDashboardOverview } from '@/api/dashboard';
import { getTaskList } from '@/api/train';
import { TaskStatusMap, TaskStatusColorMap } from '@/types/train';

const iconMap: Record<string, React.ReactNode> = {
  TaskSquare: <SlackSquareOutlined />,
  PlayCircle: <PlayCircleOutlined />,
  Monitor: <MonitorOutlined />,
  BarChart3: <BarChartOutlined />,
  TrendingUp: <RiseOutlined />,
  Cpu: <CloudOutlined />,
  Database: <DatabaseOutlined />,
};

const statGradientMap: Record<string, string> = {
  '#1677ff': '#1677ff',
  '#52c41a': '#52c41a',
  '#fa8c16': '#fa8c16',
  '#722ed1': '#722ed1',
};

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Array<{ title: string; value: number; unit: string; trend: number; icon: string; color: string }>>([]);
  const [recentTasks, setRecentTasks] = useState<Array<{ id: string; name: string; status: string; progress: number; createTime: string }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [overviewRes, tasksRes] = await Promise.all([
          getDashboardOverview(),
          getTaskList({ pageNum: 1, pageSize: 5 }),
        ]);
        setStats(overviewRes.data.statCards);
        setRecentTasks(tasksRes.data.list.map((task: { id: string; name: string; status: string; progress: number; createTime: string }) => ({
          id: task.id,
          name: task.name,
          status: task.status,
          progress: task.progress,
          createTime: task.createTime,
        })));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mockTrainingMetrics = Array.from({ length: 20 }, (_, i) => ({
    time: `12:${String(i * 3).padStart(2, '0')}`,
    loss: 0.5 - i * 0.015,
    accuracy: 0.7 + i * 0.01,
    valLoss: 0.55 - i * 0.012,
    valAccuracy: 0.68 + i * 0.009,
  }));

  const mockGpuUsage = [
    { name: 'GPU-01', value: 95, color: '#1890ff' },
    { name: 'GPU-02', value: 88, color: '#52c41a' },
    { name: 'GPU-03', value: 92, color: '#722ed1' },
    { name: 'GPU-04', value: 75, color: '#fa8c16' },
    { name: 'GPU-05', value: 60, color: '#eb2f96' },
  ];

  const mockDailyData = Array.from({ length: 7 }, (_, i) => ({
    date: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
    usage: 1500 + Math.random() * 500,
    tasks: 20 + Math.floor(Math.random() * 15),
  }));

  const recentTasksColumns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={TaskStatusColorMap[status as keyof typeof TaskStatusColorMap]}>
          {TaskStatusMap[status as keyof typeof TaskStatusColorMap]}
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
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  ];

  return (
    <Spin spinning={loading}>
      <div style={{ padding: '0 0 24px' }}>
        <Row gutter={[20, 20]}>
          {stats.map((stat) => (
            <Col key={stat.title} span={6}>
              <Card
                hoverable
                style={{
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: 3,
                    background: statGradientMap[stat.color] || stat.color,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
                  <div>
                    <p style={{ color: '#8c8c8c', marginBottom: 8, fontSize: 13 }}>{stat.title}</p>
                    <Statistic
                      value={stat.value}
                      suffix={stat.unit}
                      valueStyle={{ color: stat.color, fontSize: 32, fontWeight: 700, lineHeight: '1.2' }}
                    />
                  </div>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      background: `${stat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      color: stat.color,
                    }}
                  >
                    {iconMap[stat.icon]}
                  </div>
                </div>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center' }}>
                  {stat.trend > 0 ? (
                    <ArrowUpOutlined style={{ color: '#52c41a', marginRight: 6, fontSize: 14 }} />
                  ) : (
                    <ArrowDownOutlined style={{ color: '#ff4d4f', marginRight: 6, fontSize: 14 }} />
                  )}
                  <span style={{ color: stat.trend > 0 ? '#52c41a' : '#ff4d4f', fontSize: 13, fontWeight: 500 }}>
                    {Math.abs(stat.trend)}%
                  </span>
                  <span style={{ color: '#bfbfbf', fontSize: 12, marginLeft: 8 }}>较昨日</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
          <Col span={16}>
            <Card
              title={
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1f1f1f' }}>训练指标趋势</span>
              }
              style={{ borderRadius: 8, border: '1px solid #f0f0f0' }}
            >
              <LineChart
                data={mockTrainingMetrics}
                xDataKey="time"
                series={[
                  { dataKey: 'loss', name: '损失', color: '#ff6b6b' },
                  { dataKey: 'accuracy', name: '准确率', color: '#10b981' },
                  { dataKey: 'valLoss', name: '验证损失', color: '#f59e0b' },
                  { dataKey: 'valAccuracy', name: '验证准确率', color: '#6366f1' },
                ]}
                height={320}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title={
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1f1f1f' }}>GPU资源分布</span>
              }
              style={{ borderRadius: 8, border: '1px solid #f0f0f0' }}
            >
              <PieChart data={mockGpuUsage} height={320} />
            </Card>
          </Col>
        </Row>
        <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
          <Col span={12}>
            <Card
              title={
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1f1f1f' }}>每日算力消耗</span>
              }
              style={{ borderRadius: 8, border: '1px solid #f0f0f0' }}
            >
              <BarChart
                data={mockDailyData}
                xDataKey="date"
                series={[
                  { dataKey: 'usage', name: '算力消耗(小时)', color: '#3b82f6' },
                  { dataKey: 'tasks', name: '任务数', color: '#10b981' },
                ]}
                height={280}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title={
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1f1f1f' }}>最近任务</span>
              }
              style={{ borderRadius: 8, border: '1px solid #f0f0f0' }}
            >
              <Table
                columns={recentTasksColumns}
                dataSource={recentTasks}
                rowKey="id"
                pagination={false}
                size="small"
                style={{ marginTop: 8 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};
