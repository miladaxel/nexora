import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { toPersianDigits } from '@/lib/formatters';

interface CustomerGrowthProps {
  data: Array<{
    month: string;
    active: number;
    churn?: number;
    newSignups?: number;
  }>;
  height?: number;
}

export const CustomerGrowthLineChart: React.FC<CustomerGrowthProps> = ({
  data,
  height = 300,
}) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
            tickFormatter={(val) => toPersianDigits(val)}
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
                          {entry.name === 'active'
                            ? 'مشتریان فعال'
                            : entry.name === 'newSignups'
                            ? 'عضویت جدید'
                            : 'ریزش مشتری'}:
                        </span>
                        <span className="font-bold text-foreground">
                          {toPersianDigits(Number(entry.value))} نفر
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
                active: 'مشتریان فعال',
                newSignups: 'ورود مشتریان جدید',
                churn: 'ریزش (Churn)',
              };
              return <span className="text-xs text-muted-foreground mr-1">{labelMap[value] || value}</span>;
            }}
          />

          <Line
            type="monotone"
            dataKey="active"
            name="active"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 3, fill: '#10B981' }}
            activeDot={{ r: 6 }}
          />

          <Line
            type="monotone"
            dataKey="newSignups"
            name="newSignups"
            stroke="#6366F1"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
