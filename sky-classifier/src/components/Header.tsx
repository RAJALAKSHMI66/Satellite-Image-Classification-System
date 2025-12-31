import React, { useState } from 'react';
import { Satellite, Sun, Moon, Share2, Bell, ChevronDown, LogOut, Settings, User, HelpCircle, RefreshCw, Radio, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import NotificationDropdown from './NotificationDropdown';

interface HeaderProps {
  onNavigate?: (tab: string) => void;
  onRefresh?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onRefresh }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isLoggedIn, login } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'success' as const,
      title: 'Classification Complete',
      message: 'Forest region analysis finished with 94.2% accuracy',
      time: '2 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'info' as const,
      title: 'Model Updated',
      message: 'CNN model v2.3 is now available for classification',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'warning' as const,
      title: 'Low Confidence Detection',
      message: 'Recent classification had below 70% confidence',
      time: '3 hours ago',
      read: true,
    },
  ]);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleMenuClick = (tab: string) => {
    setShowUserMenu(false);
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  const handleLogin = () => {
    login();
  };

  const handleShare = async () => {
    const shareData = {
      title: "Satellite Image Classification Dashboard",
      text: "Check out this satellite image classification dashboard",
      url: window.location.href,
    };
    try {
      if ((navigator as any).share) {
        await (navigator as any).share(shareData);
        return;
      }
      // Fallback: copy link
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Share failed", err);
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl bg-card/90">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-primary">
            <Satellite className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Satellite Image Classification</h1>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm font-medium text-foreground ${isRefreshing ? 'opacity-50' : ''}`}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Live Button */}
        <button
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
            isLive 
              ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Radio className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
          <span className="hidden sm:inline">Live</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-all font-medium text-sm"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          {copied ? 'Copied!' : 'Share'}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-foreground" />
          ) : (
            <Sun className="w-5 h-5 text-foreground" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            )}
          </button>
          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onClearAll={handleClearNotifications}
          />
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {user.avatar}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl py-2 animate-fade-in">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <button 
                onClick={() => handleMenuClick('profile')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button 
                onClick={() => handleMenuClick('settings')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button 
                onClick={() => handleMenuClick('help')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Help & Docs
              </button>
              <div className="border-t border-border mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};

export default Header;
