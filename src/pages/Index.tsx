import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";

type BiosItem = {
  key: string;
  value: string;
  editable: boolean;
  options?: string[];
  isProfile?: boolean;
  isEmpty?: boolean;
  isAction?: boolean;
  isDanger?: boolean;
};

const BIOS_DATA: Record<string, { label: string; icon: string; items: BiosItem[] }> = {
  system: {
    label: "Система",
    icon: "Monitor",
    items: [
      { key: "Производитель", value: "ASUS ROG MAXIMUS Z790", editable: false },
      { key: "Версия BIOS", value: "3.21.1428", editable: false },
      { key: "Дата выпуска", value: "2024-11-15", editable: false },
      { key: "Серийный номер", value: "K4B0CV123456", editable: false },
      { key: "UUID системы", value: "A1B2C3D4-E5F6-7890-ABCD-EF1234567890", editable: false },
      { key: "Режим платформы", value: "UEFI", editable: true, options: ["UEFI", "Legacy", "UEFI+CSM"] },
      { key: "Язык интерфейса", value: "Русский", editable: true, options: ["Русский", "English", "Deutsch"] },
      { key: "Пароль администратора", value: "Не задан", editable: true },
      { key: "TPM 2.0", value: "Включён", editable: true, options: ["Включён", "Выключен"] },
      { key: "Secure Boot", value: "Включён", editable: true, options: ["Включён", "Выключен"] },
    ],
  },
  cpu: {
    label: "Процессор",
    icon: "Cpu",
    items: [
      { key: "Модель", value: "Intel Core i9-14900K", editable: false },
      { key: "Архитектура", value: "Raptor Lake Refresh", editable: false },
      { key: "Ядра / Потоки", value: "24 / 32", editable: false },
      { key: "Базовая частота", value: "3.20 ГГц", editable: false },
      { key: "Макс. частота (Turbo)", value: "6.00 ГГц", editable: false },
      { key: "TDP", value: "125 Вт", editable: false },
      { key: "Кэш L3", value: "36 МБ", editable: false },
      { key: "Разгон (OC)", value: "Авто", editable: true, options: ["Авто", "Вручную", "XMP"] },
      { key: "C-States", value: "Включены", editable: true, options: ["Включены", "Выключены"] },
      { key: "Гиперпоточность", value: "Включена", editable: true, options: ["Включена", "Выключена"] },
      { key: "Температура CPU", value: "42°C", editable: false },
      { key: "Напряжение VCORE", value: "1.260 В", editable: true },
    ],
  },
  memory: {
    label: "Память",
    icon: "MemoryStick",
    items: [
      { key: "Тип памяти", value: "DDR5", editable: false },
      { key: "Объём (Слот A1)", value: "32 ГБ", editable: false },
      { key: "Объём (Слот B1)", value: "32 ГБ", editable: false },
      { key: "Итого", value: "64 ГБ", editable: false },
      { key: "Скорость", value: "DDR5-5600", editable: true, options: ["DDR5-4800", "DDR5-5200", "DDR5-5600", "DDR5-6000", "DDR5-6400"] },
      { key: "XMP / EXPO профиль", value: "XMP 3.0 — 5600 МГц", editable: true, options: ["Выключен", "XMP 3.0 — 5600 МГц", "XMP 3.0 — 6000 МГц"] },
      { key: "Тайминги", value: "36-36-36-76", editable: true },
      { key: "Напряжение VDDQ", value: "1.10 В", editable: true },
      { key: "Производитель", value: "G.SKILL Trident Z5 RGB", editable: false },
      { key: "Dual Channel", value: "Активен", editable: false },
    ],
  },
  storage: {
    label: "Накопители",
    icon: "HardDrive",
    items: [
      { key: "M.2 Слот 1 (PCIe 5.0)", value: "Samsung 990 Pro 2TB", editable: false },
      { key: "M.2 Слот 1 — Интерфейс", value: "NVMe PCIe 5.0 x4", editable: false },
      { key: "M.2 Слот 1 — Скорость чт.", value: "14 800 МБ/с", editable: false },
      { key: "M.2 Слот 2 (PCIe 4.0)", value: "WD Black SN850X 1TB", editable: false },
      { key: "M.2 Слот 2 — Интерфейс", value: "NVMe PCIe 4.0 x4", editable: false },
      { key: "SATA порт 1", value: "Seagate Barracuda 4TB", editable: false },
      { key: "SATA порт 2", value: "Не установлен", editable: false },
      { key: "AHCI режим", value: "Включён", editable: true, options: ["Включён", "Выключен"] },
      { key: "Smart мониторинг", value: "Активен", editable: true, options: ["Активен", "Выключен"] },
    ],
  },
  boot: {
    label: "Загрузка",
    icon: "Play",
    items: [
      { key: "Порядок загрузки #1", value: "Samsung 990 Pro (NVMe)", editable: true, options: ["Samsung 990 Pro (NVMe)", "WD Black SN850X (NVMe)", "USB Drive", "PXE Network"] },
      { key: "Порядок загрузки #2", value: "WD Black SN850X (NVMe)", editable: true, options: ["Samsung 990 Pro (NVMe)", "WD Black SN850X (NVMe)", "USB Drive", "PXE Network"] },
      { key: "Порядок загрузки #3", value: "USB Drive", editable: true, options: ["Samsung 990 Pro (NVMe)", "WD Black SN850X (NVMe)", "USB Drive", "PXE Network"] },
      { key: "Fast Boot", value: "Включён", editable: true, options: ["Включён", "Выключен"] },
      { key: "POST задержка", value: "2 секунды", editable: true, options: ["0 секунд", "1 секунда", "2 секунды", "5 секунд"] },
      { key: "Экран POST", value: "Logo", editable: true, options: ["Logo", "POST Info", "Полная информация"] },
      { key: "PXE Boot", value: "Выключен", editable: true, options: ["Включён", "Выключен"] },
      { key: "CSM поддержка", value: "Выключена", editable: true, options: ["Включена", "Выключена"] },
    ],
  },
  save: {
    label: "Сохранение",
    icon: "Save",
    items: [
      { key: "Профиль 1", value: "Overclock 5.8GHz — 12.03.2025", editable: false, isProfile: true },
      { key: "Профиль 2", value: "Stock Settings — 01.02.2025", editable: false, isProfile: true },
      { key: "Профиль 3", value: "Пусто", editable: false, isProfile: true, isEmpty: true },
      { key: "Профиль 4", value: "Пусто", editable: false, isProfile: true, isEmpty: true },
      { key: "Профиль 5", value: "Пусто", editable: false, isProfile: true, isEmpty: true },
      { key: "Загрузить профиль", value: "—", editable: true, isAction: true },
      { key: "Сохранить текущий", value: "—", editable: true, isAction: true },
      { key: "Сбросить до заводских", value: "—", editable: false, isAction: true, isDanger: true },
      { key: "Экспортировать на USB", value: "—", editable: false, isAction: true },
    ],
  },
};

