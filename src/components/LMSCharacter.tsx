import { Users, GraduationCap, BookOpen, School } from "lucide-react";
interface LMSCharacterProps {
  type: 'student' | 'parent' | 'teacher' | 'institute';
  color: 'blue' | 'evolution';
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  isMovingToward?: boolean;
}
const LMSCharacter = ({
  type,
  color,
  position,
  isMovingToward = true
}: LMSCharacterProps) => {
  const getIcon = () => {
    switch (type) {
      case 'student':
        return <GraduationCap className="w-8 h-8" />;
      case 'parent':
        return <Users className="w-8 h-8" />;
      case 'teacher':
        return <BookOpen className="w-8 h-8" />;
      case 'institute':
        return <School className="w-8 h-8" />;
    }
  };
  const getLabel = () => {
    switch (type) {
      case 'student':
        return 'Students';
      case 'parent':
        return 'Parents';
      case 'teacher':
        return 'Teachers';
      case 'institute':
        return 'Institutes';
    }
  };
  const getPositionClasses = () => {
    const baseClasses = "absolute flex flex-col items-center gap-2 text-center";
    switch (position) {
      case 'top-left':
        return `${baseClasses} top-8 left-8 md:top-16 md:left-16`;
      case 'top-right':
        return `${baseClasses} top-8 right-8 md:top-16 md:right-16`;
      case 'bottom-left':
        return `${baseClasses} bottom-8 left-8 md:bottom-16 md:left-16`;
      case 'bottom-right':
        return `${baseClasses} bottom-8 right-8 md:bottom-16 md:right-16`;
      case 'top-center':
        return `${baseClasses} top-8 left-1/2 transform -translate-x-1/2 md:top-16`;
      case 'bottom-center':
        return `${baseClasses} bottom-8 left-1/2 transform -translate-x-1/2 md:bottom-16`;
    }
  };
  const getAnimationClasses = () => {
    const baseAnimation = "transition-all duration-1000 ease-in-out";
    if (isMovingToward) {
      return `${baseAnimation} slide-to-center float-animation`;
    } else {
      return `${baseAnimation} slide-from-center float-animation`;
    }
  };
  const getColorClasses = () => {
    if (color === 'blue') {
      return "text-lms-blue border-lms-blue/30 bg-lms-blue-light/20 shadow-lg";
    } else {
      return "text-lms-evolution border-lms-evolution/30 bg-lms-evolution/10 shadow-lg";
    }
  };
  const getPositionVariables = () => {
    const distance = '100px';
    switch (position) {
      case 'top-left':
        return {
          '--start-x': `-${distance}`,
          '--start-y': `-${distance}`,
          '--end-x': `-${distance}`,
          '--end-y': `-${distance}`
        } as React.CSSProperties;
      case 'top-right':
        return {
          '--start-x': distance,
          '--start-y': `-${distance}`,
          '--end-x': distance,
          '--end-y': `-${distance}`
        } as React.CSSProperties;
      case 'bottom-left':
        return {
          '--start-x': `-${distance}`,
          '--start-y': distance,
          '--end-x': `-${distance}`,
          '--end-y': distance
        } as React.CSSProperties;
      case 'bottom-right':
        return {
          '--start-x': distance,
          '--start-y': distance,
          '--end-x': distance,
          '--end-y': distance
        } as React.CSSProperties;
      case 'top-center':
        return {
          '--start-x': '0',
          '--start-y': `-${distance}`,
          '--end-x': '0',
          '--end-y': `-${distance}`
        } as React.CSSProperties;
      case 'bottom-center':
        return {
          '--start-x': '0',
          '--start-y': distance,
          '--end-x': '0',
          '--end-y': distance
        } as React.CSSProperties;
    }
  };
  return <div className={`${getPositionClasses()} ${getAnimationClasses()}`} style={getPositionVariables()}>
      
    </div>;
};
export default LMSCharacter;