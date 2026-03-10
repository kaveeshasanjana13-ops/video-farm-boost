import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { CustomToggle } from '@/components/ui/custom-toggle';
import InstituteSettingsTab from '@/components/institute-settings/InstituteSettingsTab';
import InstituteProfileCard from '@/components/institute-settings/InstituteProfileCard';
import { useIsMobile } from '@/hooks/use-mobile';

import { 
  Sun,
  Moon,
  Monitor,
  LayoutGrid, 
  Table2,
  Palette,
  Building2,
  User,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const settingsTabs = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'institute', label: 'Institute', icon: Building2 },
  { id: 'profile', label: 'Institute Profile', icon: User },
];

const themeOptions = [
  { id: 'light' as const, label: 'Light', icon: Sun, description: 'Clean and bright interface' },
  { id: 'dark' as const, label: 'Dark', icon: Moon, description: 'Easy on the eyes in low light' },
  { id: 'system' as const, label: 'System', icon: Monitor, description: 'Follows your device settings' },
];

const mobileMenuItems = [
  { id: 'appearance', icon: Palette, label: 'Appearance', description: 'Theme & display preferences', color: 'text-violet-500' },
  { id: 'institute', icon: Building2, label: 'Institute Settings', description: 'Manage institute details', color: 'text-blue-500' },
  { id: 'profile', icon: User, label: 'Institute Profile', description: 'View institute profile card', color: 'text-emerald-500' },
];

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  const [viewMode, setViewMode] = useState<'card' | 'table'>(() => {
    return (localStorage.getItem('viewMode') as 'card' | 'table') || 'card';
  });
  const isMobile = useIsMobile();
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  const handleViewModeChange = (mode: 'card' | 'table') => {
    setViewMode(mode);
    localStorage.setItem('viewMode', mode);
  };

  const appearanceContent = (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <CardTitle>Appearance</CardTitle>
        </div>
        <CardDescription>
          Customize how the application looks and choose your preferred display mode
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Theme Selection */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Theme Mode</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Choose your preferred color scheme
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
                    isActive
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-full transition-colors",
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.description}</div>
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* View Mode Selection */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Display Mode</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Choose how data is displayed in Homework, Lectures, Exams, Results &amp; Submissions pages
            </p>
          </div>
          <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-muted/30">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full transition-colors ${viewMode === 'card' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <LayoutGrid className="h-6 w-6" />
              </div>
              <div>
                <div className="font-medium text-base">
                  {viewMode === 'card' ? 'Card View' : 'Table View'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {viewMode === 'card' ? 'Collapsible cards with expand for details' : 'Structured table format with all columns'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LayoutGrid className={`h-5 w-5 transition-colors ${viewMode === 'card' ? 'text-primary' : 'text-muted-foreground/40'}`} />
              <CustomToggle checked={viewMode === 'table'} onChange={(checked) => handleViewModeChange(checked ? 'table' : 'card')} size="lg" />
              <Table2 className={`h-5 w-5 transition-colors ${viewMode === 'table' ? 'text-primary' : 'text-muted-foreground/40'}`} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // ===== MOBILE LAYOUT =====
  if (isMobile) {
    if (mobileSection) {
      const item = mobileMenuItems.find(m => m.id === mobileSection);
      return (
        <div className="px-3 py-4 pb-20 space-y-4">
          <button
            onClick={() => setMobileSection(null)}
            className="flex items-center gap-2 text-sm font-medium text-primary active:opacity-70 transition-opacity"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to Settings
          </button>
          <h2 className="text-lg font-bold text-foreground">{item?.label}</h2>

          {mobileSection === 'appearance' && appearanceContent}
          {mobileSection === 'institute' && <InstituteSettingsTab />}
          {mobileSection === 'profile' && (
            <div className="max-w-lg">
              <InstituteProfileCard />
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="px-3 py-4 pb-20 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your preferences</p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {mobileMenuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setMobileSection(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left active:bg-muted/60 transition-colors ${
                    index < mobileMenuItems.length - 1 ? 'border-b border-border/40' : ''
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-muted/50 ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ===== DESKTOP LAYOUT =====
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and customize your experience
        </p>
      </div>

      <ScrollArea className="w-full">
        <div className="inline-flex items-center rounded-full border border-border bg-muted/40 p-1 gap-0.5">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {activeTab === 'appearance' && appearanceContent}
      {activeTab === 'institute' && <InstituteSettingsTab />}
      {activeTab === 'profile' && (
        <div className="max-w-lg">
          <InstituteProfileCard />
        </div>
      )}
    </div>
  );
};

export default Settings;
