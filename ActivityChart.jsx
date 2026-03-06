import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { hour: '00', detections: 12, alerts: 3 },
  { hour: '02', detections: 8, alerts: 1 },
  { hour: '04', detections: 5, alerts: 0 },
  { hour: '06', detections: 15, alerts: 4 },
  { hour: '08', detections: 45, alerts: 12 },
  { hour: '10', detections: 62, alerts: 18 },
  { hour: '12', detections: 78, alerts: 22 },
  { hour: '14', detections: 85, alerts: 25 },
  { hour: '16', detections: 92, alerts: 28 },
  { hour: '18', detections: 68, alerts: 15 },
  { hour: '20', detections: 42, alerts: 8 },
  { hour: '22', detections: 25, alerts: 5 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-100 border border-surface-50 rounded-lg p-3 shadow-xl">
        <p className="text-xs text-gray-400 font-mono mb-2">{label}:00</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-400">{entry.name}:</span>
            <span className="text-white font-mono">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ActivityChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card h-full"
    >
      <div className="card-header">
        <h3 className="text-sm font-semibold text-white">Hourly Activity</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-accent-cyan" />
            <span className="text-xs text-gray-500">Detections</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-accent-orange" />
            <span className="text-xs text-gray-500">Alerts</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="detectionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="alertGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff8800" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff8800" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
            <XAxis 
              dataKey="hour" 
              stroke="#484f58"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#484f58"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="detections"
              stroke="#00f5ff"
              strokeWidth={2}
              fill="url(#detectionGradient)"
              name="Detections"
            />
            <Area
              type="monotone"
              dataKey="alerts"
              stroke="#ff8800"
              strokeWidth={2}
              fill="url(#alertGradient)"
              name="Alerts"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}