import {
  FilePenLine,
  HelpCircle,
  LayoutDashboard,
  Newspaper,
  PlusSquare,
  Shield,
} from "lucide-react";
import type { AppPage } from "../App";

interface SidebarProps {
  activePage: AppPage;
  onPageChange: (page: AppPage) => void;
}

const menuItems: Array<{
  icon: typeof LayoutDashboard;
  label: string;
  page: AppPage;
}> = [
  { icon: LayoutDashboard, label: "Обзор", page: "overview" },
  { icon: Newspaper, label: "Газеты", page: "newspapers" },
  { icon: PlusSquare, label: "Создать", page: "create" },
  { icon: FilePenLine, label: "Редактор", page: "editor" },
  { icon: Shield, label: "Админка", page: "admin" },
  { icon: HelpCircle, label: "Справка", page: "support" },
];

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <div className="w-20 shrink-0 border-r border-orange-900/30 bg-gradient-to-b from-black to-zinc-900 flex flex-col items-center py-8 gap-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.page === activePage;

        return (
          <button
            key={item.page}
            type="button"
            onClick={() => onPageChange(item.page)}
            className={`relative group flex h-14 w-14 items-center justify-center rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-orange-600 shadow-lg shadow-orange-600/40"
                : "bg-zinc-800/50 hover:bg-orange-700/30 hover:shadow-md hover:shadow-orange-700/20"
            }`}
          >
            <Icon className={`h-6 w-6 ${isActive ? "text-white" : "text-orange-400"}`} />
            {isActive && (
              <div className="absolute -left-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-orange-500" />
            )}
            <span className="absolute left-full ml-4 rounded bg-zinc-900 px-3 py-1 text-sm whitespace-nowrap text-orange-400 opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 z-50">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
