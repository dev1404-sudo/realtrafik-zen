import React from 'react';
import { 
  Map, 
  BarChart3, 
  Car, 
  AlertTriangle, 
  Users, 
  Settings,
  Activity,
  Navigation
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'map', label: 'Live Map', icon: Map },
  { id: 'vehicles', label: 'Fleet', icon: Car },
  { id: 'violations', label: 'Violations', icon: AlertTriangle },
  { id: 'routes', label: 'Routes', icon: Navigation },
  { id: 'drivers', label: 'Drivers', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const DashboardSidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  return (
    <div className="w-64 h-screen bg-glass-bg backdrop-blur-md border-r border-glass-border">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Map className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">TrafficControl</h1>
            <p className="text-xs text-muted-foreground">Fleet Management</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-traffic-green rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">System Status</span>
          </div>
          <p className="text-xs text-muted-foreground">All systems operational</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;