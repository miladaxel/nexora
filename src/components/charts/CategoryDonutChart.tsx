import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatToman, toPersianDigits } from '@/lib/formatters';

interface CategorySlice {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface CategoryDonutChartProps {
  data: CategorySlice[];
  height?: number;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  data,
  height = 280,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const entry = payload[0].payload as CategorySlice;
                  return (
                    <div className="bg-card/95 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl text-right">
                      <p className="text-xs font-semibold text-foreground mb-1">{entry.name}</p>
                      <div className="flex items-center justify-between gap-4 text-xs">
                        <span className="text-muted-foreground">درآمد:</span>
                        <span className="font-bold text-foreground">
                          {formatToman(entry.value)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-xs mt-1">
                        <span className="text-muted-foreground">سهم:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {toPersianDigits(entry.percentage)}٪
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              innerRadius={68}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-muted-foreground font-medium">تفکیک درآمد</span>
          <span className="text-sm font-bold text-foreground mt-0.5">محصولات</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border/40">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2 text-xs p-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground truncate">{item.name}</span>
            </div>
            <span className="font-semibold text-foreground shrink-0">
              {toPersianDigits(item.percentage)}٪
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
