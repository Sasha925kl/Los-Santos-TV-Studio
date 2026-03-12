import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { TVFrame } from "./components/TVFrame";
import { NewsStudio } from "./components/NewsStudio";

export type UserRole = "watcher" | "newspaperEditor" | "guest";
export type AppPage =
  | "overview"
  | "newspapers"
  | "create"
  | "editor"
  | "admin"
  | "support";

export interface RoleConfig {
  name: string;
  description: string;
}

export const roles: Record<UserRole, RoleConfig> = {
  watcher: {
    name: "Следящий",
    description: "Полный доступ к админ-панели, ролям и публикациям.",
  },
  newspaperEditor: {
    name: "Редактор газет",
    description: "Создает, редактирует и выпускает номера газет.",
  },
  guest: {
    name: "Гость",
    description: "Просматривает материалы без прав на изменение.",
  },
};

function App() {
  const [activeRole, setActiveRole] = useState<UserRole>("watcher");
  const [activePage, setActivePage] = useState<AppPage>("overview");

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.18),transparent_30%),linear-gradient(135deg,#050505_0%,#121212_45%,#1a0d05_100%)]">
      <TopNav
        roleName={roles[activeRole].name}
        roleDescription={roles[activeRole].description}
        activePage={activePage}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage={activePage} onPageChange={setActivePage} />

        <NewsStudio
          activePage={activePage}
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          onPageChange={setActivePage}
          roles={roles}
        />

        <div className="hidden xl:flex w-[23rem] bg-gradient-to-l from-black/55 to-transparent p-6 items-start justify-end">
          <TVFrame
            activePage={activePage}
            roleName={roles[activeRole].name}
            roleDescription={roles[activeRole].description}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
