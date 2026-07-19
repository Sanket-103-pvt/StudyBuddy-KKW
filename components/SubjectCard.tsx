import React from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { getRelativeTime } from "@/lib/date-utils";

interface SubjectCardProps {
  id: string;
  name: string;
  year: string;
  iconName: string;
  unitCount: number;
  lastUpdated: string;
}

export default function SubjectCard({
  id,
  name,
  year,
  iconName,
  unitCount,
  lastUpdated,
}: SubjectCardProps) {
  const iconsRecord = Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>;
  
  // Dynamically resolve the Lucide icon, fallback to BookOpen
  const IconComponent = iconsRecord[
    iconName.charAt(0).toUpperCase() + iconName.slice(1)
  ] || iconsRecord[
    // Handle camelCase / kebab-case conversions
    iconName.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).charAt(0).toUpperCase() +
    iconName.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).slice(1)
  ] || Icons.BookOpen;

  return (
    <Link 
      href={`/${year}/${id}`}
      className="group bg-surface-container-lowest dark:bg-bg-dark rounded-xl p-6 border border-border-light dark:border-border-dark shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-lg bg-surface-container dark:bg-inverse-surface flex items-center justify-center text-primary dark:text-primary-fixed-dim transition-colors">
            <IconComponent size={24} />
          </div>
          
          <span className="font-mono text-label-mono text-text-secondary-light dark:text-text-secondary-dark bg-surface-container-low dark:bg-inverse-surface px-2.5 py-1 rounded-full border border-border-light dark:border-border-dark">
            {unitCount > 0 ? `${unitCount} Units` : "Resources"}
          </span>
        </div>
        
        <h3 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark mb-2 group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
          {name}
        </h3>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-between text-body-sm text-text-secondary-light dark:text-text-secondary-dark">
        <span>Last updated</span>
        <span className="font-medium text-on-surface dark:text-text-primary-dark">
          {getRelativeTime(lastUpdated)}
        </span>
      </div>
    </Link>
  );
}
