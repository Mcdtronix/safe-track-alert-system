
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Settings,
  Shield,
  Activity,
  MapPin
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'People', href: '/people', icon: Users },
  { name: 'Location Tracking', href: '/location-tracking', icon: MapPin },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  return (
    <div className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out z-40",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center p-4 border-b border-sidebar-border">
          <Shield className="h-8 w-8 text-sidebar-foreground" />
          {isOpen && (
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-sidebar-foreground">Protection</h2>
              <p className="text-sm text-sidebar-foreground/80">System</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="h-5 w-5" />
                {isOpen && <span className="ml-3">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-green-500" />
            {isOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">System Status</p>
                <p className="text-xs text-green-500">All systems operational</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
