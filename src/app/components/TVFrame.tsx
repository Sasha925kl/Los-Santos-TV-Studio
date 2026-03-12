import type { AppPage } from "../App";

interface TVFrameProps {
  activePage: AppPage;
  roleName: string;
  roleDescription: string;
}

const pageStatus: Record<AppPage, { title: string; text: string }> = {
  overview: {
    title: "Система онлайн",
    text: "Главный обзор со сводкой ролей, выпусков и быстрых действий.",
  },
  newspapers: {
    title: "Каталог загружен",
    text: "Доступен список выпусков, статусов и редакционных заметок.",
  },
  create: {
    title: "Режим создания",
    text: "Подготовка нового номера, шаблона и публикационных данных.",
  },
  editor: {
    title: "Редактор активен",
    text: "Открыто рабочее место для материалов, версий и правок.",
  },
  admin: {
    title: "Админ-мониторинг",
    text: "Контроль ролей, заявок и критических действий системы.",
  },
  support: {
    title: "База знаний",
    text: "Собраны базовые страницы, инструкции и частые вопросы.",
  },
};

export function TVFrame({ activePage, roleName, roleDescription }: TVFrameProps) {
  return (
    <div className="flex w-96 flex-col gap-4">
      <div className="relative">
        <div className="rounded-lg border border-orange-900/40 bg-gradient-to-b from-zinc-800 to-zinc-900 p-3 shadow-2xl">
          <div className="relative aspect-video overflow-hidden rounded-md bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,rgba(0,0,0,0.06)_2%,transparent_4%)] bg-[length:100%_4px] pointer-events-none" />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
              <div className="rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-orange-300">
                Live Panel
              </div>
              <h3 className="mt-4 text-2xl font-bold text-orange-100">
                {pageStatus[activePage].title}
              </h3>
              <p className="mt-2 text-sm text-orange-100/65">{pageStatus[activePage].text}</p>
            </div>
          </div>

          <div className="mt-2 flex justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-600 shadow-lg shadow-orange-600/50" />
            <div className="h-2 w-2 rounded-full bg-zinc-700" />
            <div className="h-2 w-2 rounded-full bg-zinc-700" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-orange-800/40 bg-black/40 p-4 backdrop-blur-sm">
        <p className="text-[11px] uppercase tracking-[0.3em] text-orange-500/75">Текущий доступ</p>
        <h3 className="mt-2 text-lg font-semibold text-orange-100">{roleName}</h3>
        <p className="mt-2 text-sm text-orange-100/65">{roleDescription}</p>
        <p className="mt-3 text-xs text-orange-100/50">{pageStatus[activePage].text}</p>
      </div>
    </div>
  );
}
