import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Clock,
  MapPin,
  Bell,
  Settings,
  FileText,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { useCity } from "@/contexts/CityContext";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Clock, label: "DASHBOARD", path: "/dashboard" },
  { icon: MapPin, label: "MAP VIEW", path: "/map" },
  { icon: Bell, label: "ALERTS", path: "/alerts" },
  { icon: FileText, label: "ANALYTICS", path: "/analytics" },
  { icon: Settings, label: "SETTINGS", path: "/settings" },
];

const denseAreas = [
  "Borivali",
  "Thane",
  "Kalyan"
];

const alertTypes = [
  { type: "Critical", color: "bg-red-500", severity: "red" },
  { type: "Major", color: "bg-orange-500", severity: "yellow" },
  { type: "Minor", color: "bg-yellow-500", severity: "yellow" },
  { type: "Warning", color: "bg-blue-500", severity: "yellow" },
  { type: "Informational", color: "bg-gray-500", severity: "green" }
];

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAreasExpanded, setIsAreasExpanded] = useState(true);
  const { selectedCity, setSelectedCity } = useCity();

  const handleAlertTypeClick = (severity: string) => {
    navigate(`/alerts?type=${severity}`);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-[64px] z-40 h-[calc(100vh-64px)] w-64 bg-[#6C5DD3] dark:bg-[#4A3E99] transition-all duration-300 ease-in-out",
        !isOpen && "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full text-white">
        {/* Location Selection */}
        <div className="p-4 border-b border-white/10">
          <button
            onClick={() => setIsAreasExpanded(!isAreasExpanded)}
            className="flex items-center justify-between w-full text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Mumbai Metropolitan Area</span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              isAreasExpanded && "transform rotate-180"
            )} />
          </button>
          
          {isAreasExpanded && (
            <div className="mt-2 ml-6 space-y-1">
              {denseAreas.map((area) => (
                <div
                  key={area}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-white/10",
                    selectedCity === area && "bg-white/10"
                  )}
                  onClick={() => setSelectedCity(area)}
                >
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-sm">{area}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-white/20 dark:bg-white/30"
                  : "hover:bg-white/10"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Alerts Filter */}
        <div className="p-4 border-t border-white/10">
          <div className="text-sm font-medium mb-3">Alerts type</div>
          <div className="space-y-3">
            {alertTypes.map((alert) => (
              <div 
                key={alert.type} 
                className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
                onClick={() => handleAlertTypeClick(alert.severity)}
              >
                <div className={cn("h-2 w-2 rounded-full", alert.color)} />
                <span className="text-sm">{alert.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}