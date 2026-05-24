import { useState, useMemo, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Lang = "ru" | "en";

type BiosItem = {
  key: string;
  keyEn?: string;
  value: string;
  valueEn?: string;
  editable: boolean;
  options?: string[];
  optionsEn?: string[];
  isProfile?: boolean;
  isEmpty?: boolean;
  isAction?: boolean;
  isDanger?: boolean;
};

const UI: Record<Lang, {
  title: string;
  search: string;
  searchResults: string;
  found: string;
  params: string;
  save: string;
  saved: string;
  exit: string;
  nothing: string;
  status: string;
  nav: Record<string, string>;
  footer: { nav: string; edit: string; cancel: string; reset: string; saveExit: string };
}> = {
  ru: {
    title: "Click BIOS 5",
    search: "Поиск параметров...",
    searchResults: "Результаты поиска",
    found: "найдено",
    params: "параметров",
    save: "Сохранить",
    saved: "Сохранено!",
    exit: "Выход",
    nothing: "Ничего не найдено",
    status: "Режим настройки UEFI",
    nav: { system: "Система", cpu: "Процессор", memory: "Память", storage: "Накопители", boot: "Загрузка", save: "Сохранение" },
    footer: { nav: "Навигация", edit: "Изменить", cancel: "Отмена", reset: "Заводские настройки", saveExit: "Сохранить и выйти" },
  },
  en: {
    title: "Click BIOS 5",
    search: "Search settings...",
    searchResults: "Search Results",
    found: "found",
    params: "parameters",
    save: "Save",
    saved: "Saved!",
    exit: "Exit",
    nothing: "Nothing found",
    status: "UEFI Setup Mode",
    nav: { system: "System", cpu: "Processor", memory: "Memory", storage: "Storage", boot: "Boot", save: "Save & Exit" },
    footer: { nav: "Navigate", edit: "Edit", cancel: "Cancel", reset: "Load Defaults", saveExit: "Save & Exit" },
  },
};

const BIOS_DATA: Record<string, { label: string; labelEn: string; icon: string; items: BiosItem[] }> = {
  system: {
    label: "Система", labelEn: "System",
    icon: "Monitor",
    items: [
      { key: "Производитель", keyEn: "Manufacturer", value: "MSI MEG Z790 ACE", editable: false },
      { key: "Версия BIOS", keyEn: "BIOS Version", value: "3.21.1428", editable: false },
      { key: "Дата выпуска", keyEn: "Release Date", value: "2024-11-15", editable: false },
      { key: "Серийный номер", keyEn: "Serial Number", value: "K4B0CV123456", editable: false },
      { key: "UUID системы", keyEn: "System UUID", value: "A1B2C3D4-E5F6-7890-ABCD-EF1234567890", editable: false },
      { key: "Режим платформы", keyEn: "Platform Mode", value: "UEFI", editable: true, options: ["UEFI", "Legacy", "UEFI+CSM"], optionsEn: ["UEFI", "Legacy", "UEFI+CSM"] },
      { key: "Язык интерфейса", keyEn: "Interface Language", value: "Русский", valueEn: "English", editable: true, options: ["Русский", "English", "Deutsch"], optionsEn: ["Russian", "English", "German"] },
      { key: "Пароль администратора", keyEn: "Admin Password", value: "Не задан", valueEn: "Not set", editable: true },
      { key: "TPM 2.0", keyEn: "TPM 2.0", value: "Включён", valueEn: "Enabled", editable: true, options: ["Включён", "Выключен"], optionsEn: ["Enabled", "Disabled"] },
      { key: "Secure Boot", keyEn: "Secure Boot", value: "Включён", valueEn: "Enabled", editable: true, options: ["Включён", "Выключен"], optionsEn: ["Enabled", "Disabled"] },
    ],
  },
  cpu: {
    label: "Процессор", labelEn: "Processor",
    icon: "Cpu",
    items: [
      { key: "Модель", keyEn: "Model", value: "Intel Xeon i9-14900K", editable: false },
      { key: "Архитектура", keyEn: "Architecture", value: "Raptor Lake Refresh", editable: false },
      { key: "Ядра / Потоки", keyEn: "Cores / Threads", value: "24 / 32", editable: false },
      { key: "Базовая частота", keyEn: "Base Clock", value: "3.20 ГГц", valueEn: "3.20 GHz", editable: false },
      { key: "Макс. частота (Turbo)", keyEn: "Max Turbo Freq.", value: "6.00 ГГц", valueEn: "6.00 GHz", editable: false },
      { key: "TDP", keyEn: "TDP", value: "253 Вт", valueEn: "253 W", editable: false },
      { key: "Кэш L3", keyEn: "L3 Cache", value: "36 МБ", valueEn: "36 MB", editable: false },
      { key: "Разгон (OC)", keyEn: "Overclocking", value: "Авто", valueEn: "Auto", editable: true, options: ["Авто", "Вручную", "XMP"], optionsEn: ["Auto", "Manual", "XMP"] },
      { key: "C-States", keyEn: "C-States", value: "Включены", valueEn: "Enabled", editable: true, options: ["Включены", "Выключены"], optionsEn: ["Enabled", "Disabled"] },
      { key: "Гиперпоточность", keyEn: "Hyper-Threading", value: "Включена", valueEn: "Enabled", editable: true, options: ["Включена", "Выключена"], optionsEn: ["Enabled", "Disabled"] },
      { key: "Температура CPU", keyEn: "CPU Temperature", value: "42°C", editable: false },
      { key: "Напряжение VCORE", keyEn: "VCORE Voltage", value: "1.260 В", valueEn: "1.260 V", editable: true },
    ],
  },
  memory: {
    label: "Память", labelEn: "Memory",
    icon: "MemoryStick",
    items: [
      { key: "Тип памяти", keyEn: "Memory Type", value: "DDR5", editable: false },
      { key: "Объём (Слот A1)", keyEn: "Size (Slot A1)", value: "32 ГБ", valueEn: "32 GB", editable: false },
      { key: "Объём (Слот B1)", keyEn: "Size (Slot B1)", value: "32 ГБ", valueEn: "32 GB", editable: false },
      { key: "Итого", keyEn: "Total", value: "64 ГБ", valueEn: "64 GB", editable: false },
      { key: "Скорость", keyEn: "Speed", value: "DDR5-5600", editable: true, options: ["DDR5-4800", "DDR5-5200", "DDR5-5600", "DDR5-6000", "DDR5-6400"], optionsEn: ["DDR5-4800", "DDR5-5200", "DDR5-5600", "DDR5-6000", "DDR5-6400"] },
      { key: "XMP / EXPO профиль", keyEn: "XMP / EXPO Profile", value: "XMP 3.0 — 5600 МГц", valueEn: "XMP 3.0 — 5600 MHz", editable: true, options: ["Выключен", "XMP 3.0 — 5600 МГц", "XMP 3.0 — 6000 МГц"], optionsEn: ["Disabled", "XMP 3.0 — 5600 MHz", "XMP 3.0 — 6000 MHz"] },
      { key: "Тайминги", keyEn: "Timings", value: "36-36-36-76", editable: true },
      { key: "Напряжение VDDQ", keyEn: "VDDQ Voltage", value: "1.10 В", valueEn: "1.10 V", editable: true },
      { key: "Производитель", keyEn: "Manufacturer", value: "G.SKILL Trident Z5 RGB", editable: false },
      { key: "Dual Channel", keyEn: "Dual Channel", value: "Активен", valueEn: "Active", editable: false },
    ],
  },
  storage: {
    label: "Накопители", labelEn: "Storage",
    icon: "HardDrive",
    items: [
      { key: "M.2 Слот 1 (PCIe 5.0)", keyEn: "M.2 Slot 1 (PCIe 5.0)", value: "Samsung 990 Pro 2TB", editable: false },
      { key: "M.2 Слот 1 — Интерфейс", keyEn: "M.2 Slot 1 — Interface", value: "NVMe PCIe 5.0 x4", editable: false },
      { key: "M.2 Слот 1 — Скорость чт.", keyEn: "M.2 Slot 1 — Read Speed", value: "14 800 МБ/с", valueEn: "14 800 MB/s", editable: false },
      { key: "M.2 Слот 2 (PCIe 4.0)", keyEn: "M.2 Slot 2 (PCIe 4.0)", value: "WD Black SN850X 1TB", editable: false },
      { key: "M.2 Слот 2 — Интерфейс", keyEn: "M.2 Slot 2 — Interface", value: "NVMe PCIe 4.0 x4", editable: false },
      { key: "SATA порт 1", keyEn: "SATA Port 1", value: "Seagate Barracuda 4TB", editable: false },
      { key: "SATA порт 2", keyEn: "SATA Port 2", value: "Не установлен", valueEn: "Not installed", editable: false },
      { key: "AHCI режим", keyEn: "AHCI Mode", value: "Включён", valueEn: "Enabled", editable: true, options: ["Включён", "Выключен"], optionsEn: ["Enabled", "Disabled"] },
      { key: "Smart мониторинг", keyEn: "S.M.A.R.T. Monitoring", value: "Активен", valueEn: "Active", editable: true, options: ["Активен", "Выключен"], optionsEn: ["Active", "Disabled"] },
    ],
  },
  boot: {
    label: "Загрузка", labelEn: "Boot",
    icon: "Play",
    items: [
      { key: "Порядок загрузки #1", keyEn: "Boot Order #1", value: "Samsung 990 Pro (NVMe)", editable: true, options: ["Samsung 990 Pro (NVMe)", "WD Black SN850X (NVMe)", "USB Drive", "PXE Network"], optionsEn: ["Samsung 990 Pro (NVMe)", "WD Black SN850X (NVMe)", "USB Drive", "PXE Network"] },
      { key: "Порядок загрузки #2", keyEn: "Boot Order #2", value: "WD Black SN850X (NVMe)", editable: true, options: ["Samsung 990 Pro (NVMe)", "WD Black SN850X (NVMe)", "USB Drive", "PXE Network"], optionsEn: ["Samsung 990 Pro (NVMe)", "WD Black SN850X (NVMe)", "USB Drive", "PXE Network"] },
      { key: "Порядок загрузки #3", keyEn: "Boot Order #3", value: "USB Drive", editable: true, options: ["Samsung 990 Pro (NVMe)", "WD Black SN850X (NVMe)", "USB Drive", "PXE Network"], optionsEn: ["Samsung 990 Pro (NVMe)", "WD Black SN850X (NVMe)", "USB Drive", "PXE Network"] },
      { key: "Fast Boot", keyEn: "Fast Boot", value: "Включён", valueEn: "Enabled", editable: true, options: ["Включён", "Выключен"], optionsEn: ["Enabled", "Disabled"] },
      { key: "POST задержка", keyEn: "POST Delay", value: "2 секунды", valueEn: "2 seconds", editable: true, options: ["0 секунд", "1 секунда", "2 секунды", "5 секунд"], optionsEn: ["0 seconds", "1 second", "2 seconds", "5 seconds"] },
      { key: "Экран POST", keyEn: "POST Screen", value: "Logo", editable: true, options: ["Logo", "POST Info", "Полная информация"], optionsEn: ["Logo", "POST Info", "Full Info"] },
      { key: "PXE Boot", keyEn: "PXE Boot", value: "Выключен", valueEn: "Disabled", editable: true, options: ["Включён", "Выключен"], optionsEn: ["Enabled", "Disabled"] },
      { key: "CSM поддержка", keyEn: "CSM Support", value: "Выключена", valueEn: "Disabled", editable: true, options: ["Включена", "Выключена"], optionsEn: ["Enabled", "Disabled"] },
    ],
  },
  save: {
    label: "Сохранение", labelEn: "Save & Exit",
    icon: "Save",
    items: [
      { key: "Профиль 1", keyEn: "Profile 1", value: "Overclock 5.8GHz — 12.03.2025", editable: false, isProfile: true },
      { key: "Профиль 2", keyEn: "Profile 2", value: "Stock Settings — 01.02.2025", editable: false, isProfile: true },
      { key: "Профиль 3", keyEn: "Profile 3", value: "Пусто", valueEn: "Empty", editable: false, isProfile: true, isEmpty: true },
      { key: "Профиль 4", keyEn: "Profile 4", value: "Пусто", valueEn: "Empty", editable: false, isProfile: true, isEmpty: true },
      { key: "Профиль 5", keyEn: "Profile 5", value: "Пусто", valueEn: "Empty", editable: false, isProfile: true, isEmpty: true },
      { key: "Загрузить профиль", keyEn: "Load Profile", value: "—", editable: true, isAction: true },
      { key: "Сохранить текущий", keyEn: "Save Current", value: "—", editable: true, isAction: true },
      { key: "Сбросить до заводских", keyEn: "Load Factory Defaults", value: "—", editable: false, isAction: true, isDanger: true },
      { key: "Экспортировать на USB", keyEn: "Export to USB", value: "—", editable: false, isAction: true },
    ],
  },
};

type SectionKey = keyof typeof BIOS_DATA;

const POST_LINES = [
  { text: "MSI Click BIOS 5  v3.21.1428", delay: 0, color: "#ff3333" },
  { text: "Copyright (C) 2024 Micro-Star International Co., Ltd.", delay: 120, color: "#888" },
  { text: "", delay: 200 },
  { text: "CPU: Intel Xeon i9-14900K @ 3.20GHz", delay: 350, color: "#c8d0e8" },
  { text: "Cores: 24  Threads: 32  Cache L3: 36MB", delay: 500, color: "#c8d0e8" },
  { text: "CPU Temperature: 42°C  VCORE: 1.260V", delay: 650, color: "#c8d0e8" },
  { text: "", delay: 720 },
  { text: "Memory Test: DDR5-5600  64GB  Dual Channel", delay: 850, color: "#c8d0e8" },
  { text: "Slot A1: 32768MB  Slot B1: 32768MB", delay: 1000, color: "#aaa" },
  { text: "Memory Test ..... OK", delay: 1250, color: "#2aff9a" },
  { text: "", delay: 1350 },
  { text: "Detecting NVMe devices...", delay: 1500, color: "#c8d0e8" },
  { text: "  [M.2-1] Samsung 990 Pro 2TB  PCIe 5.0 x4", delay: 1700, color: "#aaa" },
  { text: "  [M.2-2] WD Black SN850X 1TB  PCIe 4.0 x4", delay: 1850, color: "#aaa" },
  { text: "  [SATA1] Seagate Barracuda 4TB", delay: 2000, color: "#aaa" },
  { text: "", delay: 2100 },
  { text: "Secure Boot: ON   TPM 2.0: ON   Fast Boot: ON", delay: 2200, color: "#c8d0e8" },
  { text: "", delay: 2350 },
  { text: "Press [DEL] to enter BIOS Setup", delay: 2500, color: "#ff3333", blink: true },
  { text: "Press [F11] to enter Boot Menu", delay: 2650, color: "#ffaa00" },
  { text: "", delay: 2750 },
  { text: "Entering BIOS Setup...", delay: 2900, color: "#7c9cff" },
];

function PostScreen({ onDone }: { onDone: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    POST_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), line.delay));
    });
    timers.push(setTimeout(() => setDone(true), 3300));
    timers.push(setTimeout(() => onDone(), 3900));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className={`post-screen ${done ? "post-fade-out" : ""}`}>
      <div className="post-scanlines" />
      <div className="post-content">
        {POST_LINES.slice(0, visibleCount).map((line, i) => (
          <div key={i} className={`post-line ${line.blink ? "post-blink" : ""}`} style={{ color: line.color || "#c8d0e8" }}>
            {line.text || "\u00a0"}
          </div>
        ))}
        {visibleCount >= POST_LINES.length && (
          <div className="post-bar-wrap">
            <div className="post-bar" />
          </div>
        )}
      </div>
      <div className="post-skip" onClick={onDone}>
        Press any key to skip ›
      </div>
    </div>
  );
}

