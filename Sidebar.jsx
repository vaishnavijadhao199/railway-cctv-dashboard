import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Video,
  Camera,
  AlertTriangle,
  Train,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Live Cameras', href: '/cameras', icon: Camera },
  { name: 'Recordings', href: '/videos', icon: Video },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Trains', href: '/trains', icon: Train },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      className="h-screen bg-surface-200 border-r border-surface-50 flex flex-col relative z-20"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-surface-50">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center">
              <Activity className="w-5 h-5 text-surface-300" />
            </div>
            <span className="font-mono font-semibold text-sm text-accent-cyan">
              RAIL<span className="text-accent-green">WATCH</span>
            </span>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center mx-auto">
            <Activity className="w-5 h-5 text-surface-300" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group',
                    isActive
                      ? 'bg-primary-500/10 text-accent-cyan'
                      : 'text-gray-400 hover:text-white hover:bg-surface-100'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon className={clsx(
                    'w-5 h-5 flex-shrink-0 relative z-10',
                    isActive && 'text-accent-cyan'
                  )} />
                  {!collapsed && (
                    <span className="font-medium text-sm relative z-10">{item.name}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-surface-100 border border-surface-50 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Status Footer */}
      <div className={clsx(
        'p-4 border-t border-surface-50',
        collapsed && 'flex justify-center'
      )}>
        <div className={clsx(
          'flex items-center gap-2',
          collapsed && 'flex-col'
        )}>
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          {!collapsed && (
            <span className="text-xs text-gray-500 font-mono">SYSTEM ONLINE</span>
          )}
        </div>
      </div>
    </motion.aside>
  );
}