import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, BookOpen, Truck } from 'lucide-react';

interface CurrentSelectionProps {
  institute?: {
    id: string;
    name: string;
  };
  class?: {
    id: string;
    name: string;
  };
  subject?: {
    id: string;
    name: string;
  };
  transport?: {
    id: string;
    vehicleModel: string;
  };
}

const CurrentSelection: React.FC<CurrentSelectionProps> = ({ institute, class: selectedClass, subject, transport }) => {
  if (!institute && !selectedClass && !subject && !transport) return null;

  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">Current Selection</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {institute && (
            <Badge variant="secondary" className="gap-1">
              <Building className="h-3.5 w-3.5" />
              <span className="font-medium">Institute:</span> {institute.name}
            </Badge>
          )}
          {selectedClass && (
            <Badge variant="secondary" className="gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span className="font-medium">Class:</span> {selectedClass.name}
            </Badge>
          )}
          {subject && (
            <Badge variant="outline" className="gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span className="font-medium">Subject:</span> {subject.name}
            </Badge>
          )}
          {transport && (
            <Badge variant="outline" className="gap-1">
              <Truck className="h-3.5 w-3.5" />
              <span className="font-medium">Transport:</span> {transport.vehicleModel}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentSelection;
