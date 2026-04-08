import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Hash, Layers } from 'lucide-react';
import { BasicUser } from '@/api/users.api';
import { getImageUrl } from '@/utils/imageUrlHelper';

interface UserInfoDialogProps {
  open: boolean;
  onClose: () => void;
  user: BasicUser | null;
}

const UserInfoDialog: React.FC<UserInfoDialogProps> = ({ open, onClose, user }) => {
  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">User Information</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-2">
          <Avatar className="h-20 w-20 ring-4 ring-primary/10">
            <AvatarImage src={getImageUrl(user.imageUrl)} alt={user.fullName} />
            <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-bold text-base">{user.fullName}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Details</p>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-primary/60 flex items-center gap-1"><Hash className="h-2.5 w-2.5" />User ID</span>
              <span className="text-sm font-bold text-primary font-mono">{user.id}</span>
            </div>
            <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Layers className="h-2.5 w-2.5" />User Type</span>
              <Badge variant="secondary" className="w-fit text-xs px-2 py-0.5">{user.userType}</Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserInfoDialog;