type SectionKey = keyof typeof BIOS_DATA;

export default function Index() {
  const [activeSection, setActiveSection] = useState<SectionKey>("system");
  const [search, setSearch] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [time, setTime] = useState(() => new Date());

  useState(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  });

  const section = BIOS_DATA[activeSection];

  const allItems = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    const results: Array<{ section: string; key: string; value: string; editable: boolean }> = [];
    for (const [, sVal] of Object.entries(BIOS_DATA)) {
      for (const item of sVal.items) {
        if (item.key.toLowerCase().includes(q) || item.value.toLowerCase().includes(q)) {
          results.push({ section: sVal.label, key: item.key, value: values[item.key] ?? item.value, editable: item.editable });
        }
      }
    }
    return results;
  }, [search, values]);

  const displayItems = search.trim() ? null : section.items.map((i) => ({ ...i, value: values[i.key] ?? i.value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setEditingKey(null);
  };

  return (
    <div className="bios-root">
      <div className="bios-bg" />

      <header className="bios-header">
        <div className="bios-header-left">
          <div className="bios-logo">
            <span className="bios-logo-brand">ROG</span>
            <span className="bios-logo-sep">|</span>
            <span className="bios-logo-title">UEFI BIOS Utility</span>
            <span className="bios-version">v3.21</span>
          </div>
        </div>
        <div className="bios-header-center">
          <div className="bios-search-wrap">
            <Icon name="Search" size={14} className="bios-search-icon" />
            <input
              className="bios-search"
              placeholder="Поиск параметров..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="bios-search-clear" onClick={() => setSearch("")}>
                <Icon name="X" size={12} />
              </button>
            )}
          </div>
        </div>
        <div className="bios-header-right">
          <div className="bios-clock">{time.toLocaleTimeString("ru-RU")}</div>
          <div className="bios-date">
            {time.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>
      </header>

      <div className="bios-body">
        {!search.trim() && (
          <nav className="bios-nav">
            {(Object.keys(BIOS_DATA) as SectionKey[]).map((key) => {
              const s = BIOS_DATA[key];
              const isActive = activeSection === key;
              return (
                <button
                  key={key}
                  className={`bios-nav-item ${isActive ? "active" : ""}`}
                  onClick={() => setActiveSection(key)}
                >
                  <Icon name={s.icon} size={16} className="bios-nav-icon" />
                  <span>{s.label}</span>
                  {isActive && <div className="bios-nav-active-bar" />}
                </button>
              );
            })}
            <div className="bios-nav-spacer" />
            <button className={`bios-btn-save ${saved ? "saved" : ""}`} onClick={handleSave}>
              <Icon name={saved ? "Check" : "Save"} size={14} />
              <span>{saved ? "Сохранено!" : "Сохранить"}</span>
            </button>
            <button className="bios-btn-exit" onClick={() => {}}>
              <Icon name="LogOut" size={14} />
              <span>Выход</span>
            </button>
          </nav>
        )}

        <main className="bios-main">
          {search.trim() ? (
            <div className="bios-section-wrap">
              <div className="bios-section-header">
                <h2 className="bios-section-title">
                  <Icon name="Search" size={18} />
                  Результаты поиска
                </h2>
                <span className="bios-section-count">{allItems?.length} найдено</span>
              </div>
              <div className="bios-table">
                {allItems && allItems.length === 0 && (
                  <div className="bios-empty">Ничего не найдено</div>
                )}
                {allItems?.map((item, i) => (
                  <div key={i} className="bios-row">
                    <div className="bios-row-key">
                      <span className="bios-row-section-tag">{item.section}</span>
                      {item.key}
                    </div>
                    <div className="bios-row-value">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bios-section-wrap">
              <div className="bios-section-header">
                <h2 className="bios-section-title">
                  <Icon name={section.icon} size={18} />
                  {section.label}
                </h2>
                <span className="bios-section-count">{displayItems?.length} параметров</span>
              </div>
              <div className="bios-table">
                {displayItems?.map((item: BiosItem & { value: string }, i) => (
                  <div
                    key={i}
                    className={[
                      "bios-row",
                      item.editable ? "editable" : "",
                      item.isProfile ? "profile-row" : "",
                      item.isDanger ? "danger-row" : "",
                      item.isEmpty ? "empty-row" : "",
                      item.isAction ? "action-row" : "",
                    ].join(" ")}
                    onClick={() => item.editable && setEditingKey(editingKey === item.key ? null : item.key)}
                  >
                    <div className="bios-row-key">
                      {item.key}
                      {item.editable && <Icon name="ChevronRight" size={12} className="bios-edit-hint" />}
                    </div>
                    <div className="bios-row-value">
                      {editingKey === item.key ? (
                        item.options ? (
                          <select
                            className="bios-select"
                            value={item.value}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              setValues((v) => ({ ...v, [item.key]: e.target.value }));
                              setEditingKey(null);
                            }}
                          >
                            {item.options.map((o: string) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            className="bios-input"
                            defaultValue={item.value}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setValues((v) => ({ ...v, [item.key]: (e.target as HTMLInputElement).value }));
                                setEditingKey(null);
                              }
                              if (e.key === "Escape") setEditingKey(null);
                            }}
                            onBlur={(e) => {
                              setValues((v) => ({ ...v, [item.key]: e.target.value }));
                              setEditingKey(null);
                            }}
                          />
                        )
                      ) : (
                        <span className={`bios-val ${item.isEmpty ? "empty" : ""} ${item.isDanger ? "danger" : ""}`}>
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="bios-footer">
        <div className="bios-footer-keys">
          <span><kbd>↑↓</kbd> Навигация</span>
          <span><kbd>Enter</kbd> Изменить</span>
          <span><kbd>Esc</kbd> Отмена</span>
          <span><kbd>F5</kbd> Заводские настройки</span>
          <span><kbd>F10</kbd> Сохранить и выйти</span>
        </div>
        <div className="bios-footer-status">
          <span className={`bios-status-dot ${saved ? "green" : "blue"}`} />
          <span>{saved ? "Изменения сохранены" : "Режим настройки UEFI"}</span>
        </div>
      </footer>
    </div>
  );
}
