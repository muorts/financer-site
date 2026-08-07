import { ElementType } from 'react'
import Link from 'next/link'; 

interface SubMenuButtonProps {
  label: string;
  icon: ElementType;
  url: string;
}

export function SubMenuButton({ label, icon: Icon, url }: SubMenuButtonProps) {
  return (
    <Link 
      href={url}
      className="flex items-center gap-3 justify-start w-full py-2 px-3 text-sm text-gray-400 transition-colors rounded-lg hover:text-brand hover:bg-border/30"
    >
      <button className="flex items-center gap-1.5 justify-start w-full py-2 text-sm text-gray-400 transition-colors rounded-lg hover:text-brand hover:bg-border/30 pl-3">
        <Icon className="w-4 h-4"/>
        <span className="font-medium">{label}</span>
      </button>
    </Link>
  );
}