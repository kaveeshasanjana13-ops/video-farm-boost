import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface DashboardItem {
  id: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  color: string;
  locked?: boolean;
}

interface DashboardGridProps {
  items: DashboardItem[];
  onNavigate: (id: string) => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ items, onNavigate }) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => !item.locked && onNavigate(item.id)}
          disabled={item.locked}
          className={`
            flex flex-col items-center gap-1 p-2 rounded-xl
            transition-all duration-150 active:scale-95
            ${item.locked
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-muted/50 active:bg-muted'
            }
            min-w-0 overflow-hidden
          `}
        >
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center shrink-0
            ${item.color} text-white shadow-sm
          `}>
            <item.icon className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-medium text-foreground text-center leading-tight line-clamp-2 w-full">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default DashboardGrid;
