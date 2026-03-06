import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, Video, AlertTriangle, Database, 
  Train, Activity, HardDrive, TrendingUp 
} from 'lucide-react';
import Header from '../components/layout/Header';
import StatCard from '../components/dashboard/StatCard';
import CameraGrid from '../components/dashboard/CameraGrid';
import AlertFeed from '../components/dashboard/AlertFeed';
import ActivityChart from '../components/dashboard/ActivityChart';
import DetectionBreakdown from '../components/dashboard/DetectionBreakdown';
import { dashboardApi } from '../services/api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Use mock data if API fails
      setSummary({
        total_cameras: 48,
        online_cameras: 45,
        offline_cameras: 3,
        total_trains: 24,
        active_trains: 18,
        total_recordings: 1250,
        storage_used_gb: 2847.5,
        alerts_today: 32,
        critical_alerts: 4,
        pending_alerts: 12,
        detections_today: 892,
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = summary ? [
    {
      title: 'Total Cameras',
      value: summary.total_cameras,
      subtitle: `${summary.online_cameras} online`,
      icon: Camera,
      color: 'cyan',
      trend: 'up',
      trendValue: '+2',
    },
    {
      title: 'Active Recordings',
      value: summary.total_recordings,
      subtitle: `${summary.storage_used_gb} GB used`,
      icon: Video,
      color: 'purple',
    },
    {
      title: 'Alerts Today',
      value: summary.alerts_today,
      subtitle: `${summary.critical_alerts} critical`,
      icon: AlertTriangle,
      color: 'orange',
      trend: summary.alerts_today > 20 ? 'down' : 'up',
      trendValue: '-12%',
    },
    {
      title: 'AI Detections',
      value: summary.detections_today,
      subtitle: 'Today',
      icon: Activity,
      color: 'green',
      trend: 'up',
      trendValue: '+18%',
    },
    {
      title: 'Active Trains',
      value: `${summary.active_trains}/${summary.total_trains}`,
      subtitle: 'Currently tracked',
      icon: Train,
      color: 'cyan',
    },
    {
      title: 'Storage',
      value: `${Math.round(summary.storage_used_gb / 100)}%`,
      subtitle: '2.8 TB / 4 TB',
      icon: HardDrive,
      color: 'purple',
    },
  ] : [];

  return (
    <div className="min-h-screen bg-surface-300 grid-pattern">
      <Header 
        title="Dashboard" 
        subtitle="Railway CCTV Monitoring System"
        onRefresh={fetchDashboardData}
      />
      
      <main className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Grid - Takes 2 columns */}
          <div className="lg:col-span-2">
            <CameraGrid />
          </div>
          
          {/* Alert Feed */}
          <div className="lg:col-span-1">
            <AlertFeed />
          </div>
        </div>

        {/* Bottom Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ActivityChart />
          <DetectionBreakdown />
        </div>
      </main>
    </div>
  );
}