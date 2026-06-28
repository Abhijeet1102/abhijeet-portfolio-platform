"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Loader2, Activity, Users, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';

const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

export default function AnalyticsDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: async () => {
      const res = await api.get('/analytics/summary?days=30');
      return res.data.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h3 className="text-lg font-medium">No Analytics Data</h3>
        <p className="text-muted-foreground mt-2">
          Waiting for visitors to arrive at your portfolio.
        </p>
      </div>
    );
  }

  const { totalVisits, uniqueVisitors, dailyVisits, topPages, devices } = data;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="w-8 h-8" />
          Analytics
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor your portfolio traffic, visitors, and engagement over the last 30 days.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Views</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{totalVisits}</div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Unique Visitors</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{uniqueVisitors}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-xl border bg-card shadow-sm p-6 lg:col-span-4">
          <h3 className="font-semibold text-lg mb-6">Traffic Overview (30 Days)</h3>
          <div className="h-[300px]">
            {dailyVisits && dailyVisits.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyVisits}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="_id" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No traffic data available yet
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm p-6 lg:col-span-3">
          <h3 className="font-semibold text-lg mb-6">Device Breakdown</h3>
          <div className="h-[300px]">
            {devices && devices.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={devices} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }} />
                  <YAxis 
                    dataKey="_id" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'currentColor' }} 
                  />
                  <Tooltip contentStyle={{ borderRadius: '8px' }} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {devices.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No device data available yet
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-6 border-b">
          <h3 className="font-semibold text-lg">Top Pages</h3>
        </div>
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Page Path</th>
                <th scope="col" className="px-6 py-3 font-medium text-right">Views</th>
              </tr>
            </thead>
            <tbody>
              {topPages?.map((page: any, index: number) => (
                <tr key={index} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{page._id === '/' ? '/ (Home)' : page._id}</td>
                  <td className="px-6 py-4 text-right font-medium">{page.count}</td>
                </tr>
              ))}
              {(!topPages || topPages.length === 0) && (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-muted-foreground">
                    No page views recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}