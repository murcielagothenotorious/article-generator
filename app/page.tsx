"use client";

/* eslint-disable @next/next/no-img-element */

import { CSSProperties, ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { toCanvas, toPng } from "html-to-image";

type BlockType =
  | "section"
  | "hero"
  | "caption"
  | "deck"
  | "byline"
  | "paragraph"
  | "image"
  | "rule"
  | "orgchart"
  | "photoquote"
  | "authorcard"
  | "custom";

type Block = {
  id: string;
  categoryId: string;
  type: BlockType;
  label: string;
  className: string;
  hidden?: boolean;
  fields: Record<string, string>;
  orgNodes?: OrgNode[];
};

type OrgNode = {
  name: string;
  rank: string;
  tone: "boss" | "underboss" | "soldier" | "node";
};

type ArticleSettings = {
  dateLine: string;
  edition: string;
  volume: string;
  price: string;
  masthead: string;
  tagline: string;
  layoutPreset: string;
  pageWidth: string;
  pagePadding: string;
  pageMinHeight: string;
  exportSectionHeight: string;
  rhythm: string;
  gridSize: string;
  showGuides: string;
  bodyFont: string;
  headingFont: string;
  headerFont: string;
  headerWeight: string;
  sansFont: string;
};

type Category = {
  id: string;
  name: string;
  navLabel: string;
};

const blockCatalog: Array<{ type: BlockType; label: string; region: string }> = [
  { type: "section", label: "Bölüm etiketi", region: "Sayfa" },
  { type: "hero", label: "Hero görsel", region: "Sayfa" },
  { type: "caption", label: "Görsel altyazı", region: "Sayfa" },
  { type: "deck", label: "Spot / deck", region: "Sayfa" },
  { type: "byline", label: "Yazar satırı", region: "Sayfa" },
  { type: "paragraph", label: "Paragraf", region: "Gövde" },
  { type: "image", label: "Fotoğraf", region: "Gövde" },
  { type: "rule", label: "Ayraç", region: "Gövde" },
  { type: "orgchart", label: "Organizasyon şeması", region: "Gövde" },
  { type: "photoquote", label: "Fotoğraf + alıntı", region: "Gövde" },
  { type: "authorcard", label: "Yazar kartı", region: "Gövde" },
  { type: "custom", label: "Özel div", region: "Gövde" },
];

const defaultSettings: ArticleSettings = {
  dateLine: "Tarih",
  edition: "Edition",
  volume: "Vol. 001 · No. 001",
  price: "$0.00",
  masthead: "Gazete Adı",
  tagline: "Slogan veya yayın bilgisi",
  layoutPreset: "classic",
  pageWidth: "750",
  pagePadding: "36",
  pageMinHeight: "1060",
  exportSectionHeight: "1060",
  rhythm: "12",
  gridSize: "8",
  showGuides: "true",
  bodyFont: "Lora",
  headingFont: "Playfair Display",
  headerFont: "Barlow",
  headerWeight: "700",
  sansFont: "Libre Franklin",
};

const defaultOrgNodes: OrgNode[] = [
  { name: "Kişi 1", rank: "ÜST DÜZEY", tone: "boss" },
  { name: "Kişi 2", rank: "YARDIMCI", tone: "underboss" },
  { name: "Kişi 3", rank: "KOORDİNATÖR", tone: "soldier" },
  { name: "Kişi 4", rank: "EKİP", tone: "node" },
  { name: "Kişi 5", rank: "EKİP", tone: "node" },
  { name: "Kişi 6", rank: "EKİP", tone: "node" },
];

const defaultCategories: Category[] = [
  { id: "category-1", name: "Kategori 1", navLabel: "Kategori 1" },
  { id: "category-2", name: "Kategori 2", navLabel: "Kategori 2" },
];

const initialBlocks: Block[] = [];

const fontStacks: Record<string, string> = {
  Lora: "var(--font-lora), Georgia, serif",
  "Playfair Display": "var(--font-playfair-display), Georgia, serif",
  "Libre Franklin": "var(--font-libre-franklin), Arial, sans-serif",
  Barlow: "var(--font-barlow), Arial, sans-serif",
  "Arno Pro": "var(--font-arno-pro), Georgia, serif",
  "Arno Pro Caption": "var(--font-arno-pro-caption), Georgia, serif",
  "Arno Pro Display": "var(--font-arno-pro-display), Georgia, serif",
  Georgia: "Georgia, 'Times New Roman', Times, serif",
  Arial: "Arial, Helvetica, sans-serif",
  System: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const fontOptions = Object.keys(fontStacks);

const layoutPresets: Record<
  string,
  Pick<ArticleSettings, "pageWidth" | "pagePadding" | "pageMinHeight" | "exportSectionHeight" | "rhythm">
> = {
  compact: {
    pageWidth: "700",
    pagePadding: "30",
    pageMinHeight: "980",
    exportSectionHeight: "980",
    rhythm: "10",
  },
  classic: {
    pageWidth: "750",
    pagePadding: "36",
    pageMinHeight: "1060",
    exportSectionHeight: "1060",
    rhythm: "12",
  },
  broadsheet: {
    pageWidth: "860",
    pagePadding: "44",
    pageMinHeight: "1220",
    exportSectionHeight: "1220",
    rhythm: "14",
  },
};

const managedFieldKeys = new Set([
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "textAlign",
  "dropCap",
  "float",
  "layout",
  "width",
  "height",
  "x",
  "y",
  "zIndex",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "objectFit",
  "positionX",
  "positionY",
  "radius",
  "brightness",
  "contrast",
  "saturation",
  "clear",
  "photoWidth",
  "imageHeight",
  "avatarSize",
]);

function makeId(type: BlockType) {
  return `${type}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function newCategory(): Category {
  const id = `category-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  return {
    id,
    name: "Yeni Kategori",
    navLabel: "Yeni Kategori",
  };
}

function newBlock(type: BlockType, categoryId: string): Block {
  const base = { id: makeId(type), categoryId, type, label: "Yeni blok", className: "" };

  switch (type) {
    case "section":
      return { ...base, label: "Yeni bölüm", fields: { text: "Yeni Bölüm · Etiket" } };
    case "hero":
      return {
        ...base,
        label: "Yeni hero",
        fields: {
          kicker: "Özel",
          title: "Yeni haber başlığı",
          imageUrl: "",
          alt: "",
          height: "220",
        },
      };
    case "caption":
      return {
        ...base,
        label: "Yeni altyazı",
        fields: { location: "Konum", credit: "Kaynak / Fotoğraf" },
      };
    case "deck":
      return { ...base, label: "Yeni spot", fields: { text: "Haberin kısa spot metni." } };
    case "byline":
      return {
        ...base,
        label: "Yeni yazar",
        fields: { author: "Yazar Adı", date: "Tarih · Saat · Büro" },
      };
    case "paragraph":
      return {
        ...base,
        label: "Yeni paragraf",
        fields: {
          text: "Yeni paragraf metni.",
          fontFamily: "Lora",
          fontSize: "13",
          fontWeight: "400",
          lineHeight: "1.65",
          textAlign: "justify",
          dropCap: "false",
        },
      };
    case "image":
      return {
        ...base,
        label: "Yeni fotoğraf",
        fields: {
          imageUrl: "",
          alt: "",
          caption: "Fotoğraf açıklaması.",
          credit: "Fotoğraf kaynağı",
          layout: "flow",
          float: "none",
          width: "260",
          height: "180",
          x: "36",
          y: "180",
          zIndex: "2",
          marginTop: "12",
          marginRight: "0",
          marginBottom: "14",
          marginLeft: "36",
          objectFit: "cover",
          positionX: "50",
          positionY: "50",
          radius: "0",
          brightness: "72",
          contrast: "100",
          saturation: "82",
          clear: "both",
        },
      };
    case "rule":
      return {
        ...base,
        label: "Yeni ayraç",
        className: "rule",
        fields: { variant: "rule" },
      };
    case "orgchart":
      return {
        ...base,
        label: "Yeni şema",
        fields: { title: "Organizasyon Şeması", caption: "Kaynak notu." },
        orgNodes: defaultOrgNodes.slice(0, 5),
      };
    case "photoquote":
      return {
        ...base,
        label: "Yeni fotoğraf + alıntı",
        fields: {
          imageUrl: "",
          alt: "",
          photoWidth: "42",
          imageHeight: "180",
          caption: "Fotoğraf açıklaması.",
          credit: "Fotoğraf kaynağı",
          label: "Öne çıkan alıntı",
          quote: "Alıntı metni.",
          speaker: "Konuşan kişi",
          title: "Unvan",
          reporter: "Röportaj notu",
        },
      };
    case "authorcard":
      return {
        ...base,
        label: "Yeni yazar kartı",
        className: "",
        fields: {
          imageUrl: "",
          alt: "",
          name: "Yazar Adı",
          role: "Muhabir / Editör",
          title: "Yazar notu",
          text: "Yazar hakkında kısa bilgi veya haber için özel not.",
          avatarSize: "92",
        },
      };
    case "custom":
      return {
        ...base,
        label: "Yeni özel div",
        className: "custom-alert",
        fields: {
          title: "Özel kutu",
          text: "Bu alan haber içinde serbest düzenlenebilir bir div olarak kullanılır.",
        },
      };
  }
}

async function imageSourceToDataUrl(src: string) {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  try {
    const response = await fetch(src, { mode: "cors" });

    if (!response.ok) {
      return "";
    }

    const blob = await response.blob();

    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => resolve("");
      reader.readAsDataURL(blob);
    });
  } catch {
    return "";
  }
}

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

