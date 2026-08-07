import { ElementType, ChangeEvent } from 'react';

interface InputTextoProps {
  label: string;
  icon: ElementType;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function NameInput({ label, icon: Icon, placeholder, value, onChange }: InputTextoProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
        <input 
          type="text" 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full py-3 pl-12 pr-4 text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 placeholder:text-gray-600"
        />
      </div>
    </div>
  );
}