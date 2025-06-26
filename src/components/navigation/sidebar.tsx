import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Scale, Home, Plus, Folder, CreditCard, Upload, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  return (
    <motion.aside 
      className="bg-card border-r border-border h-screen flex flex-col z-20"
      initial={{ width: collapsed ? 80 : 250 }}
      animate={{ width: collapsed ? 80 : 250 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center">
        <img src={`${import.meta.env.BASE_URL}owl-logo.png`} alt="LexiA Logo" className="h-10 w-10 object-contain" />
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-2 text-xl font-semibold"
          >
            LexiA
          </motion.span>
        )}
        <div className="ml-auto">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-accent/20 text-muted-foreground"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-hide">
        <ul className="space-y-1 px-2">
          <NavItem
            to="/dashboard"
            icon={<Home size={20} />}
            label="Dashboard"
            collapsed={collapsed}
          />
          <NavItem
            to="/new-case"
            icon={<Plus size={20} />}
            label="New Case"
            collapsed={collapsed}
          />
          <NavItem
            to="/cases"
            icon={<Folder size={20} />}
            label="Cases"
            collapsed={collapsed}
          />
          <NavItem
            to="/billing"
            icon={<CreditCard size={20} />}
            label="Billing"
            collapsed={collapsed}
          />
          <NavItem
            to="/uploads"
            icon={<Upload size={20} />}
            label="Uploads"
            collapsed={collapsed}
          />
          <NavItem
            to="/account"
            icon={<User size={20} />}
            label="Account"
            collapsed={collapsed}
          />
        </ul>
      </nav>
      
      {/* Status/Footer */}
      <div className="p-4 border-t border-border">
        <div className={cn(
          "px-3 py-2 rounded-md bg-accent/10 text-muted-foreground text-sm",
          collapsed ? "flex justify-center" : ""
        )}>
          {collapsed ? (
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          ) : (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>System online</span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

function NavItem({ to, icon, label, collapsed }: NavItemProps) {
  return (
    <li>
      {collapsed ? (
        <Tooltip content={label}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center justify-center p-3 rounded-md transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/20 hover:text-foreground"
              )
            }
          >
            {icon}
          </NavLink>
        </Tooltip>
      ) : (
        <NavLink
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center space-x-3 p-3 rounded-md transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/20 hover:text-foreground"
            )
          }
        >
          {icon}
          <span>{label}</span>
        </NavLink>
      )}
    </li>
  );
}