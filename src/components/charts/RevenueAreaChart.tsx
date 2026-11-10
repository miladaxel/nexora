import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatToman, toPersianDigits } from '@/lib/formatters';

interface RevenueDataPoint {
  month: string;
  revenue: number;
  target?: number;
  mrr?: number;
}

interface RevenueAreaChartProps {
  data: RevenueDataPoint[];
  height?: number;
  showComparison?: boolean;
}

export const RevenueAreaChart: React.FC<RevenueAreaChartProps> = ({
  data,
  height = 320,
  showComparison = true,
}) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
            </linearGradient>
          </defs>

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
                          {entry.name === 'revenue' ? 'درآمد کل' : 'هدف فروش'}:
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

          <Area
            type="monotone"
            dataKey="revenue"
            name="revenue"
            stroke="#4F46E5"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />

          {showComparison && (
            <Area
              type="monotone"
              dataKey="target"
              name="target"
              stroke="#06B6D4"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorTarget)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
