import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Calendar, Clock, BookOpen, User, Building, GraduationCap } from 'lucide-react';
import { HomeworkReferencesSection } from '@/components/homework/index';

interface HomeworkDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  homework: any;
}

const HomeworkDetailsDialog = ({ isOpen, onClose, homework }: HomeworkDetailsDialogProps) => {
  if (!homework) return null;

  const formatDate = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-base font-bold leading-tight">{homework.title}</p>
              <p className="text-xs text-muted-foreground font-normal">Homework Details</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-110px)] pr-4">
        <div className="space-y-5">

          {/* Description & Instructions */}
          {(homework.description || homework.instructions) && (
            <div className="space-y-2">
              {homework.description && (
                <div className="p-3.5 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Description</p>
                  <p className="text-sm leading-relaxed">{homework.description}</p>
                </div>
              )}
              {homework.instructions && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">Instructions</p>
                  <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-300">{homework.instructions}</p>
                </div>
              )}
            </div>
          )}

          {/* Context */}
          {(homework.institute || homework.class || homework.subject || homework.teacher) && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Context</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {homework.institute && (
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Building className="h-2.5 w-2.5" />Institute</span>
                    <span className="text-xs font-medium truncate">{homework.institute.name}</span>
                  </div>
                )}
                {homework.class && (
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><GraduationCap className="h-2.5 w-2.5" />Class</span>
                    <span className="text-xs font-medium truncate">{homework.class.name}</span>
                  </div>
                )}
                {homework.subject && (
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-primary/60 flex items-center gap-1"><BookOpen className="h-2.5 w-2.5" />Subject</span>
                    <span className="text-xs font-semibold text-primary truncate">{homework.subject.name}</span>
                  </div>
                )}
                {homework.teacher && (
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><User className="h-2.5 w-2.5" />Teacher</span>
                    <span className="text-xs font-medium truncate">{homework.teacher.name || homework.teacher.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Schedule & Marks */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Schedule &amp; Marks</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-green-600 dark:text-green-400 flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />Start Date</span>
                <span className="text-xs font-semibold text-green-700 dark:text-green-300">{formatDate(homework.startDate)}</span>
              </div>
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 flex items-center gap-1"><Clock className="h-2.5 w-2.5" />Due Date</span>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">{formatDate(homework.endDate)}</span>
              </div>
              {homework.maxMarks && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Max Marks</span>
                  <span className="text-sm font-bold">{homework.maxMarks}</span>
                </div>
              )}
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Status</span>
                <Badge variant={homework.isActive ? 'default' : 'secondary'} className="w-fit text-[10px] px-1.5 py-0">
                  {homework.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Resources */}
          {(homework.referenceLink || homework.attachmentUrl) && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Resources</p>
              <div className="flex flex-wrap gap-2">
                {homework.referenceLink && (
                  <Button size="sm" variant="outline" className="h-8 text-xs border-blue-300 text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700" onClick={() => window.open(homework.referenceLink, '_blank')}>
                    <ExternalLink className="h-3 w-3 mr-1.5" />Reference Link
                  </Button>
                )}
                {homework.attachmentUrl && (
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => window.open(homework.attachmentUrl, '_blank')}>
                    <ExternalLink className="h-3 w-3 mr-1.5" />Attachment
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Reference Materials */}
          {homework.id && (
            <HomeworkReferencesSection 
              homeworkId={homework.id} 
              initialReferences={homework.references}
              editable={false}
            />
          )}

          {/* Timestamps */}
          <div className="border-t pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Timestamps</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Created</span>
                <span className="text-xs">{homework.createdAt ? new Date(homework.createdAt).toLocaleString() : 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Updated</span>
                <span className="text-xs">{homework.updatedAt ? new Date(homework.updatedAt).toLocaleString() : 'N/A'}</span>
              </div>
            </div>
          </div>

        </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default HomeworkDetailsDialog;