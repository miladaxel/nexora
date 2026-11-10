import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatToman, toPersianDigits } from '@/lib/formatters';

interface MonthlyBarChartProps {
  data: Array<{
    month: string;
    revenue: number;
    mrr: number;
  }>;
  height?: number;
}

export const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({
  data,
  height = 300,
}) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.6)" />
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `${toPersianDigits(Math.round(val / 1_000_000))} م`}
            dx={-8}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card/95 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl text-right">
                    <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between gap-4 text-xs py-0.5">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          {entry.name === 'revenue' ? 'کل درآمد ماهیانه' : 'درآمد تکرارشونده (MRR)'}:
                        </span>
                        <span className="font-bold text-foreground">
                          {formatToman(Number(entry.value))}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="top"
            align="left"
            height={36}
            formatter={(value) => {
              const labelMap: Record<string, string> = {
                revenue: 'کل درآمد ماهیانه',
                mrr: 'درآمد تکرارشونده (MRR)',
              };
              return <span className="text-xs text-muted-foreground mr-1">{labelMap[value] || value}</span>;
            }}
          />
          <Bar dataKey="revenue" name="revenue" fill="#4F46E5" radius={[6, 6, 0, 0]} maxBarSize={32} />
          <Bar dataKey="mrr" name="mrr" fill="#06B6D4" radius={[6, 6, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
