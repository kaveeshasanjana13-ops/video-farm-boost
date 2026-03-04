import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { CustomToggle } from '@/components/ui/custom-toggle';

import { 
  Sun,
  LayoutGrid, 
  Table2,
  Palette,
  Settings2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const settingsTabs = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appearance');
  const [viewMode, setViewMode] = useState<'card' | 'table'>(() => {
    return (localStorage.getItem('viewMode') as 'card' | 'table') || 'card';
  });

  const handleViewModeChange = (mode: 'card' | 'table') => {
    setViewMode(mode);
    localStorage.setItem('viewMode', mode);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and customize your experience
        </p>
      </div>

      {/* Tab Navigation */}
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

      {/* Tab Content */}
      {activeTab === 'appearance' && (
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
                  Application uses light mode for a clean and bright interface
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Card className="ring-2 ring-primary border-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-primary text-primary-foreground">
                        <Sun className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Light Mode</div>
                        <div className="text-xs text-muted-foreground">
                          Clean and bright interface
                        </div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  </CardContent>
                </Card>
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
      )}

      
    </div>
  );
};

export default Settings;
