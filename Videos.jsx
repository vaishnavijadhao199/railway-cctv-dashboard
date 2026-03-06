import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Play, Download, Trash2, Calendar, Clock, HardDrive, Filter, Search } from 'lucide-react';
import Header from '../components/layout/Header';
import { videosApi } from '../services/api';
import clsx from 'clsx';
import { format } from 'date-fns';

const mockVideos = [
  {
    video_id: '1',
    camera_name: 'Platform 1 - Entry',
    file_path: '/recordings/2024/01/15/cam001_1705312800.mp4',
    duration_seconds: 3600,
    file_size_mb: 245.8,
    resolution: '1080p',
    recording_started_at: new Date('2024-01-15T08:00:00'),
    storage_status: 'active',
  },
  {
    video_id: '2',
    camera_name: 'Track 4 - Crossing',
    file_path: '/recordings/2024/01/15/cam002_1705312800.mp4',
    duration_seconds: 1800,
    file_size_mb: 128.4,
    resolution: '4K',
    recording_started_at: new Date('2024-01-15T07:30:00'),
    storage_status: 'active',
  },
  // More mock videos...
];

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filters, setFilters] = useState({
    date: '',
    camera: '',
    status: '',
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await videosApi.getAll();
      setVideos(response.data.videos);
    } catch (error) {
      setVideos(mockVideos);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (mb) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-surface-300 grid-pattern">
      <Header title="Video Recordings" subtitle="Manage and review recorded footage" onRefresh={fetchVideos} />
      
      <main className="p-6">
        {/* Filters Bar */}
        <div className="card mb-6">
          <div className="p-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">Filters:</span>
            </div>
            
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="px-3 py-2 bg-surface-200 border border-surface-50 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500"
            />
            
            <select
              value={filters.camera}
              onChange={(e) => setFilters({ ...filters, camera: e.target.value })}
              className="px-3 py-2 bg-surface-200 border border-surface-50 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">All Cameras</option>
              <option value="platform">Platform</option>
              <option value="track">Track</option>
              <option value="entrance">Entrance</option>
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 bg-surface-200 border border-surface-50 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="deleted">Deleted</option>
            </select>
            
            <div className="flex-1" />
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search recordings..."
                className="pl-9 pr-4 py-2 bg-surface-200 border border-surface-50 rounded-lg text-sm text-white w-64 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video, index) => (
            <motion.div
              key={video.video_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card group hover:border-primary-500/30 transition-all duration-200"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-surface-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-12 h-12 text-gray-600" />
                </div>
                
                {/* Duration overlay */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs font-mono text-white">
                  {formatDuration(video.duration_seconds)}
                </div>
                
                {/* Play button on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="p-3 bg-accent-cyan/20 rounded-full hover:bg-accent-cyan/30 transition-colors">
                    <Play className="w-6 h-6 text-accent-cyan" fill="currentColor" />
                  </button>
                </div>
              </div>
              
              {/* Info */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-white truncate">{video.camera_name}</h4>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(video.recording_started_at), 'MMM dd, yyyy HH:mm')}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <HardDrive className="w-3 h-3" />
                    {formatFileSize(video.file_size_mb)} • {video.resolution}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <button className="flex-1 py-2 bg-primary-500/10 text-accent-cyan text-xs font-medium rounded hover:bg-primary-500/20 transition-colors">
                    <Play className="w-3 h-3 inline mr-1" />
                    Play
                  </button>
                  <button className="p-2 bg-surface-200 text-gray-400 rounded hover:text-white hover:bg-surface-100 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-surface-200 text-gray-400 rounded hover:text-accent-red hover:bg-surface-100 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}