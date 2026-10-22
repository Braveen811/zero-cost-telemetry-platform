import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Cpu, Server, Database, RefreshCw } from 'lucide-react';

export default function App() {
  const [metrics, setMetrics] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [totalExecs, setTotalExecs] = useState(0);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/v1/query?query=arch_process_executions_total');
      const data = await res.json();
      
      if (data.status === 'success' && data.data.result) {
        const parsed = data.data.result
          .map((item) => ({
            name: item.metric.process_name || 'unknown',
            count: parseInt(item.value[1], 10) || 0,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setMetrics(parsed);
        setTotalExecs(parsed.reduce((acc, curr) => acc + curr.count, 0));
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to fetch Prometheus data:', err);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 p-8">
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-6 border-b border-[#8A0F13]/50">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Activity className="h-7 w-7 text-[#B21318]" />
            Kernel Telemetry Platform
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Arch Linux eBPF &bull; Prometheus Engine &bull; LocalStack AWS
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-[#8A0F13]/20 border border-[#8A0F13] px-3 py-1.5 rounded-full text-slate-300">
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#B21318]" />
          Live &bull; Synced {lastUpdated}
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#8A0F13]/10 border border-[#8A0F13]/40 p-5 rounded-xl flex items-center justify-between shadow-[0_4px_15px_rgba(74,8,10,0.5)]">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Observed Events</p>
              <p className="text-2xl font-bold text-white mt-1">{totalExecs}</p>
            </div>
            <Cpu className="h-8 w-8 text-[#B21318]" />
          </div>
          <div className="bg-[#8A0F13]/10 border border-[#8A0F13]/40 p-5 rounded-xl flex items-center justify-between shadow-[0_4px_15px_rgba(74,8,10,0.5)]">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Probe Hook</p>
              <p className="text-base font-semibold text-slate-200 mt-1">sys_enter_execve</p>
            </div>
            <Server className="h-8 w-8 text-[#B21318]" />
          </div>
          <div className="bg-[#8A0F13]/10 border border-[#8A0F13]/40 p-5 rounded-xl flex items-center justify-between shadow-[0_4px_15px_rgba(74,8,10,0.5)]">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Cloud Storage</p>
              <p className="text-base font-semibold text-slate-200 mt-1">s3://telemetry-archive</p>
            </div>
            <Database className="h-8 w-8 text-[#B21318]" />
          </div>
        </div>

        <div className="bg-[#8A0F13]/5 border border-[#8A0F13]/30 p-6 rounded-xl shadow-[0_4px_20px_rgba(74,8,10,0.4)]">
          <h2 className="text-lg font-semibold text-white mb-4">Top Linux Executed Binaries Captured In-Kernel</h2>
          <div className="h-72 w-full">
            {metrics.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                Awaiting kernel metrics...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} angle={-25} textAnchor="end" />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#4A080A', borderRadius: '8px' }} itemStyle={{ color: '#B21318' }} />
                  <Bar dataKey="count" fill="#B21318" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}