import { Clock, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { AppPage } from "../App";

interface TopNavProps {
  roleName: string;
  roleDescription: string;
  activePage: AppPage;
}

const pageTitles: Record<AppPage, string> = {
  overview: "Обзор системы",
  newspapers: "Каталог газет",
  create: "Создание газеты",
  editor: "Редактор выпусков",
  admin: "Панель следящих и админов",
  support: "Базовые страницы и помощь",
};

export function TopNav({ roleName, roleDescription, activePage }: TopNavProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="border-b border-orange-900/40 bg-black/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-600 to-orange-800 shadow-lg shadow-orange-600/40">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              SMI Control Center
            </h1>
            <p className="text-xs text-orange-400/80">{pageTitles[activePage]}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col items-end rounded-lg border border-orange-700/40 bg-orange-950/30 px-4 py-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-orange-500/80">Роль</span>
            <span className="text-sm font-semibold text-orange-200">{roleName}</span>
            <span className="text-xs text-orange-300/70">{roleDescription}</span>
          </div>
          <div className="flex items-center gap-2 text-orange-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-mono">
              {currentTime.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
          <button
            type="button"
            className="rounded-lg bg-zinc-800/50 p-2 transition-colors hover:bg-orange-700/30"
          >
            <Search className="h-5 w-5 text-orange-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
