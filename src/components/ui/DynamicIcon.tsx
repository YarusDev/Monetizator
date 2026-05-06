import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Fallback to a default icon if not found
    return <Icons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};
