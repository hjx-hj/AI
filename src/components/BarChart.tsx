import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartProps {
  data: Record<string, unknown>[];
  xDataKey: string;
  series: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
  height?: number;
  title?: string;
}

export const BarChart = ({ data, xDataKey, series, height = 300, title }: BarChartProps) => {
  return (
    <div>
      {title && <h4 style={{ marginBottom: 16, fontSize: 14 }}>{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {series.map((s) => (
            <Bar key={s.dataKey} dataKey={s.dataKey} name={s.name} fill={s.color} />
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};