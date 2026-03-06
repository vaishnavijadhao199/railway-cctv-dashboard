import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

const mockAlerts = [
  {
    id: 1,
    type: 'Intrusion Detected',
    severity: 'critical',
    location: 'Track 4 - Level Crossing',
    camera: 'TC4-02',
    time: new Date(Date.now() - 2 * 60 * 1000),
    status: 'new',
  },
  {
    id: 2,
    type: 'Crowd Alert',
    severity: 'high',
    location: 'Platform 3 - Main Entrance',
    camera: 'P3-01',
    time: new Date(Date.now() - 8 * 60 * 1000),
    status: 'acknowledged',
  },
  {
    id: 3,
    type: 'Unattended Object',
    severity: 'medium',
    location: 'Station Hall - East Wing',
    camera: 'SH-E3',
    time: new Date(Date.now() - 15 * 60 * 1000),
    status: 'new',
  },
  {
    id: 4,
    type: 'Camera Offline',
    severity: 'low',
    location: 'Yard Section B',
    camera: 'YB-05',
    time: new Date(Date.now() - 30 * 60 * 1000),
    status: 'resolved',
  },
];

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    color: 'accent-red',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
  },
  high: {
    icon: AlertCircle,
    color: 'accent-orange',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  medium: {
    icon: Info,
    color: 'primary-400',
    bg: 'bg-primary-500/10',
    border: 'border-primary-500/30',
  },
  low: {
    icon: Info,
    color: 'gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
  },
};

export default function AlertFeed() {
  return (
    <div className="card h-full">
      <div className="card-header">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-accent-orange" />
          Recent Alerts
        </h3>
        <span className="px-2 py-0.5 bg-accent-red/20 text-accent-red text-xs font-mono rounded">
          {mockAlerts.filter(a => a.status === 'new').length} NEW
        </span>
      </div>
      
      <div className="divide-y divide-surface-50 max-h-[360px] overflow-y-auto">
        <AnimatePresence>
          {mockAlerts.map((alert, index) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={clsx(
                  'p-4 hover:bg-surface-50/50 cursor-pointer transition-colors',
                  alert.status === 'new' && config.bg
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    config.bg
                  )}>
                    <Icon className={clsx('w-4 h-4', `text-${config.color}`)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {alert.type}
                      </p>
                      <span className={clsx(
                        'text-[10px] font-mono uppercase px-1.5 py-0.5 rounded',
                        alert.severity === 'critical' && 'bg-accent-red/20 text-accent-red',
                        alert.severity === 'high' && 'bg-accent-orange/20 text-accent-orange',
                        alert.severity === 'medium' && 'bg-primary-500/20 text-primary-400',
                        alert.severity === 'low' && 'bg-gray-500/20 text-gray-400'
                      )}>
                        {alert.severity}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {alert.location}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-gray-600 font-mono">
                        CAM: {alert.camera}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-600">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(alert.time, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {alert.status === 'new' && (
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-primary-500/10 text-accent-cyan text-xs font-medium rounded hover:bg-primary-500/20 transition-colors">
                      Acknowledge
                    </button>
                    <button className="flex-1 px-3 py-1.5 bg-surface-100 text-gray-400 text-xs font-medium rounded hover:bg-surface-50 transition-colors">
                      Dismiss
                    </button>
                  </div>
                )}
                
                {alert.status === 'acknowledged' && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-accent-orange">
                    <Clock className="w-3 h-3" />
                    Acknowledged - Awaiting resolution
                  </div>
                )}
                
                {alert.status === 'resolved' && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-accent-green">
                    <CheckCircle className="w-3 h-3" />
                    Resolved
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="p-3 border-t border-surface-50">
        <button className="w-full py-2 text-sm text-accent-cyan hover:text-white transition-colors font-medium">
          View All Alerts
        </button>
      </div>
    </div>
  );
}
