import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'cyan' }) {
  const colorClasses = {
    cyan: 'from-primary-500/20 to-primary-600/5 border-primary-500/30 text-accent-cyan',
    green: 'from-green-500/20 to-green-600/5 border-green-500/30 text-accent-green',
    orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/30 text-accent-orange',
    red: 'from-red-500/20 to-red-600/5 border-red-500/30 text-accent-red',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400',
  };

  const glowClasses = {
    cyan: 'hover:shadow-primary-500/20',
    green: 'hover:shadow-green-500/20',
    orange: 'hover:shadow-orange-500/20',
    red: 'hover:shadow-red-500/20',
    purple: 'hover:shadow-purple-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={clsx(
        'relative overflow-hidden rounded-lg border bg-gradient-to-br p-5 transition-all duration-300',
        colorClasses[color],
        `hover:shadow-lg ${glowClasses[color]}`
      )}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-3xl font-bold font-mono mt-2 text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1 font-mono">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className={clsx(
              'w-12 h-12 rounded-lg flex items-center justify-center bg-black/20 backdrop-blur-sm',
              colorClasses[color].split(' ').pop()
            )}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>

        {trend && (
          <div className="flex items-center gap-1 mt-3">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-accent-green" />
            ) : (
              <TrendingDown className="w-4 h-4 text-accent-red" />
            )}
            <span className={clsx(
              'text-xs font-medium',
              trend === 'up' ? 'text-accent-green' : 'text-accent-red'
            )}>
              {trendValue}
            </span>
            <span className="text-xs text-gray-500 ml-1">vs last hour</span>
          </div>
        )}
      </div>

      {/* Animated corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
    </motion.div>
  );
}