export default function Index() {
  const [postDone, setPostDone] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>("system");
  const [search, setSearch] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [time, setTime] = useState(() => new Date());
  const [lang, setLang] = useState<Lang>("ru");
  const [exitModal, setExitModal] = useState(false);
  const [exiting, setExiting] = useState(false);

  useState(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  });

  const t = UI[lang];
  const section = BIOS_DATA[activeSection];

  const getKey = (item: BiosItem) => lang === "en" && item.keyEn ? item.keyEn : item.key;
  const getValue = (item: BiosItem) => {
    const stored = values[item.key];
    if (stored) return stored;
    return lang === "en" && item.valueEn ? item.valueEn : item.value;
  };
  const getOptions = (item: BiosItem) => lang === "en" && item.optionsEn ? item.optionsEn : (item.options ?? []);

  const handleLangChange = (newVal: string) => {
    const newLang: Lang = newVal === "English" || newVal === "Russian" ? "en" : "ru";
    setLang(newLang);
    setValues((v) => ({ ...v, ["Язык интерфейса"]: newVal }));
    setEditingKey(null);
  };

  const allItems = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    const results: Array<{ section: string; key: string; value: string; editable: boolean }> = [];
    for (const [, sVal] of Object.entries(BIOS_DATA)) {
      for (const item of sVal.items) {
        const k = lang === "en" && item.keyEn ? item.keyEn : item.key;
        const v = getValue(item);
        if (k.toLowerCase().includes(q) || v.toLowerCase().includes(q)) {
          results.push({ section: lang === "en" ? sVal.labelEn : sVal.label, key: k, value: v, editable: item.editable });
        }
      }
    }
    return results;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, values, lang]);

  const displayItems = search.trim() ? null : section.items.map((i) => ({ ...i, displayKey: getKey(i), displayValue: getValue(i), displayOptions: getOptions(i) }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setEditingKey(null);
  };

  const handleSaveAndExit = () => {
    setSaved(true);
    setExiting(true);
    setTimeout(() => {
      setPostDone(false);
      setExiting(false);
      setSaved(false);
      setExitModal(false);
    }, 1800);
  };

  const locale = lang === "en" ? "en-US" : "ru-RU";

  if (!postDone) {
    return <PostScreen onDone={() => setPostDone(true)} />;
  }

  return (
    <div className="bios-root">
      <div className="bios-bg" />

      <header className="bios-header">
        <div className="bios-header-left">
          <div className="bios-logo">
            <span className="bios-logo-brand">MSI</span>
            <span className="bios-logo-sep">|</span>
            <span className="bios-logo-title">{t.title}</span>
            <span className="bios-version">v3.21</span>
            <button className="bios-post-btn" onClick={() => setPostDone(false)} title="Show POST screen">
              <Icon name="Power" size={12} />
              POST
            </button>
          </div>
        </div>
        <div className="bios-header-center">
          <div className="bios-search-wrap">
            <Icon name="Search" size={14} className="bios-search-icon" />
            <input
              className="bios-search"
              placeholder={t.search}
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
          <div className="bios-clock">{time.toLocaleTimeString(locale)}</div>
          <div className="bios-date">
            {time.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" })}
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
                  <span>{t.nav[key]}</span>
                  {isActive && <div className="bios-nav-active-bar" />}
                </button>
              );
            })}
            <div className="bios-nav-spacer" />
            <button className={`bios-btn-save ${saved ? "saved" : ""}`} onClick={handleSave}>
              <Icon name={saved ? "Check" : "Save"} size={14} />
              <span>{saved ? t.saved : t.save}</span>
            </button>
            <button className="bios-btn-save-exit" onClick={() => setExitModal(true)}>
              <Icon name="LogOut" size={14} />
              <span>{lang === "en" ? "Save & Exit" : "Сохранить и выйти"}</span>
            </button>
          </nav>
        )}

        <main className="bios-main">
          {search.trim() ? (
            <div className="bios-section-wrap">
              <div className="bios-section-header">
                <h2 className="bios-section-title">
                  <Icon name="Search" size={18} />
                  {t.searchResults}
                </h2>
                <span className="bios-section-count">{allItems?.length} {t.found}</span>
              </div>
              <div className="bios-table">
                {allItems && allItems.length === 0 && (
                  <div className="bios-empty">{t.nothing}</div>
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
                  {lang === "en" ? section.labelEn : section.label}
                </h2>
                <span className="bios-section-count">{displayItems?.length} {t.params}</span>
              </div>
              <div className="bios-table">
                {displayItems?.map((item, i) => (
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
                      {item.displayKey}
                      {item.editable && <Icon name="ChevronRight" size={12} className="bios-edit-hint" />}
                    </div>
                    <div className="bios-row-value">
                      {editingKey === item.key ? (
                        item.options ? (
                          <select
                            className="bios-select"
                            value={item.displayValue}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              if (item.key === "Язык интерфейса") {
                                handleLangChange(e.target.value);
                              } else {
                                setValues((v) => ({ ...v, [item.key]: e.target.value }));
                                setEditingKey(null);
                              }
                            }}
                          >
                            {item.displayOptions.map((o: string) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            className="bios-input"
                            defaultValue={item.displayValue}
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
                          {item.displayValue}
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
          <span><kbd>↑↓</kbd> {t.footer.nav}</span>
          <span><kbd>Enter</kbd> {t.footer.edit}</span>
          <span><kbd>Esc</kbd> {t.footer.cancel}</span>
          <span><kbd>F5</kbd> {t.footer.reset}</span>
          <span><kbd>F10</kbd> {t.footer.saveExit}</span>
        </div>
        <div className="bios-footer-status">
          <span className={`bios-status-dot ${saved ? "green" : "blue"}`} />
          <span>{saved ? (lang === "en" ? "Changes saved" : "Изменения сохранены") : t.status}</span>
        </div>
      </footer>

      {/* Save & Exit Modal */}
      {exitModal && (
        <div className="bios-modal-overlay" onClick={() => !exiting && setExitModal(false)}>
          <div className="bios-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bios-modal-icon">
              <Icon name={exiting ? "Check" : "Save"} size={28} />
            </div>
            <div className="bios-modal-title">
              {lang === "en" ? "Save & Exit Setup" : "Сохранить и выйти"}
            </div>
            <div className="bios-modal-desc">
              {exiting
                ? (lang === "en" ? "Saving changes and rebooting..." : "Сохранение настроек и перезагрузка...")
                : (lang === "en" ? "Save all changes and exit BIOS Setup?" : "Сохранить все изменения и выйти из настроек BIOS?")
              }
            </div>
            {exiting ? (
              <div className="bios-modal-progress">
                <div className="bios-modal-bar" />
              </div>
            ) : (
              <div className="bios-modal-actions">
                <button className="bios-modal-confirm" onClick={handleSaveAndExit}>
                  <Icon name="Check" size={14} />
                  {lang === "en" ? "Yes, Save & Exit" : "Да, сохранить и выйти"}
                </button>
                <button className="bios-modal-cancel" onClick={() => setExitModal(false)}>
                  <Icon name="X" size={14} />
                  {lang === "en" ? "Cancel" : "Отмена"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}