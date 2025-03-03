import { useState } from "react";
import { Search, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useNavigate } from "react-router-dom";

export function Header() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDropdownLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 flex items-center px-4 transition-colors duration-200">
      {/* Logo */}
      <div className="flex items-center gap-2 w-64 h-full pr-4">
        <span className="font-semibold text-foreground">Urban</span>
        <div className="w-8 h-8 bg-[#6C5DD3] rounded-lg flex items-center justify-center">
          <span className="text-white font-semibold">X</span>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 flex items-center px-4">
        <div className="max-w-xl w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 pl-4 h-full">
        {/* Logout Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="rounded-full w-10 h-10 hover:bg-muted"
          title="Logout"
        >
          <LogOut className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full w-10 h-10 hover:bg-muted"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700" />
          )}
        </Button>

        {/* User Profile */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 bg-[#6C5DD3] rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.displayName ? user.displayName[0].toUpperCase() : user?.email[0].toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {user?.displayName || user?.email}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-muted">
              <svg
                className={`h-4 w-4 text-muted-foreground transform transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1 z-50 border">
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                onClick={() => setIsDropdownOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={handleDropdownLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}