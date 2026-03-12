import type { ReactNode } from "react";
import {
  BadgeCheck,
  Eye,
  FilePlus2,
  FileText,
  FolderPen,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { AppPage, RoleConfig, UserRole } from "../App";

interface NewsStudioProps {
  activePage: AppPage;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onPageChange: (page: AppPage) => void;
  roles: Record<UserRole, RoleConfig>;
}

const roleCapabilities: Record<UserRole, string[]> = {
  watcher: [
    "Полный доступ к админ-панели и ролям пользователей.",
    "Контроль публикаций, выпусков и системных заявок.",
    "Создание и редактирование газет без ограничений.",
  ],
  newspaperEditor: [
    "Создание новых газет и выпусков редакции.",
    "Редактирование материалов, заголовков и структуры номера.",
    "Работа с черновиками и подготовка публикации.",
  ],
  guest: [
    "Просмотр опубликованных материалов и сводок.",
    "Доступ к базовым страницам и помощи.",
    "Без прав на создание и редактирование контента.",
  ],
};

const publicationStats = [
  { label: "Активных выпусков", value: "12" },
  { label: "Черновиков", value: "05" },
  { label: "Редакторов онлайн", value: "08" },
  { label: "Заявок на роли", value: "03" },
];

const newspaperCards = [
  {
    title: "Los Santos Daily",
    status: "Опубликована",
    issue: "№148",
    editor: "Михаил Орлов",
  },
  {
    title: "Morning Vinewood",
    status: "Черновик",
    issue: "№021",
    editor: "Анна Савина",
  },
  {
    title: "State Bulletin",
    status: "На проверке",
    issue: "№067",
    editor: "Илья Воронцов",
  },
];

const adminRequests = [
  "Выдать роль редактора пользователю media.kira",
  "Проверить публикацию номера State Bulletin №067",
  "Подтвердить доступ к архиву выпусков",
];

function PageShell({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="relative z-10 w-full max-w-7xl">
      <div className="relative overflow-hidden rounded-[2rem] border-2 border-orange-600/30 bg-gradient-to-br from-orange-950/35 via-black/55 to-zinc-950/80 p-8 shadow-2xl shadow-orange-900/20 md:p-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(249,115,22,0.08)_50%,transparent_100%)] bg-[length:48px_48px]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,rgba(249,115,22,0.05)_50%,transparent_100%)] bg-[length:48px_48px]" />
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-orange-600/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-8 max-w-3xl">
            <div className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-orange-300">
              {eyebrow}
            </div>
            <h2 className="mt-4 text-3xl font-bold text-orange-50 md:text-4xl">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-orange-100/70 md:text-base">{text}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

function AccessDenied({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-red-500/20 bg-red-950/20 p-8">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-red-500/10 p-3 text-red-300">
          <Lock className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-red-100">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm text-red-100/70">{text}</p>
        </div>
      </div>
    </div>
  );
}

function OverviewPage({
  activeRole,
  onRoleChange,
  roles,
  onPageChange,
}: Pick<NewsStudioProps, "activeRole" | "onRoleChange" | "roles" | "onPageChange">) {
  return (
    <PageShell
      eyebrow="Главная"
      title="Базовые страницы редакционной системы"
      text="Здесь собраны основные переходы: обзор, список газет, создание, редактирование и панель следящих. Переключение роли сразу показывает, какие страницы и действия доступны."
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {publicationStats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-orange-700/30 bg-black/30 p-5"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-orange-500/70">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-orange-50">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-orange-700/30 bg-black/30 p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-orange-300" />
              <h3 className="text-xl font-semibold text-orange-50">Роли и права</h3>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {(Object.entries(roles) as [UserRole, RoleConfig][]).map(([roleKey, role]) => (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => onRoleChange(roleKey)}
                  className={`rounded-2xl border p-5 text-left transition-all ${
                    activeRole === roleKey
                      ? "border-orange-400 bg-orange-500/15 shadow-lg shadow-orange-900/20"
                      : "border-orange-800/30 bg-black/25 hover:border-orange-500/50 hover:bg-orange-950/25"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-lg font-semibold text-orange-100">{role.name}</span>
                    <BadgeCheck
                      className={`h-5 w-5 ${
                        activeRole === roleKey ? "text-orange-300" : "text-zinc-500"
                      }`}
                    />
                  </div>
                  <p className="mt-3 text-sm text-orange-100/70">{role.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <button
              type="button"
              onClick={() => onPageChange("create")}
              className="rounded-2xl border border-orange-700/30 bg-black/30 p-5 text-left transition hover:bg-orange-950/25"
            >
              <FilePlus2 className="h-6 w-6 text-orange-300" />
              <h4 className="mt-4 text-lg font-semibold text-orange-50">Создать газету</h4>
              <p className="mt-2 text-sm text-orange-100/65">
                Новый номер, шаблон, даты выхода и редактор.
              </p>
            </button>
            <button
              type="button"
              onClick={() => onPageChange("editor")}
              className="rounded-2xl border border-orange-700/30 bg-black/30 p-5 text-left transition hover:bg-orange-950/25"
            >
              <FolderPen className="h-6 w-6 text-orange-300" />
              <h4 className="mt-4 text-lg font-semibold text-orange-50">Редактировать</h4>
              <p className="mt-2 text-sm text-orange-100/65">
                Правки материалов, колонок и статусов публикации.
              </p>
            </button>
            <button
              type="button"
              onClick={() => onPageChange("admin")}
              className="rounded-2xl border border-orange-700/30 bg-black/30 p-5 text-left transition hover:bg-orange-950/25"
            >
              <ShieldCheck className="h-6 w-6 text-orange-300" />
              <h4 className="mt-4 text-lg font-semibold text-orange-50">Панель следящих</h4>
              <p className="mt-2 text-sm text-orange-100/65">
                Роли, заявки, модерация и системный контроль.
              </p>
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-orange-700/30 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-orange-500/80">
            Активная роль
          </p>
          <h3 className="mt-3 text-2xl font-bold text-orange-50">{roles[activeRole].name}</h3>
          <p className="mt-3 text-sm text-orange-100/70">{roles[activeRole].description}</p>

          <div className="mt-6 space-y-3">
            {roleCapabilities[activeRole].map((capability) => (
              <div
                key={capability}
                className="rounded-2xl border border-orange-800/25 bg-orange-950/20 px-4 py-3 text-sm text-orange-100/80"
              >
                {capability}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function NewspapersPage() {
  return (
    <PageShell
      eyebrow="Каталог"
      title="Список газет и выпусков"
      text="Базовая страница каталога показывает выпуски, редакторов и состояние номера. Здесь удобно начинать работу перед созданием или редактированием."
    >
      <div className="grid gap-4">
        {newspaperCards.map((item) => (
          <div
            key={item.title}
            className="grid gap-4 rounded-3xl border border-orange-700/30 bg-black/30 p-6 md:grid-cols-[1fr_auto_auto_auto] md:items-center"
          >
            <div>
              <h3 className="text-xl font-semibold text-orange-50">{item.title}</h3>
              <p className="mt-2 text-sm text-orange-100/65">
                Ответственный редактор: {item.editor}
              </p>
            </div>
            <div className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
              {item.issue}
            </div>
            <div className="rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-200">
              {item.status}
            </div>
            <button
              type="button"
              className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-400"
            >
              Открыть
            </button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function CreatePage({ activeRole }: Pick<NewsStudioProps, "activeRole">) {
  const hasAccess = activeRole === "watcher" || activeRole === "newspaperEditor";

  return (
    <PageShell
      eyebrow="Создание"
      title="Создание новой газеты"
      text="Страница для роли Следящий и Редактор газет. Здесь можно завести новый выпуск, назначить ответственного и подготовить публикацию."
    >
      {!hasAccess ? (
        <AccessDenied
          title="Создание недоступно"
          text="Эта страница открыта только для ролей Следящий и Редактор газет. Для гостя доступен только просмотр каталога и базовых страниц."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <div className="rounded-3xl border border-orange-700/30 bg-black/30 p-6">
            <h3 className="text-xl font-semibold text-orange-50">Форма нового выпуска</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                className="rounded-2xl border border-orange-800/30 bg-black/35 px-4 py-3 text-sm text-orange-50 outline-none"
                placeholder="Название газеты"
              />
              <input
                className="rounded-2xl border border-orange-800/30 bg-black/35 px-4 py-3 text-sm text-orange-50 outline-none"
                placeholder="Номер выпуска"
              />
              <input
                className="rounded-2xl border border-orange-800/30 bg-black/35 px-4 py-3 text-sm text-orange-50 outline-none"
                placeholder="Главный редактор"
              />
              <input
                className="rounded-2xl border border-orange-800/30 bg-black/35 px-4 py-3 text-sm text-orange-50 outline-none"
                placeholder="Дата выхода"
              />
            </div>
            <textarea
              className="mt-4 min-h-32 w-full rounded-2xl border border-orange-800/30 bg-black/35 px-4 py-3 text-sm text-orange-50 outline-none"
              placeholder="Краткое описание номера, главные темы и заметки для редакции"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
              >
                Создать выпуск
              </button>
              <button
                type="button"
                className="rounded-xl border border-orange-500/50 px-5 py-3 text-sm font-semibold text-orange-100 transition hover:bg-orange-500/10"
              >
                Сохранить как черновик
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-700/30 bg-black/35 p-6">
            <h3 className="text-xl font-semibold text-orange-50">Что заполняется</h3>
            <div className="mt-5 space-y-3 text-sm text-orange-100/75">
              <div className="rounded-2xl border border-orange-800/25 bg-orange-950/20 px-4 py-3">
                Название и номер газеты
              </div>
              <div className="rounded-2xl border border-orange-800/25 bg-orange-950/20 px-4 py-3">
                Назначение редактора и даты выпуска
              </div>
              <div className="rounded-2xl border border-orange-800/25 bg-orange-950/20 px-4 py-3">
                Описание номера и редакционные пометки
              </div>
              <div className="rounded-2xl border border-orange-800/25 bg-orange-950/20 px-4 py-3">
                Сохранение в черновик или публикационный поток
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function EditorPage({ activeRole }: Pick<NewsStudioProps, "activeRole">) {
  const hasAccess = activeRole === "watcher" || activeRole === "newspaperEditor";

  return (
    <PageShell
      eyebrow="Редактор"
      title="Редактирование газет и материалов"
      text="Рабочее место для изменения статей, блоков, обложки и публикационного статуса. Доступ открыт только ролям с правом редактирования."
    >
      {!hasAccess ? (
        <AccessDenied
          title="Редактирование недоступно"
          text="Гость не может менять материалы. Переключите роль на Следящий или Редактор газет, чтобы открыть редактор выпусков."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-orange-700/30 bg-black/30 p-6">
            <h3 className="text-xl font-semibold text-orange-50">Выбранный выпуск</h3>
            <div className="mt-5 space-y-4">
              {newspaperCards.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-orange-800/25 bg-orange-950/15 p-4"
                >
                  <p className="text-base font-semibold text-orange-100">{item.title}</p>
                  <p className="mt-1 text-sm text-orange-100/65">
                    {item.issue} • {item.status}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-orange-700/30 bg-black/35 p-6">
            <h3 className="text-xl font-semibold text-orange-50">Панель правок</h3>
            <input
              className="mt-5 w-full rounded-2xl border border-orange-800/30 bg-black/35 px-4 py-3 text-sm text-orange-50 outline-none"
              placeholder="Заголовок статьи"
            />
            <textarea
              className="mt-4 min-h-40 w-full rounded-2xl border border-orange-800/30 bg-black/35 px-4 py-3 text-sm text-orange-50 outline-none"
              placeholder="Текст статьи, изменения, подводка и редакционные комментарии"
            />
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                className="rounded-2xl border border-orange-800/30 bg-black/35 px-4 py-3 text-sm text-orange-50 outline-none"
                placeholder="Автор материала"
              />
              <input
                className="rounded-2xl border border-orange-800/30 bg-black/35 px-4 py-3 text-sm text-orange-50 outline-none"
                placeholder="Статус: черновик / готово"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
              >
                Сохранить правки
              </button>
              <button
                type="button"
                className="rounded-xl border border-orange-500/50 px-5 py-3 text-sm font-semibold text-orange-100 transition hover:bg-orange-500/10"
              >
                Отправить на публикацию
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function AdminPage({ activeRole }: Pick<NewsStudioProps, "activeRole">) {
  const hasAccess = activeRole === "watcher";

  return (
    <PageShell
      eyebrow="Админка"
      title="Панель следящих и админов"
      text="Здесь собраны базовые административные функции: управление ролями, подтверждение заявок и контроль действий редакции."
    >
      {!hasAccess ? (
        <AccessDenied
          title="Админ-панель закрыта"
          text="Полная панель следящих доступна только роли Следящий. Редактор газет может работать с выпусками, но не управляет ролями и системными заявками."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-orange-700/30 bg-black/30 p-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-orange-300" />
              <h3 className="text-xl font-semibold text-orange-50">Заявки и роли</h3>
            </div>
            <div className="mt-5 space-y-3">
              {adminRequests.map((request) => (
                <div
                  key={request}
                  className="rounded-2xl border border-orange-800/25 bg-orange-950/20 px-4 py-3 text-sm text-orange-100/80"
                >
                  {request}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-orange-700/30 bg-black/35 p-6">
              <h3 className="text-xl font-semibold text-orange-50">Выдача роли</h3>
              <div className="mt-5 space-y-4">
                <input
                  className="w-full rounded-2xl border border-orange-800/30 bg-black/35 px-4 py-3 text-sm text-orange-50 outline-none"
                  placeholder="Ник пользователя"
                />
                <select
                  className="w-full rounded-2xl border border-orange-800/30 bg-black/35 px-4 py-3 text-sm text-orange-50 outline-none"
                  defaultValue="newspaperEditor"
                >
                  <option value="watcher">Следящий</option>
                  <option value="newspaperEditor">Редактор газет</option>
                  <option value="guest">Гость</option>
                </select>
                <button
                  type="button"
                  className="w-full rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
                >
                  Применить роль
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-orange-700/30 bg-black/35 p-6">
              <h3 className="text-xl font-semibold text-orange-50">Системные действия</h3>
              <div className="mt-5 space-y-3 text-sm text-orange-100/75">
                <div className="rounded-2xl border border-orange-800/25 bg-orange-950/20 px-4 py-3">
                  Открыть журнал модерации
                </div>
                <div className="rounded-2xl border border-orange-800/25 bg-orange-950/20 px-4 py-3">
                  Проверить архив выпусков
                </div>
                <div className="rounded-2xl border border-orange-800/25 bg-orange-950/20 px-4 py-3">
                  Снять публикацию с проверки
                </div>
                <div className="rounded-2xl border border-orange-800/25 bg-orange-950/20 px-4 py-3">
                  Подтвердить доступ редакции
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function SupportPage() {
  return (
    <PageShell
      eyebrow="Справка"
      title="Базовые страницы и подсказки"
      text="Эта страница закрывает базовую часть интерфейса: что делает каждая роль, с чего начать работу и куда переходить для создания или редактирования."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-orange-700/30 bg-black/30 p-6">
          <Eye className="h-6 w-6 text-orange-300" />
          <h3 className="mt-4 text-lg font-semibold text-orange-50">Для гостя</h3>
          <p className="mt-2 text-sm text-orange-100/70">
            Доступен обзор, каталог газет и базовая справка без возможности менять данные.
          </p>
        </div>
        <div className="rounded-3xl border border-orange-700/30 bg-black/30 p-6">
          <FileText className="h-6 w-6 text-orange-300" />
          <h3 className="mt-4 text-lg font-semibold text-orange-50">Для редактора</h3>
          <p className="mt-2 text-sm text-orange-100/70">
            Можно создавать номера, редактировать материалы и отправлять выпуски на публикацию.
          </p>
        </div>
        <div className="rounded-3xl border border-orange-700/30 bg-black/30 p-6">
          <ShieldCheck className="h-6 w-6 text-orange-300" />
          <h3 className="mt-4 text-lg font-semibold text-orange-50">Для следящего</h3>
          <p className="mt-2 text-sm text-orange-100/70">
            Открыта админка, управление ролями, заявками и полный контроль публикаций.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

export function NewsStudio({
  activePage,
  activeRole,
  onRoleChange,
  onPageChange,
  roles,
}: NewsStudioProps) {
  const pageContent: Record<AppPage, ReactNode> = {
    overview: (
      <OverviewPage
        activeRole={activeRole}
        onRoleChange={onRoleChange}
        roles={roles}
        onPageChange={onPageChange}
      />
    ),
    newspapers: <NewspapersPage />,
    create: <CreatePage activeRole={activeRole} />,
    editor: <EditorPage activeRole={activeRole} />,
    admin: <AdminPage activeRole={activeRole} />,
    support: <SupportPage />,
  };

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-auto p-6 md:p-8 xl:p-10">
      {pageContent[activePage]}
    </div>
  );
}
