import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Maximize2, Settings, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const mockCameras = [
  { id: 1, name: 'Platform 1 - Entry', status: 'online', location: 'platform', alerts: 2 },
  { id: 2, name: 'Platform 2 - Exit', status: 'online', location: 'platform', alerts: 0 },
  { id: 3, name: 'Track 4 - Crossing', status: 'offline', location: 'track', alerts: 5 },
  { id: 4, name: 'Station Entrance', status: 'online', location: 'entrance', alerts: 0 },
  { id: 5, name: 'Platform 3 - North', status: 'online', location: 'platform', alerts: 1 },
  { id: 6, name: 'Yard - Section B', status: 'warning', location: 'yard', alerts: 3 },
  { id: 7, name: 'Platform 5 - Main', status: 'online', location: 'platform', alerts: 0 },
  { id: 8, name: 'Track 2 - Signal', status: 'online', location: 'track', alerts: 0 },
];

export default function CameraGrid() {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  return (
    <div className="card h-full">
      <div className="card-header">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Video className="w-4 h-4 text-accent-cyan" />
          Live Camera Feeds
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-mono">8 cameras</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {mockCameras.map((camera, index) => (
            <motion.div
              key={camera.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={clsx(
                'relative aspect-video rounded-lg overflow-hidden cursor-pointer group',
                'bg-surface-300 border border-surface-50',
                'hover:border-primary-500/50 transition-all duration-200'
              )}
              onClick={() => setSelectedCamera(camera)}
            >
              {/* Simulated video feed */}
              <div className="absolute inset-0 bg-gradient-to-br from-surface-200 to-surface-300">
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 grid-pattern opacity-50" />
                
                {/* Status overlay for offline */}
                {camera.status === 'offline' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                
                {/* Warning overlay */}
                {camera.status === 'warning' && (
                  <div className="absolute inset-0 bg-accent-orange/10 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-accent-orange" />
                  </div>
                )}
              </div>

              {/* Scan line animation for online cameras */}
              {camera.status === 'online' && <div className="scan-line" />}

              {/* Camera info overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-xs font-medium text-white truncate">{camera.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={clsx(
                    'w-1.5 h-1.5 rounded-full',
                    camera.status === 'online' && 'bg-accent-green animate-pulse',
                    camera.status === 'offline' && 'bg-accent-red',
                    camera.status === 'warning' && 'bg-accent-orange animate-pulse'
                  )} />
                  <span className="text-[10px] text-gray-400 uppercase font-mono">
                    {camera.status}
                  </span>
                </div>
              </div>

              {/* Alerts badge */}
              {camera.alerts > 0 && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-accent-red rounded text-[10px] font-mono font-bold text-white">
                  {camera.alerts}
                </div>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-2 bg-surface-100/80 rounded-lg hover:bg-surface-100 transition-colors">
                  <Maximize2 className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 bg-surface-100/80 rounded-lg hover:bg-surface-100 transition-colors">
                  <Settings className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* REC indicator */}
              {camera.status === 'online' && (
                <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-accent-red/80 rounded text-[10px] font-mono font-bold text-white">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  REC
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}