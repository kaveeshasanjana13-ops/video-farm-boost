import { Shield } from "lucide-react";
import { Lock } from "lucide-react";
import { Eye } from "lucide-react";
import { Fingerprint } from "lucide-react";

interface SecurityElementProps {
  position: 'top' | 'right' | 'bottom' | 'left';
}

const SecurityElement = ({ position }: SecurityElementProps) => {
  const getIcon = () => {
    switch (position) {
      case 'top':
        return <Shield className="w-6 h-6" />;
      case 'right':
        return <Lock className="w-6 h-6" />;
      case 'bottom':
        return <Fingerprint className="w-6 h-6" />;
      case 'left':
        return <Eye className="w-6 h-6" />;
    }
  };

  const getPositionClasses = () => {
    const baseClasses = "absolute";
    
    switch (position) {
      case 'top':
        return `${baseClasses} -top-8 left-1/2 transform -translate-x-1/2`;
      case 'right':
        return `${baseClasses} -right-8 top-1/2 transform -translate-y-1/2`;
      case 'bottom':
        return `${baseClasses} -bottom-8 left-1/2 transform -translate-x-1/2`;
      case 'left':
        return `${baseClasses} -left-8 top-1/2 transform -translate-y-1/2`;
    }
  };

  return (
    <div className={`${getPositionClasses()} opacity-60 hover:opacity-100 transition-opacity duration-300`}>
      <div className="p-2 rounded-full bg-lms-blue-light/30 text-lms-blue float-animation border border-lms-blue/20">
        {getIcon()}
      </div>
    </div>
  );
};

export default SecurityElement;