type ImageRestoreEntry =
  | { kind: "src"; el: HTMLImageElement; originalSrc: string; hadCrossOrigin: boolean; crossOrigin: string | null }
  | { kind: "replaced"; original: HTMLImageElement; fallback: HTMLElement };

async function withExportPrep<T>(node: HTMLElement, work: () => Promise<T>): Promise<T> {
  const pageHost = (node.classList.contains("page") ? node : node.closest(".page")) as HTMLElement | null;
  const pageHadGuides = pageHost?.classList.contains("show-guides") ?? false;
  if (pageHadGuides) pageHost?.classList.remove("show-guides");

  document.body.classList.add("is-exporting");

  const selectionEls = Array.from(node.querySelectorAll(".selected-for-edit"));
  selectionEls.forEach((el) => el.classList.remove("selected-for-edit"));

  const dropZones = Array.from(node.querySelectorAll(".image-drop-zone"));
  dropZones.forEach((el) => el.classList.add("exporting"));

  const images = Array.from(node.querySelectorAll("img"));
  const restore: ImageRestoreEntry[] = [];

  await Promise.all(
    images.map(async (img) => {
      const originalSrc = img.src;
      const dataUrl = await imageSourceToDataUrl(img.currentSrc || img.src);
      if (dataUrl) {
        restore.push({
          kind: "src",
          el: img,
          originalSrc,
          hadCrossOrigin: img.hasAttribute("crossorigin"),
          crossOrigin: img.getAttribute("crossorigin"),
        });
        img.removeAttribute("crossorigin");
        img.src = dataUrl;
      } else {
        const fallback = document.createElement("div");
        fallback.className = "image-drop-zone image-placeholder export-image-fallback exporting";
        fallback.innerHTML = "<span>Görsel export edilemedi</span>";
        fallback.setAttribute("style", img.getAttribute("style") ?? "");
        img.replaceWith(fallback);
        restore.push({ kind: "replaced", original: img, fallback });
      }
    }),
  );

  await document.fonts.ready;

  try {
    return await work();
  } finally {
    for (const entry of restore) {
      if (entry.kind === "src") {
        entry.el.src = entry.originalSrc;
        if (entry.hadCrossOrigin && entry.crossOrigin !== null) {
          entry.el.setAttribute("crossorigin", entry.crossOrigin);
        }
      } else {
        entry.fallback.replaceWith(entry.original);
      }
    }
    dropZones.forEach((el) => el.classList.remove("exporting"));
    selectionEls.forEach((el) => el.classList.add("selected-for-edit"));
    if (pageHadGuides) pageHost?.classList.add("show-guides");
    document.body.classList.remove("is-exporting");
  }
}

function exportPixelRatio() {
  return Math.max(2, window.devicePixelRatio || 1);
}

async function downloadNodeAsPng(node: HTMLElement, filename: string) {
  await withExportPrep(node, async () => {
    const dataUrl = await toPng(node, {
      pixelRatio: exportPixelRatio(),
      cacheBust: true,
      backgroundColor: undefined,
    });
    triggerDownload(dataUrl, filename);
  });
}

async function downloadNodeSectionsAsPng(
  node: HTMLElement,
  filenameBase: string,
  sectionHeight: number,
) {
  await withExportPrep(node, async () => {
    const pixelRatio = exportPixelRatio();
    const fullCanvas = await toCanvas(node, { pixelRatio, cacheBust: true });
    const width = Math.max(1, Math.ceil(node.getBoundingClientRect().width));
    const totalHeight = Math.max(1, Math.ceil(node.scrollHeight));
    const safeSectionHeight = Math.max(200, sectionHeight);
    const sectionCount = Math.ceil(totalHeight / safeSectionHeight);

    for (let index = 0; index < sectionCount; index += 1) {
      const offset = index * safeSectionHeight;
      const height = Math.min(safeSectionHeight, totalHeight - offset);
      const slice = document.createElement("canvas");
      slice.width = Math.round(width * pixelRatio);
      slice.height = Math.round(height * pixelRatio);
      const ctx = slice.getContext("2d");
      if (!ctx) throw new Error("Canvas desteklenmiyor.");
      ctx.drawImage(
        fullCanvas,
        0,
        Math.round(offset * pixelRatio),
        Math.round(width * pixelRatio),
        Math.round(height * pixelRatio),
        0,
        0,
        Math.round(width * pixelRatio),
        Math.round(height * pixelRatio),
      );
      triggerDownload(
        slice.toDataURL("image/png"),
        `${filenameBase}-bolum-${String(index + 1).padStart(2, "0")}.png`,
      );
    }
  });
}

