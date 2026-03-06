import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Person', value: 45, color: '#00f5ff' },
  { name: 'Vehicle', value: 25, color: '#00ff88' },
  { name: 'Object', value: 15, color: '#ff8800' },
  { name: 'Crowd', value: 10, color: '#a855f7' },
  { name: 'Other', value: 5, color: '#6b7280' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-100 border border-surface-50 rounded-lg p-3 shadow-xl">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: payload[0].payload.color }} 
          />
          <span className="text-gray-400 text-sm">{payload[0].name}:</span>
          <span className="text-white font-mono text-sm">{payload[0].value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function DetectionBreakdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card h-full"
    >
      <div className="card-header">
        <h3 className="text-sm font-semibold text-white">Detection Breakdown</h3>
        <span className="text-xs text-gray-500 font-mono">Today</span>
      </div>
      
      <div className="p-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 p-2 bg-surface-50 rounded">
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-400 truncate">{item.name}</span>
              <span className="text-xs text-white font-mono ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
