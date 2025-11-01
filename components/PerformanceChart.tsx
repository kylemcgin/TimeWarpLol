'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface PerformanceChartProps {
  title: string;
  data: any[];
  dataKey?: string;
  color?: string;
  type?: 'line' | 'radar';
}

export default function PerformanceChart({
  title,
  data,
  dataKey = 'value',
  color = '#c89b3c',
  type = 'line',
}: PerformanceChartProps) {
  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-gradient mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 155, 60, 0.1)" />
            <XAxis
              dataKey="date"
              stroke="var(--foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="var(--foreground)" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : (
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(200, 155, 60, 0.3)" />
            <PolarAngleAxis
              dataKey="category"
              stroke="var(--foreground)"
              style={{ fontSize: '12px' }}
            />
            <PolarRadiusAxis stroke="var(--foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
            />
            <Radar
              name="Performance"
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.5}
            />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