export default function Home() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const blockRefs = useRef(new Map<string, HTMLElement>());
  const [settings, setSettings] = useState(defaultSettings);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [activeCategoryId, setActiveCategoryId] = useState(defaultCategories[0].id);
  const [selectedId, setSelectedId] = useState("");
  const [exportStatus, setExportStatus] = useState("");
  const [draggedBlockId, setDraggedBlockId] = useState("");

  const activeCategory = categories.find((category) => category.id === activeCategoryId);
  const activeBlocks = useMemo(
    () => blocks.filter((block) => block.categoryId === activeCategoryId && !block.hidden),
    [activeCategoryId, blocks],
  );
  const selectedBlock = blocks.find(
    (block) => block.id === selectedId && block.categoryId === activeCategoryId,
  );

  const pageStyle = {
    "--font-body": fontStacks[settings.bodyFont] ?? fontStacks.Lora,
    "--font-heading": fontStacks[settings.headingFont] ?? fontStacks["Playfair Display"],
    "--font-sans": fontStacks[settings.sansFont] ?? fontStacks["Libre Franklin"],
    "--page-width": `${Number(settings.pageWidth) || 750}px`,
    "--page-padding": `${Number(settings.pagePadding) || 36}px`,
    "--page-min-height": `${Number(settings.pageMinHeight) || 1060}px`,
    "--layout-rhythm": `${Number(settings.rhythm) || 12}px`,
  } as CSSProperties;
  const snapGrid = Math.max(1, Number(settings.gridSize) || 8);

  function updateBlock(id: string, patch: Partial<Block>) {
    setBlocks((current) =>
      current.map((block) => (block.id === id ? { ...block, ...patch } : block)),
    );
  }

  function updateField(id: string, key: string, value: string) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === id
          ? { ...block, fields: { ...block.fields, [key]: value } }
          : block,
      ),
    );
  }

  function addBlock(type: BlockType) {
    const created = newBlock(type, activeCategoryId);
    setBlocks((current) => {
      const insertAt = current.findLastIndex((block) => block.categoryId === activeCategoryId);
      const next = current.slice();
      next.splice(insertAt + 1, 0, created);
      return next;
    });
    setSelectedId(created.id);
  }

  function applyLayoutPreset(name: string) {
    if (name === "custom") {
      setSettings((current) => ({ ...current, layoutPreset: "custom" }));
      return;
    }

    const preset = layoutPresets[name];

    if (!preset) return;

    setSettings((current) => ({
      ...current,
      layoutPreset: name,
      ...preset,
    }));
  }

  function duplicateBlock(block: Block) {
    const copy = {
      ...block,
      id: makeId(block.type),
      label: `${block.label} kopya`,
      fields: { ...block.fields },
      orgNodes: block.orgNodes ? block.orgNodes.map((node) => ({ ...node })) : undefined,
    };
    setBlocks((current) => {
      const index = current.findIndex((item) => item.id === block.id);
      const next = current.slice();
      next.splice(index + 1, 0, copy);
      return next;
    });
    setSelectedId(copy.id);
  }

  function moveBlock(id: string, direction: -1 | 1) {
    setBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      const target = index + direction;

      if (
        index < 0 ||
        target < 0 ||
        target >= current.length ||
        current[index].categoryId !== current[target].categoryId
      ) {
        return current;
      }

      const next = current.slice();
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function reorderBlock(sourceId: string, targetId: string) {
    if (!sourceId || sourceId === targetId) return;

    setBlocks((current) => {
      const sourceIndex = current.findIndex((block) => block.id === sourceId);
      const targetIndex = current.findIndex((block) => block.id === targetId);

      if (
        sourceIndex < 0 ||
        targetIndex < 0 ||
        current[sourceIndex].categoryId !== current[targetIndex].categoryId
      ) {
        return current;
      }

      const next = current.slice();
      const [source] = next.splice(sourceIndex, 1);
      const adjustedTarget = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
      next.splice(adjustedTarget, 0, source);
      return next;
    });
  }

  async function exportBlock(id: string, label: string) {
    const node = blockRefs.current.get(id);
    if (!node) return;

    setExportStatus("PNG hazırlanıyor...");
    try {
      await downloadNodeAsPng(node, `${label.replace(/\s+/g, "-").toLowerCase()}.png`);
      setExportStatus("PNG indirildi.");
    } catch (error) {
      setExportStatus(error instanceof Error ? error.message : "PNG alınamadı.");
    }
  }

  async function exportPageSections() {
    if (!pageRef.current) return;

    setExportStatus("Bölüm PNG'leri hazırlanıyor...");
    try {
      await downloadNodeSectionsAsPng(
        pageRef.current,
        `${(activeCategory?.navLabel ?? "article").replace(/\s+/g, "-").toLowerCase()}`,
        Number(settings.exportSectionHeight) || 1060,
      );
      setExportStatus("Bölüm PNG'leri indirildi.");
    } catch (error) {
      setExportStatus(error instanceof Error ? error.message : "Bölüm PNG'leri alınamadı.");
    }
  }

  function registerBlock(id: string) {
    return (node: HTMLElement | null) => {
      if (node) {
        blockRefs.current.set(id, node);
      } else {
        blockRefs.current.delete(id);
      }
    };
  }

  function readImageFile(blockId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    applyImageFile(blockId, file);
  }

  function applyImageFile(blockId: string, file: File) {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => updateField(blockId, "imageUrl", String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  function updateCategory(id: string, patch: Partial<Category>) {
    setCategories((current) =>
      current.map((category) => (category.id === id ? { ...category, ...patch } : category)),
    );
  }

  function addCategory() {
    const category = newCategory();
    setCategories((current) => [...current, category]);
    setActiveCategoryId(category.id);
    setSelectedId("");
  }

  function selectCategory(id: string) {
    setActiveCategoryId(id);
    setSelectedId(blocks.find((block) => block.categoryId === id)?.id ?? "");
  }

  function removeActiveCategory() {
    if (categories.length <= 1) return;

    const nextCategory = categories.find((category) => category.id !== activeCategoryId);
    setCategories((current) => current.filter((category) => category.id !== activeCategoryId));
    setBlocks((current) => current.filter((block) => block.categoryId !== activeCategoryId));
    setActiveCategoryId(nextCategory?.id ?? "");
    setSelectedId("");
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping) return;

      const meta = event.metaKey || event.ctrlKey;

      if (meta && event.key.toLowerCase() === "d" && selectedBlock) {
        event.preventDefault();
        duplicateBlock(selectedBlock);
      }

      if (meta && event.key.toLowerCase() === "e" && selectedBlock) {
        event.preventDefault();
        void exportBlock(selectedBlock.id, selectedBlock.label);
      }

      if (meta && event.shiftKey && event.key.toLowerCase() === "e") {
        event.preventDefault();
        void exportPageSections();
      }

      if (event.altKey && event.key === "ArrowUp" && selectedBlock) {
        event.preventDefault();
        moveBlock(selectedBlock.id, -1);
      }

      if (event.altKey && event.key === "ArrowDown" && selectedBlock) {
        event.preventDefault();
        moveBlock(selectedBlock.id, 1);
      }

      if ((event.key === "Delete" || event.key === "Backspace") && selectedBlock) {
        event.preventDefault();
        setBlocks((current) => current.filter((block) => block.id !== selectedBlock.id));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // Keyboard handlers intentionally read the latest render snapshot for editor actions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBlock]);

  return (
    <main className="editor-shell">
      <aside className="editor-panel">
        <div className="panel-heading">
          <p>Article Generator</p>
        </div>

        <section className="control-section category-section">
          <div className="section-row">
            <h2>Nav / Kategoriler</h2>
            <button onClick={addCategory} type="button">Ekle</button>
          </div>
          <div className="category-tabs" aria-label="Kategori seçimi">
            {categories.map((category) => (
              <button
                className={activeCategoryId === category.id ? "active" : ""}
                key={category.id}
                onClick={() => selectCategory(category.id)}
                type="button"
              >
                {category.name}
              </button>
            ))}
          </div>
          {activeCategory ? (
            <div className="category-editor">
              <TextInput
                label="Kategori adı"
                value={activeCategory.name}
                onChange={(name) =>
                  updateCategory(activeCategory.id, { name, navLabel: name })
                }
              />
              <button
                className="danger-lite"
                disabled={categories.length <= 1}
                onClick={removeActiveCategory}
                type="button"
              >
                Kategoriyi sil
              </button>
            </div>
          ) : null}
        </section>

        <section className="control-section">
          <h2>Sayfa ayarları</h2>
          <TextInput
            label="Tarih"
            value={settings.dateLine}
            onChange={(value) => setSettings({ ...settings, dateLine: value })}
          />
          <TextInput
            label="Gazete adı"
            value={settings.masthead}
            onChange={(value) => setSettings({ ...settings, masthead: value })}
          />
          <TextInput
            label="Slogan"
            value={settings.tagline}
            onChange={(value) => setSettings({ ...settings, tagline: value })}
          />
          <SelectInput
            label="Layout preset"
            options={[...Object.keys(layoutPresets), "custom"]}
            value={settings.layoutPreset}
            onChange={applyLayoutPreset}
          />
          <SelectInput
            label="Gövde fontu"
            options={fontOptions}
            value={settings.bodyFont}
            onChange={(value) => setSettings({ ...settings, bodyFont: value })}
          />
          <SelectInput
            label="Başlık fontu"
            options={fontOptions}
            value={settings.headingFont}
            onChange={(value) => setSettings({ ...settings, headingFont: value })}
          />
          <SelectInput
            label="Header fontu"
            options={fontOptions}
            value={settings.headerFont}
            onChange={(value) => setSettings({ ...settings, headerFont: value })}
          />
          <SelectInput
            label="Header ağırlığı"
            options={["300", "400", "500", "600", "700", "800", "900"]}
            value={settings.headerWeight}
            onChange={(value) => setSettings({ ...settings, headerWeight: value })}
          />
          <SelectInput
            label="Arayüz/nav fontu"
            options={fontOptions}
            value={settings.sansFont}
            onChange={(value) => setSettings({ ...settings, sansFont: value })}
          />
          <TextInput
            label="Sayfa genişliği"
            value={settings.pageWidth}
            onChange={(value) =>
              setSettings({
                ...settings,
                layoutPreset: "custom",
                pageWidth: value.replace(/[^\d]/g, ""),
              })
            }
          />
          <TextInput
            label="Sayfa iç boşluk"
            value={settings.pagePadding}
            onChange={(value) =>
              setSettings({
                ...settings,
                layoutPreset: "custom",
                pagePadding: value.replace(/[^\d]/g, ""),
              })
            }
          />
          <TextInput
            label="Sayfa minimum yüksekliği"
            value={settings.pageMinHeight}
            onChange={(value) =>
              setSettings({
                ...settings,
                layoutPreset: "custom",
                pageMinHeight: value.replace(/[^\d]/g, ""),
              })
            }
          />
          <TextInput
            label="Dikey ritim"
            value={settings.rhythm}
            onChange={(value) =>
              setSettings({
                ...settings,
                layoutPreset: "custom",
                rhythm: value.replace(/[^\d]/g, ""),
              })
            }
          />
          <TextInput
            label="Snap grid"
            value={settings.gridSize}
            onChange={(value) =>
              setSettings({
                ...settings,
                gridSize: value.replace(/[^\d]/g, ""),
              })
            }
          />
          <SelectInput
            label="Kılavuzlar"
            options={["true", "false"]}
            value={settings.showGuides}
            onChange={(value) => setSettings({ ...settings, showGuides: value })}
          />
          <TextInput
            label="PNG bölüm yüksekliği"
            value={settings.exportSectionHeight}
            onChange={(value) =>
              setSettings({
                ...settings,
                layoutPreset: "custom",
                exportSectionHeight: value.replace(/[^\d]/g, ""),
              })
            }
          />
        </section>

        <section className="control-section">
          <div className="section-row">
            <h2>Blok ekle</h2>
            <span>{activeCategory?.name ?? "Kategori yok"}</span>
          </div>
          <div className="block-catalog">
            {blockCatalog.map((item) => (
              <button key={item.type} onClick={() => addBlock(item.type)} type="button">
                <span>{item.label}</span>
                <small>{item.region}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="control-section">
          <h2>Bloklar</h2>
          <div className="block-list">
            {blocks
              .filter((block) => block.categoryId === activeCategoryId)
              .map((block) => (
                <button
                  className={selectedId === block.id ? "selected" : ""}
                  draggable
                  key={block.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDragStart={() => setDraggedBlockId(block.id)}
                  onDrop={() => {
                    reorderBlock(draggedBlockId, block.id);
                    setDraggedBlockId("");
                  }}
                  onClick={() => setSelectedId(block.id)}
                  type="button"
                >
                  <span>{block.label}</span>
                  <small>{block.type}</small>
                </button>
              ))}
          </div>
          {activeBlocks.length === 0 ? (
            <p className="empty-note">Bu kategoride henüz blok yok. Yukarıdan bir blok ekle.</p>
          ) : null}
        </section>

        {selectedBlock ? (
          <BlockEditor
            block={selectedBlock}
            onDuplicate={() => duplicateBlock(selectedBlock)}
            onExport={() => exportBlock(selectedBlock.id, selectedBlock.label)}
            onMoveDown={() => moveBlock(selectedBlock.id, 1)}
            onMoveUp={() => moveBlock(selectedBlock.id, -1)}
            onRemove={() => {
              setBlocks((current) => current.filter((block) => block.id !== selectedBlock.id));
              setSelectedId(
                blocks.find(
                  (block) =>
                    block.id !== selectedBlock.id && block.categoryId === activeCategoryId,
                )?.id ?? "",
              );
            }}
            onToggleHidden={() =>
              updateBlock(selectedBlock.id, { hidden: !selectedBlock.hidden })
            }
            onUpdate={(patch) => updateBlock(selectedBlock.id, patch)}
            onUpdateField={(key, value) => updateField(selectedBlock.id, key, value)}
            onUploadImage={(event) => readImageFile(selectedBlock.id, event)}
          />
        ) : null}

        <section className="control-section export-section">
          <button className="primary-action" onClick={exportPageSections} type="button">
            Bölüm bölüm PNG al
          </button>
          <div className="shortcut-grid">
            <span>⌘/Ctrl+D</span><span>Blok kopyala</span>
            <span>⌘/Ctrl+E</span><span>Blok PNG</span>
            <span>⌘/Ctrl+Shift+E</span><span>Bölüm PNG</span>
            <span>Alt+↑/↓</span><span>Blok taşı</span>
            <span>Delete</span><span>Blok sil</span>
          </div>
          <p>{exportStatus || "Seçili blok üstünden hızlı aksiyonları veya kısayolları kullan."}</p>
        </section>
      </aside>

      <section className="preview-stage">
        <div
          className={classNames("page", settings.showGuides === "true" && "show-guides")}
          ref={pageRef}
          style={pageStyle}
        >
          <DateLine settings={settings} />
          <Masthead settings={settings} />
          <NavBar
            activeCategoryId={activeCategoryId}
            categories={categories}
            onSelectCategory={selectCategory}
          />

          {activeBlocks.length > 0 ? (
            <div className="page-flow">
              {activeBlocks.map((block) => (
                <RenderedBlock
                  block={block}
                  isSelected={block.id === selectedId}
                  key={block.id}
                  onImageFile={applyImageFile}
                  onSelect={() => setSelectedId(block.id)}
                  onUpdateField={updateField}
                  registerBlock={registerBlock}
                  snapGrid={snapGrid}
                />
              ))}
            </div>
          ) : (
            <div className="empty-page-hint">
              <strong>Boş haber sayfası</strong>
              <span>Soldaki bloklardan hero, spot, paragraf veya özel div ekleyerek başla.</span>
            </div>
          )}

          <PageFooter masthead={settings.masthead} />
        </div>
      </section>
    </main>
  );
}

function DateLine({ settings }: { settings: ArticleSettings }) {
  return (
    <div className="dateline-bar" lang="en">
      <span>{settings.dateLine}</span>
      <span className="edition">{settings.edition}</span>
      <span>{settings.volume}</span>
      <span className="price">{settings.price}</span>
    </div>
  );
}

function Masthead({ settings }: { settings: ArticleSettings }) {
  const mastheadStyle = {
    fontFamily: fontStacks[settings.headerFont] ?? fontStacks.Barlow,
    fontWeight: Number(settings.headerWeight) || 700,
  } satisfies CSSProperties;

  return (
    <div className="masthead">
      <div className="masthead-rule" />
      <div className="masthead-name" style={mastheadStyle}>{settings.masthead}</div>
      <div className="masthead-tagline" lang="en">
        {settings.tagline}
      </div>
    </div>
  );
}

function NavBar({
  activeCategoryId,
  categories,
  onSelectCategory,
}: {
  activeCategoryId: string;
  categories: Category[];
  onSelectCategory: (id: string) => void;
}) {
  const items = categories.map((category) => ({
    id: category.id,
    label: category.navLabel || category.name,
  }));

  return (
    <nav className="nav-bar" lang="en">
      {items.map((item) => {
        return (
          <a
            className={item.id === activeCategoryId ? "active" : ""}
            href="#"
            key={item.id}
            onClick={(event) => {
              event.preventDefault();
              onSelectCategory(item.id);
            }}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

function PageFooter({ masthead }: { masthead: string }) {
  return (
    <footer className="page-footer" aria-label="Sayfa alt bilgisi">
      <span className="continued">Devamı sonraki sayfada</span>
      <span>{masthead}</span>
      <span className="page-num">A1</span>
    </footer>
  );
}

function RenderedBlock({
  block,
  isSelected,
  onImageFile,
  onSelect,
  onUpdateField,
  registerBlock,
  snapGrid,
}: {
  block: Block;
  isSelected: boolean;
  onImageFile: (blockId: string, file: File) => void;
  onSelect: () => void;
  onUpdateField: (id: string, key: string, value: string) => void;
  registerBlock: (id: string) => (node: HTMLElement | null) => void;
  snapGrid: number;
}) {
  const frameClass = classNames("editable-block", isSelected && "selected-for-edit");
  const rootProps = {
    onClick: (event: React.MouseEvent) => {
      event.stopPropagation();
      onSelect();
    },
    ref: registerBlock(block.id),
  };

  switch (block.type) {
    case "section":
      return (
        <div
          {...rootProps}
          className={classNames(frameClass, "section-tag", block.className)}
          lang="en"
        >
          {block.fields.text}
        </div>
      );
    case "hero":
      return (
        <div
          {...rootProps}
          className={classNames(frameClass, "hero-block", block.className)}
          style={{ height: `${Number(block.fields.height) || 220}px` }}
        >
          <ArticleImage
            alt={block.fields.alt}
            onFile={(file) => onImageFile(block.id, file)}
            src={block.fields.imageUrl}
            variant="hero"
          />
          <div className="hero-overlay">
            <div className="kicker">{block.fields.kicker}</div>
            <h1 className="headline">
              {block.fields.title.split("\n").map((line, index) => (
                <span key={`${line}-${index}`}>
                  {line}
                  {index < block.fields.title.split("\n").length - 1 ? <br /> : null}
                </span>
              ))}
            </h1>
          </div>
        </div>
      );
    case "caption":
      return (
        <div {...rootProps} className={classNames(frameClass, "hero-caption", block.className)}>
          <span className="location">{block.fields.location}</span>
          <span className="credit" lang="en">
            {block.fields.credit}
          </span>
        </div>
      );
    case "deck":
      return (
        <p {...rootProps} className={classNames(frameClass, "deck", block.className)}>
          {block.fields.text}
        </p>
      );
    case "byline":
      return (
        <div {...rootProps} className={classNames(frameClass, "byline", block.className)}>
          By <span className="author">{block.fields.author}</span> <span className="sep">|</span>
          <span className="date">{block.fields.date}</span>
        </div>
      );
    case "paragraph": {
      const paragraphStyle = {
        fontFamily: fontStacks[block.fields.fontFamily] ?? fontStacks.Lora,
        fontSize: `${Number(block.fields.fontSize) || 13}px`,
        fontWeight: Number(block.fields.fontWeight) || 400,
        lineHeight: Number(block.fields.lineHeight) || 1.65,
        textAlign: block.fields.textAlign as CSSProperties["textAlign"],
      } satisfies CSSProperties;

      return (
        <div
          {...rootProps}
          className={classNames(frameClass, "article-text-block", block.className)}
        >
          <p
            className={classNames(
              block.className.includes("lead") && "lead",
              block.fields.dropCap === "true" && "drop-cap",
            )}
            style={paragraphStyle}
          >
            {block.fields.text}
          </p>
        </div>
      );
    }
    case "image": {
      const imageFilter = `brightness(${Number(block.fields.brightness) || 100}%) contrast(${Number(block.fields.contrast) || 100}%) saturate(${Number(block.fields.saturation) || 100}%)`;
      const imagePresentationStyle = {
        borderRadius: `${Number(block.fields.radius) || 0}px`,
        filter: imageFilter,
        objectPosition: `${Number(block.fields.positionX) || 50}% ${Number(block.fields.positionY) || 50}%`,
      } satisfies CSSProperties;
      const figureStyle = {
        width: `${Number(block.fields.width) || 260}px`,
        margin: `${Number(block.fields.marginTop) || 0}px ${Number(block.fields.marginRight) || 0}px ${Number(block.fields.marginBottom) || 0}px ${Number(block.fields.marginLeft) || 0}px`,
      };
      const imageBoxStyle = {
        height: `${Number(block.fields.height) || 180}px`,
      };
      const figure = (
        <figure
          {...rootProps}
          className={classNames(
            frameClass,
            "inline-photo",
            block.fields.layout === "free" && "free-photo",
            `float-${block.fields.float || "none"}`,
            `clear-${block.fields.clear || "both"}`,
            block.className,
          )}
          style={figureStyle}
        >
          <ArticleImage
            alt={block.fields.alt}
            imageStyle={imagePresentationStyle}
            objectFit={block.fields.objectFit}
            onFile={(file) => onImageFile(block.id, file)}
            src={block.fields.imageUrl}
            style={imageBoxStyle}
            variant="photo"
          />
          <figcaption>
            {block.fields.caption}
            <span>{block.fields.credit}</span>
          </figcaption>
        </figure>
      );

      if (block.fields.layout !== "free") {
        return figure;
      }

      return (
        <Rnd
          bounds=".page-flow"
          className={classNames("free-photo-frame", isSelected && "selected-for-edit")}
          dragHandleClassName="image-drop-zone"
          dragGrid={[snapGrid, snapGrid]}
          enableResizing={{
            bottom: true,
            bottomLeft: true,
            bottomRight: true,
            left: true,
            right: true,
            top: true,
            topLeft: true,
            topRight: true,
          }}
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            onSelect();
          }}
          onDragStop={(_event, data) => {
            onUpdateField(block.id, "x", String(Math.round(data.x)));
            onUpdateField(block.id, "y", String(Math.round(data.y)));
          }}
          onResizeStop={(_event, _direction, ref, _delta, position) => {
            onUpdateField(block.id, "width", String(Math.round(ref.offsetWidth)));
            onUpdateField(block.id, "height", String(Math.round(ref.offsetHeight)));
            onUpdateField(block.id, "x", String(Math.round(position.x)));
            onUpdateField(block.id, "y", String(Math.round(position.y)));
          }}
          position={{
            x: Number(block.fields.x) || 0,
            y: Number(block.fields.y) || 0,
          }}
          resizeHandleClasses={{
            bottom: "photo-resize-handle",
            bottomLeft: "photo-resize-handle",
            bottomRight: "photo-resize-handle",
            left: "photo-resize-handle",
            right: "photo-resize-handle",
            top: "photo-resize-handle",
            topLeft: "photo-resize-handle",
            topRight: "photo-resize-handle",
          }}
          resizeGrid={[snapGrid, snapGrid]}
          size={{
            height: Number(block.fields.height) || 180,
            width: Number(block.fields.width) || 260,
          }}
          style={{ zIndex: Number(block.fields.zIndex) || 2 }}
        >
          <ArticleImage
            alt={block.fields.alt}
            imageStyle={imagePresentationStyle}
            objectFit={block.fields.objectFit}
            onFile={(file) => onImageFile(block.id, file)}
            src={block.fields.imageUrl}
            variant="photo"
          />
        </Rnd>
      );
    }
    case "rule":
      return (
        <div {...rootProps} className={classNames(frameClass, "rule-block", block.className)}>
          <hr className={block.fields.variant === "rule-accent" ? "rule-accent" : "rule"} />
        </div>
      );
    case "orgchart":
      return (
        <div {...rootProps} className={classNames(frameClass, "org-chart-section", block.className)}>
          <div className="org-chart-header">
            <div className="org-chart-title" lang="en">
              {block.fields.title}
            </div>
          </div>
          <OrgChart nodes={block.orgNodes ?? defaultOrgNodes} />
          <div className="org-caption">{block.fields.caption}</div>
        </div>
      );
    case "photoquote":
      return (
        <div {...rootProps} className={classNames(frameClass, "news-photo-quote", block.className)}>
          <div
            className="news-photo-side"
            style={{ width: `${Number(block.fields.photoWidth) || 42}%` }}
          >
            <ArticleImage
              alt={block.fields.alt}
              onFile={(file) => onImageFile(block.id, file)}
              src={block.fields.imageUrl}
              style={{ height: `${Number(block.fields.imageHeight) || 180}px` }}
              variant="photo"
            />
            <div className="news-photo-caption">
              {block.fields.caption}
              <span className="credit">{block.fields.credit}</span>
            </div>
          </div>
          <div className="news-quote-side">
            <div className="news-quote-label">{block.fields.label}</div>
            <div className="news-pullquote">
              <p>{block.fields.quote}</p>
            </div>
            <div className="news-quote-attribution">
              <div className="news-quote-speaker">{block.fields.speaker}</div>
              <div className="news-quote-title">{block.fields.title}</div>
              <div className="news-quote-reporter">{block.fields.reporter}</div>
            </div>
          </div>
        </div>
      );
    case "authorcard":
      return (
        <div {...rootProps} className={classNames(frameClass, "author-card", block.className)}>
          <div
            className="author-card-photo"
            style={{
              height: `${Number(block.fields.avatarSize) || 92}px`,
              width: `${Number(block.fields.avatarSize) || 92}px`,
            }}
          >
            <ArticleImage
              alt={block.fields.alt}
              objectFit="cover"
              onFile={(file) => onImageFile(block.id, file)}
              src={block.fields.imageUrl}
              variant="photo"
            />
          </div>
          <div className="author-card-content">
            <div className="author-card-label">{block.fields.title}</div>
            <div className="author-card-name">{block.fields.name}</div>
            <div className="author-card-role">{block.fields.role}</div>
            <p>{block.fields.text}</p>
          </div>
        </div>
      );
    case "custom":
      return (
        <div {...rootProps} className={classNames(frameClass, "custom-news-box", block.className)}>
          <div className="custom-news-title">{block.fields.title}</div>
          <div className="custom-news-text">{block.fields.text}</div>
        </div>
      );
  }
}

function ArticleImage({
  alt,
  imageStyle,
  objectFit = "cover",
  onFile,
  src,
  style,
  variant,
}: {
  alt: string;
  imageStyle?: CSSProperties;
  objectFit?: string;
  onFile: (file: File) => void;
  src: string;
  style?: CSSProperties;
  variant: "hero" | "photo";
}) {
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file) {
      onFile(file);
    }
  }

  if (src) {
    return (
      <div
        className="image-drop-zone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        style={style}
      >
        <img
          alt={alt}
          crossOrigin="anonymous"
          src={src}
          style={{ ...imageStyle, objectFit: objectFit as CSSProperties["objectFit"] }}
        />
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "image-drop-zone",
        "image-placeholder",
        variant === "hero" && "hero-placeholder",
      )}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      style={style}
    >
      <span>{variant === "hero" ? "Hero görsel alanı" : "Fotoğraf alanı"}</span>
    </div>
  );
}

function OrgChart({ nodes }: { nodes: OrgNode[] }) {
  const levels = [
    nodes.slice(0, 1),
    nodes.slice(1, 2),
    nodes.slice(2, 3),
    nodes.slice(3, 6),
    nodes.slice(6, 11),
  ].filter((level) => level.length > 0);

  const width = 678;
  const levelConfig = [
    { y: 26, nodeWidth: 132, nodeHeight: 38, gap: 16 },
    { y: 76, nodeWidth: 122, nodeHeight: 34, gap: 16 },
    { y: 122, nodeWidth: 112, nodeHeight: 34, gap: 16 },
    { y: 172, nodeWidth: 106, nodeHeight: 34, gap: 14 },
    { y: 232, nodeWidth: 106, nodeHeight: 34, gap: 10 },
  ];

  const laidOut = levels.map((level, levelIndex) => {
    const config = levelConfig[levelIndex];
    const totalWidth =
      level.length * config.nodeWidth + Math.max(0, level.length - 1) * config.gap;
    const startX = width / 2 - totalWidth / 2;

    return level.map((node, nodeIndex) => ({
      ...node,
      ...config,
      x: startX + nodeIndex * (config.nodeWidth + config.gap) + config.nodeWidth / 2,
    }));
  });

  const lines = laidOut.flatMap((level, index) => {
    if (index === 0) return [];

    const parent = laidOut[index - 1][Math.floor((laidOut[index - 1].length - 1) / 2)];
    const top = level[0].y - level[0].nodeHeight / 2;
    const mid = parent.y + parent.nodeHeight / 2 + (top - (parent.y + parent.nodeHeight / 2)) / 2;
    const left = level[0].x;
    const right = level[level.length - 1].x;

    return [
      { x1: parent.x, y1: parent.y + parent.nodeHeight / 2, x2: parent.x, y2: mid },
      { x1: left, y1: mid, x2: right, y2: mid },
      ...level.map((node) => ({ x1: node.x, y1: mid, x2: node.x, y2: top })),
    ];
  });

  return (
    <svg aria-label="Organizasyon şeması" className="orgchart" viewBox={`0 0 ${width} 270`}>
      {lines.map((line, index) => (
        <line
          key={`line-${index}`}
          stroke="#363840"
          strokeWidth="1"
          x1={line.x1}
          x2={line.x2}
          y1={line.y1}
          y2={line.y2}
        />
      ))}
      {laidOut.flat().map((node) => (
        <g key={`${node.rank}-${node.name}`} transform={`translate(${node.x} ${node.y})`}>
          <rect
            fill={node.tone === "boss" ? "#1c1520" : node.tone === "node" ? "#161820" : "#181a21"}
            height={node.nodeHeight}
            rx="3"
            stroke={
              node.tone === "boss"
                ? "#c94040"
                : node.tone === "underboss"
                  ? "#7a776f"
                  : node.tone === "soldier"
                    ? "#55524b"
                    : "#2a2c33"
            }
            strokeWidth={node.tone === "boss" ? "1.5" : "1"}
            width={node.nodeWidth}
            x={-node.nodeWidth / 2}
            y={-node.nodeHeight / 2}
          />
          <text
            fill={node.tone === "boss" ? "#c94040" : "#7a776f"}
            fontFamily="var(--font-sans)"
            fontSize={node.tone === "boss" ? "6.5" : "6"}
            fontWeight="800"
            letterSpacing="1.2"
            textAnchor="middle"
            y="-3"
          >
            {node.rank}
          </text>
          <text
            fill={node.tone === "boss" ? "#e2dfd8" : node.tone === "underboss" ? "#c0bdb5" : "#a0a0a0"}
            fontFamily="var(--font-sans)"
            fontSize={node.tone === "boss" ? "10" : "9"}
            fontWeight={node.tone === "boss" ? "700" : "600"}
            textAnchor="middle"
            y="10"
          >
            {node.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

function BlockEditor({
  block,
  onDuplicate,
  onExport,
  onMoveDown,
  onMoveUp,
  onRemove,
  onToggleHidden,
  onUpdate,
  onUpdateField,
  onUploadImage,
}: {
  block: Block;
  onDuplicate: () => void;
  onExport: () => void;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
  onToggleHidden: () => void;
  onUpdate: (patch: Partial<Block>) => void;
  onUpdateField: (key: string, value: string) => void;
  onUploadImage: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const fieldKeys = Object.keys(block.fields).filter((field) => !managedFieldKeys.has(field));

  function applyImagePreset(
    preset: "sidebar" | "wide" | "full" | "portrait" | "free",
  ) {
    const presets: Record<string, Record<string, string>> = {
      sidebar: {
        layout: "flow",
        float: "right",
        width: "260",
        height: "180",
        marginTop: "6",
        marginRight: "0",
        marginBottom: "14",
        marginLeft: "16",
        clear: "none",
        radius: "0",
      },
      wide: {
        layout: "flow",
        float: "none",
        width: "678",
        height: "260",
        marginTop: "14",
        marginRight: "36",
        marginBottom: "14",
        marginLeft: "36",
        clear: "both",
        radius: "0",
      },
      full: {
        layout: "flow",
        float: "none",
        width: "750",
        height: "320",
        marginTop: "14",
        marginRight: "0",
        marginBottom: "14",
        marginLeft: "0",
        clear: "both",
        radius: "0",
      },
      portrait: {
        layout: "flow",
        float: "left",
        width: "210",
        height: "285",
        marginTop: "6",
        marginRight: "16",
        marginBottom: "14",
        marginLeft: "0",
        clear: "none",
        radius: "0",
      },
      free: {
        layout: "free",
        width: "280",
        height: "190",
        x: "36",
        y: "220",
        zIndex: "3",
        clear: "none",
      },
    };

    onUpdate({
      fields: {
        ...block.fields,
        ...presets[preset],
      },
    });
  }

  return (
    <section className="control-section selected-editor">
      <div className="section-row">
        <h2>Seçili div</h2>
        <span>{block.type}</span>
      </div>
      <div className="editor-actions quick">
        <button onClick={onExport} type="button">PNG al</button>
        <button onClick={onDuplicate} type="button">Kopyala</button>
        <button onClick={onMoveUp} type="button">Yukarı</button>
        <button onClick={onMoveDown} type="button">Aşağı</button>
        <button onClick={onToggleHidden} type="button">
          {block.hidden ? "Göster" : "Gizle"}
        </button>
        <button className="danger" onClick={onRemove} type="button">Sil</button>
      </div>
      <TextInput label="Blok adı" value={block.label} onChange={(label) => onUpdate({ label })} />
      <TextInput
        label="Ek CSS class"
        value={block.className}
        onChange={(className) => onUpdate({ className })}
      />

      {fieldKeys.map((field) =>
        field.toLowerCase().includes("text") ||
        field === "quote" ||
        field === "caption" ||
        field === "title" ? (
          <TextArea
            key={field}
            label={field}
            value={block.fields[field]}
            onChange={(value) => onUpdateField(field, value)}
          />
        ) : (
          <TextInput
            key={field}
            label={field}
            value={block.fields[field]}
            onChange={(value) => onUpdateField(field, value)}
          />
        ),
      )}

      {"imageUrl" in block.fields ? (
        <label className="file-control">
          <span>Görsel yükle</span>
          <input accept="image/*" onChange={onUploadImage} type="file" />
        </label>
      ) : null}

      {block.type === "paragraph" ? (
        <div className="style-grid">
          <SelectInput
            label="Font"
            options={fontOptions}
            value={block.fields.fontFamily}
            onChange={(value) => onUpdateField("fontFamily", value)}
          />
          <SelectInput
            label="Ağırlık"
            options={["300", "400", "500", "600", "700", "800", "900"]}
            value={block.fields.fontWeight}
            onChange={(value) => onUpdateField("fontWeight", value)}
          />
          <TextInput
            label="Font px"
            value={block.fields.fontSize}
            onChange={(value) => onUpdateField("fontSize", value.replace(/[^\d.]/g, ""))}
          />
          <TextInput
            label="Satır"
            value={block.fields.lineHeight}
            onChange={(value) => onUpdateField("lineHeight", value.replace(/[^\d.]/g, ""))}
          />
          <SelectInput
            label="Hizalama"
            options={["left", "center", "right", "justify"]}
            value={block.fields.textAlign}
            onChange={(value) => onUpdateField("textAlign", value)}
          />
          <SelectInput
            label="Drop cap"
            options={["false", "true"]}
            value={block.fields.dropCap}
            onChange={(value) => onUpdateField("dropCap", value)}
          />
        </div>
      ) : null}

      {block.type === "image" ? (
        <>
          <div className="preset-grid">
            <button onClick={() => applyImagePreset("sidebar")} type="button">Yan foto</button>
            <button onClick={() => applyImagePreset("wide")} type="button">Geniş</button>
            <button onClick={() => applyImagePreset("full")} type="button">Tam taşma</button>
            <button onClick={() => applyImagePreset("portrait")} type="button">Portre</button>
            <button onClick={() => applyImagePreset("free")} type="button">Serbest</button>
          </div>
          <div className="style-grid">
            <SelectInput
              label="Mod"
              options={["flow", "free"]}
              value={block.fields.layout}
              onChange={(value) => onUpdateField("layout", value)}
            />
            <SelectInput
              label="Yerleşim"
              options={["left", "right", "none", "center"]}
              value={block.fields.float}
              onChange={(value) => onUpdateField("float", value)}
            />
            <SelectInput
              label="Fit"
              options={["cover", "contain", "fill"]}
              value={block.fields.objectFit}
              onChange={(value) => onUpdateField("objectFit", value)}
            />
            <SelectInput
              label="Altına in"
              options={["both", "none", "left", "right"]}
              value={block.fields.clear || "both"}
              onChange={(value) => onUpdateField("clear", value)}
            />
            <TextInput
              label="Genişlik"
              value={block.fields.width}
              onChange={(value) => onUpdateField("width", value.replace(/[^\d]/g, ""))}
            />
            <TextInput
              label="Yükseklik"
              value={block.fields.height}
              onChange={(value) => onUpdateField("height", value.replace(/[^\d]/g, ""))}
            />
            <TextInput
              label="X"
              value={block.fields.x}
              onChange={(value) => onUpdateField("x", value.replace(/[^\d-]/g, ""))}
            />
            <TextInput
              label="Y"
              value={block.fields.y}
              onChange={(value) => onUpdateField("y", value.replace(/[^\d-]/g, ""))}
            />
            <TextInput
              label="Katman"
              value={block.fields.zIndex}
              onChange={(value) => onUpdateField("zIndex", value.replace(/[^\d-]/g, ""))}
            />
            <TextInput
              label="Odak X %"
              value={block.fields.positionX}
              onChange={(value) => onUpdateField("positionX", value.replace(/[^\d-]/g, ""))}
            />
            <TextInput
              label="Odak Y %"
              value={block.fields.positionY}
              onChange={(value) => onUpdateField("positionY", value.replace(/[^\d-]/g, ""))}
            />
            <TextInput
              label="Köşe"
              value={block.fields.radius}
              onChange={(value) => onUpdateField("radius", value.replace(/[^\d]/g, ""))}
            />
            <TextInput
              label="Parlaklık %"
              value={block.fields.brightness}
              onChange={(value) => onUpdateField("brightness", value.replace(/[^\d]/g, ""))}
            />
            <TextInput
              label="Kontrast %"
              value={block.fields.contrast}
              onChange={(value) => onUpdateField("contrast", value.replace(/[^\d]/g, ""))}
            />
            <TextInput
              label="Saturasyon %"
              value={block.fields.saturation}
              onChange={(value) => onUpdateField("saturation", value.replace(/[^\d]/g, ""))}
            />
            <TextInput
              label="Margin üst"
              value={block.fields.marginTop}
              onChange={(value) => onUpdateField("marginTop", value.replace(/[^\d-]/g, ""))}
            />
            <TextInput
              label="Margin sağ"
              value={block.fields.marginRight}
              onChange={(value) => onUpdateField("marginRight", value.replace(/[^\d-]/g, ""))}
            />
            <TextInput
              label="Margin alt"
              value={block.fields.marginBottom}
              onChange={(value) => onUpdateField("marginBottom", value.replace(/[^\d-]/g, ""))}
            />
            <TextInput
              label="Margin sol"
              value={block.fields.marginLeft}
              onChange={(value) => onUpdateField("marginLeft", value.replace(/[^\d-]/g, ""))}
            />
          </div>
        </>
      ) : null}

      {block.type === "hero" ? (
        <TextInput
          label="Hero yüksekliği"
          value={block.fields.height}
          onChange={(value) => onUpdateField("height", value.replace(/[^\d]/g, ""))}
        />
      ) : null}

      {block.type === "photoquote" ? (
        <div className="style-grid">
          <TextInput
            label="Foto genişliği %"
            value={block.fields.photoWidth}
            onChange={(value) => onUpdateField("photoWidth", value.replace(/[^\d]/g, ""))}
          />
          <TextInput
            label="Foto yüksekliği"
            value={block.fields.imageHeight}
            onChange={(value) => onUpdateField("imageHeight", value.replace(/[^\d]/g, ""))}
          />
        </div>
      ) : null}

      {block.type === "authorcard" ? (
        <TextInput
          label="Foto çapı"
          value={block.fields.avatarSize}
          onChange={(value) => onUpdateField("avatarSize", value.replace(/[^\d]/g, ""))}
        />
      ) : null}

      {block.type === "orgchart" ? (
        <OrgNodeEditor block={block} onUpdate={onUpdate} />
      ) : null}

      {block.type === "rule" ? (
        <div className="mode-switch compact">
          <button
            className={block.fields.variant === "rule" ? "active" : ""}
            onClick={() => {
              onUpdateField("variant", "rule");
              onUpdate({ className: "rule" });
            }}
            type="button"
          >
            İnce
          </button>
          <button
            className={block.fields.variant === "rule-accent" ? "active" : ""}
            onClick={() => {
              onUpdateField("variant", "rule-accent");
              onUpdate({ className: "rule-accent" });
            }}
            type="button"
          >
            Vurgulu
          </button>
        </div>
      ) : null}

    </section>
  );
}

function OrgNodeEditor({
  block,
  onUpdate,
}: {
  block: Block;
  onUpdate: (patch: Partial<Block>) => void;
}) {
  const nodes = block.orgNodes ?? [];

  function updateNode(index: number, key: keyof OrgNode, value: string) {
    onUpdate({
      orgNodes: nodes.map((node, nodeIndex) =>
        nodeIndex === index ? { ...node, [key]: value } : node,
      ),
    });
  }

  return (
    <div className="org-node-editor">
      <h3>Şema kişileri</h3>
      {nodes.map((node, index) => (
        <div className="org-node-row" key={`${node.name}-${index}`}>
          <input
            aria-label="Rütbe"
            onChange={(event) => updateNode(index, "rank", event.target.value)}
            value={node.rank}
          />
          <input
            aria-label="İsim"
            onChange={(event) => updateNode(index, "name", event.target.value)}
            value={node.name}
          />
        </div>
      ))}
      <button
        onClick={() =>
          onUpdate({
            orgNodes: [...nodes, { name: "Yeni İsim", rank: "ROLE", tone: "node" }],
          })
        }
        type="button"
      >
        Kişi ekle
      </button>
    </div>
  );
}

function TextInput({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="field-control">
      <span>{label}</span>
      <input onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}

function TextArea({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="field-control">
      <span>{label}</span>
      <textarea onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}

function SelectInput({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label className="field-control">
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
