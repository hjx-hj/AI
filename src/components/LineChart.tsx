import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LineChartProps {
  data: Record<string, unknown>[];
  xDataKey: string;
  series: Array<{
    dataKey: string;
    name: string;
    color: string;
    type?: 'monotone' | 'linear';
  }>;
  height?: number;
  title?: string;
}

export const LineChart = ({ data, xDataKey, series, height = 300, title }: LineChartProps) => {
  return (
    <div>
      {title && <h4 style={{ marginBottom: 16, fontSize: 14 }}>{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {series.map((s) => (
            <Line
              key={s.dataKey}
              type={s.type || 'monotone'}
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
            />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};