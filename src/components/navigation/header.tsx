import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { getUserInitials } from '@/lib/utils';
import { Menu, Bell, Search } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  isCollapsed: boolean;
}

export default function Header({ toggleSidebar, isCollapsed }: HeaderProps) {
  const { user } = useAuth();
  
  const displayName = user?.displayName || user?.email || 'Guest User';
  const initials = getUserInitials(displayName);
  
  return (
    <header className="h-16 border-b border-border flex items-center px-4 bg-card">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar} 
        className="md:hidden mr-2"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 flex items-center">
        <div className="flex items-center bg-background rounded-md px-3 w-full max-w-md">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <input 
            type="text" 
            placeholder="Search cases, documents, or ask a question..."
            className="flex-1 h-10 bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
        </Button>
        
        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">Premium Plan</p>
          </div>
          
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}