import { useState, useRef, useCallback, useEffect } from "react";

type Lang = "en" | "fr" | "ar";
type Screen = "home" | "place" | "settings";
type Item = { id: string; name: string; description: string; addedAt: string; photo?: string };
type Place = { id: string; name: string; icon: string; color: string; items: Item[] };

const EMOJI_DATA: { emoji: string; keywords: string[] }[] = [
  { emoji: "🏠", keywords: ["home", "house", "room", "living", "maison", "بيت"] },
  { emoji: "🏡", keywords: ["house", "home", "garden", "yard", "maison", "منزل"] },
  { emoji: "🚗", keywords: ["car", "vehicle", "auto", "drive", "voiture", "سيارة"] },
  { emoji: "🚕", keywords: ["taxi", "car", "vehicle", "voiture"] },
  { emoji: "🛏️", keywords: ["bed", "bedroom", "sleep", "chambre", "سرير"] },
  { emoji: "🛋️", keywords: ["sofa", "couch", "living room", "salon", "كنبة"] },
  { emoji: "📦", keywords: ["box", "storage", "package", "cardboard", "boite", "صندوق"] },
  { emoji: "🗄️", keywords: ["cabinet", "drawer", "file", "shelves", "armoire", "خزانة"] },
  { emoji: "🎒", keywords: ["bag", "backpack", "school", "pack", "sac", "حقيبة"] },
  { emoji: "👜", keywords: ["bag", "purse", "handbag", "tote", "sac", "حقيبة"] },
  { emoji: "🧳", keywords: ["luggage", "travel", "suitcase", "trip", "valise", "حقيبة سفر"] },
  { emoji: "🏋️", keywords: ["gym", "workout", "exercise", "fitness", "sport", "رياضة"] },
  { emoji: "🍳", keywords: ["kitchen", "cooking", "pan", "stove", "cuisine", "مطبخ"] },
  { emoji: "🖥️", keywords: ["desk", "computer", "monitor", "screen", "bureau", "مكتب"] },
  { emoji: "💻", keywords: ["laptop", "computer", "work", "portable", "حاسوب"] },
  { emoji: "📚", keywords: ["books", "library", "study", "reading", "livres", "كتب"] },
  { emoji: "📱", keywords: ["phone", "mobile", "cell", "smartphone", "téléphone", "هاتف"] },
  { emoji: "🚿", keywords: ["bathroom", "shower", "bath", "wash", "douche", "حمام"] },
  { emoji: "🛁", keywords: ["bathroom", "bathtub", "bath", "tub", "baignoire", "حوض"] },
  { emoji: "🪑", keywords: ["chair", "seat", "furniture", "sit", "chaise", "كرسي"] },
  { emoji: "🪴", keywords: ["plant", "garden", "nature", "flower pot", "plante", "نبات"] },
  { emoji: "🏢", keywords: ["office", "building", "work", "corporate", "bureau", "مكتب"] },
  { emoji: "✈️", keywords: ["plane", "airport", "travel", "flight", "avion", "طائرة"] },
  { emoji: "🎮", keywords: ["gaming", "game", "console", "play", "jeu", "ألعاب"] },
  { emoji: "📷", keywords: ["camera", "photo", "photography", "picture", "appareil", "كاميرا"] },
  { emoji: "🎵", keywords: ["music", "audio", "sound", "song", "musique", "موسيقى"] },
  { emoji: "🎨", keywords: ["art", "paint", "creative", "studio", "art", "فن"] },
  { emoji: "⚽", keywords: ["sports", "football", "soccer", "ball", "sport", "كرة"] },
  { emoji: "🏀", keywords: ["sports", "basketball", "ball", "court", "كرة سلة"] },
  { emoji: "🎾", keywords: ["sports", "tennis", "ball", "racket", "sport", "تنس"] },
  { emoji: "🧰", keywords: ["tools", "toolbox", "workshop", "fix", "outils", "أدوات"] },
  { emoji: "🔧", keywords: ["tool", "wrench", "repair", "fix", "outil", "مفتاح"] },
  { emoji: "🔑", keywords: ["key", "lock", "access", "keychain", "clé", "مفتاح"] },
  { emoji: "💊", keywords: ["medicine", "pills", "health", "pharmacy", "médicament", "دواء"] },
  { emoji: "👕", keywords: ["clothes", "shirt", "wardrobe", "closet", "vêtements", "ملابس"] },
  { emoji: "👗", keywords: ["dress", "clothes", "wardrobe", "fashion", "robe", "فستان"] },
  { emoji: "👟", keywords: ["shoes", "sneakers", "footwear", "kicks", "chaussures", "حذاء"] },
  { emoji: "🧣", keywords: ["scarf", "winter", "clothes", "cold", "écharpe", "وشاح"] },
  { emoji: "🎁", keywords: ["gift", "present", "surprise", "box", "cadeau", "هدية"] },
  { emoji: "📝", keywords: ["notes", "write", "document", "notebook", "notes", "ملاحظات"] },
  { emoji: "🗂️", keywords: ["folder", "files", "organize", "documents", "دossier", "ملفات"] },
  { emoji: "🏖️", keywords: ["beach", "vacation", "summer", "sand", "plage", "شاطئ"] },
  { emoji: "⛺", keywords: ["camping", "tent", "outdoor", "nature", "tente", "خيمة"] },
  { emoji: "💡", keywords: ["light", "lamp", "idea", "bulb", "lampe", "مصباح"] },
  { emoji: "🧹", keywords: ["broom", "clean", "sweep", "balai", "مكنسة"] },
  { emoji: "🧺", keywords: ["basket", "laundry", "clothes", "washing", "panier", "سلة"] },
  { emoji: "🍽️", keywords: ["dining", "kitchen", "food", "table", "cuisine", "طعام"] },
  { emoji: "☕", keywords: ["coffee", "kitchen", "drink", "mug", "café", "قهوة"] },
  { emoji: "🛒", keywords: ["shopping", "cart", "market", "grocery", "chariot", "تسوق"] },
  { emoji: "🎸", keywords: ["guitar", "music", "instrument", "band", "guitare", "قيثارة"] },
  { emoji: "🚲", keywords: ["bike", "bicycle", "cycle", "sport", "vélo", "دراجة"] },
  { emoji: "⚙️", keywords: ["gear", "settings", "machine", "workshop", "engrenage", "ترس"] },
  { emoji: "🧲", keywords: ["magnet", "workshop", "tools", "metal", "aimant", "مغناطيس"] },
  { emoji: "🪞", keywords: ["mirror", "bedroom", "bathroom", "reflection", "miroir", "مرآة"] },
  { emoji: "🚪", keywords: ["door", "entrance", "room", "entry", "porte", "باب"] },
  { emoji: "🪟", keywords: ["window", "room", "light", "glass", "fenêtre", "نافذة"] },
  { emoji: "🖼️", keywords: ["picture", "art", "frame", "wall", "tableau", "لوحة"] },
];

const PLACE_COLORS = [
  { bg: "bg-violet-100", icon: "bg-violet-500", text: "text-violet-700" },
  { bg: "bg-sky-100", icon: "bg-sky-500", text: "text-sky-700" },
  { bg: "bg-emerald-100", icon: "bg-emerald-500", text: "text-emerald-700" },
  { bg: "bg-amber-100", icon: "bg-amber-500", text: "text-amber-700" },
  { bg: "bg-rose-100", icon: "bg-rose-500", text: "text-rose-700" },
  { bg: "bg-indigo-100", icon: "bg-indigo-500", text: "text-indigo-700" },
];

const T = {
  en: {
    myPlaces: "My Places", settings: "Settings", places: "Places", items: "Items", item: "Item",
    searchPlaceholder: "Search places & items…", noResults: "No results", noResultsHint: "Try searching something else",
    language: "Language", darkMode: "Dark Mode", appearance: "Appearance", legal: "Legal", support: "Support",
    privacy: "Privacy & Policy", about: "About App", contact: "Contact Us", share: "Share App",
    newPlace: "New Place", name: "Name", icon: "Icon", color: "Color", addPlace: "Add Place",
    addItem: "Add Item", addingTo: "Adding to", itemName: "Item Name", description: "Description",
    optional: "optional", photo: "Photo", noPhoto: "No photo", tapPhoto: "Tap to add a photo",
    moveTo: "Move to…", selectDest: "Select a destination for",
    noOtherPlaces: "No other places yet", addAnotherFirst: "Add another place first",
    deletePlaceTitle: "Delete Place?", deletePlaceBody: "and all its items will be permanently deleted.",
    deleteItemTitle: "Remove Item?", deleteItemBody: "This item will be permanently removed from this place.",
    cancel: "Cancel", remove: "Remove", delete: "Delete",
    storedHere: "items stored here", nothingYet: "Nothing here yet",
    tapToAdd: "Tap + to add your first item", noItems: "No items found", tryDiff: "Try a different search term",
    addedOn: "Added", searchIcons: "Search icons… (home, car, bed…)", noIconsFound: "No icons for",
    change: "Change", placeholderName: "e.g. Bedroom, Kitchen, Garage…",
    whatIsIt: "What is it called?", colorSizeBrand: "Color, size, brand…",
    aboutTitle: "Stuffer", aboutVersion: "Version 1.0.0",
    aboutDesc: "Organize your belongings by place. Never lose track of where things are stored.",
    privacyTitle: "Privacy & Policy",
    privacyText: "All your data is stored locally on your device. We never collect, share, or transmit any personal information. Your places and items are entirely private and secure.",
    contactTitle: "Contact Us", contactText: "Have a question or feedback? Reach out to us:",
    contactEmail: "develo679@gmail.com",
    shareText: "https://drive.google.com/file/d/1gaCSjXTS8OVgtdINkjt882riu9dwNn-b/view?usp=drive_link",
    copied: "Copied!", noPlacesYet: "No places yet", tapToAddPlace: "Tap + to add your first place",
  },
  fr: {
    myPlaces: "Mes Lieux", settings: "Paramètres", places: "Lieux", items: "Objets", item: "Objet",
    searchPlaceholder: "Rechercher lieux & objets…", noResults: "Aucun résultat", noResultsHint: "Essayez autre chose",
    language: "Langue", darkMode: "Mode Sombre", appearance: "Apparence", legal: "Légal", support: "Support",
    privacy: "Confidentialité", about: "À propos", contact: "Nous contacter", share: "Partager l'app",
    newPlace: "Nouveau lieu", name: "Nom", icon: "Icône", color: "Couleur", addPlace: "Ajouter le lieu",
    addItem: "Ajouter l'objet", addingTo: "Ajout dans", itemName: "Nom de l'objet", description: "Description",
    optional: "optionnel", photo: "Photo", noPhoto: "Pas de photo", tapPhoto: "Appuyer pour ajouter une photo",
    moveTo: "Déplacer vers…", selectDest: "Choisir une destination pour",
    noOtherPlaces: "Pas d'autres lieux", addAnotherFirst: "Ajoutez d'abord un autre lieu",
    deletePlaceTitle: "Supprimer le lieu ?", deletePlaceBody: "et tous ses objets seront définitivement supprimés.",
    deleteItemTitle: "Supprimer l'objet ?", deleteItemBody: "Cet objet sera définitivement supprimé de ce lieu.",
    cancel: "Annuler", remove: "Supprimer", delete: "Supprimer",
    storedHere: "objets stockés ici", nothingYet: "Rien ici pour l'instant",
    tapToAdd: "Appuyez + pour le premier objet", noItems: "Aucun objet trouvé", tryDiff: "Essayez un autre terme",
    addedOn: "Ajouté le", searchIcons: "Chercher icônes… (maison, voiture…)", noIconsFound: "Aucune icône pour",
    change: "Changer", placeholderName: "ex. Chambre, Cuisine, Garage…",
    whatIsIt: "Comment s'appelle-t-il ?", colorSizeBrand: "Couleur, taille, marque…",
    aboutTitle: "Stuffer", aboutVersion: "Version 1.0.0",
    aboutDesc: "Organisez vos affaires par lieu. Ne perdez plus jamais vos objets.",
    privacyTitle: "Confidentialité",
    privacyText: "Toutes vos données sont stockées localement sur votre appareil. Nous ne collectons, partageons ou transmettons aucune information personnelle. Vos lieux et objets sont entièrement privés.",
    contactTitle: "Nous contacter", contactText: "Une question ou un retour ? Contactez-nous :",
    contactEmail: "develo679@gmail.com",
    shareText: "https://drive.google.com/file/d/1gaCSjXTS8OVgtdINkjt882riu9dwNn-b/view?usp=drive_link",
    copied: "Copié !", noPlacesYet: "Aucun lieu", tapToAddPlace: "Appuyez + pour ajouter un lieu",
  },
  ar: {
    myPlaces: "أماكني", settings: "الإعدادات", places: "الأماكن", items: "عناصر", item: "عنصر",
    searchPlaceholder: "ابحث في الأماكن والعناصر…", noResults: "لا توجد نتائج", noResultsHint: "جرب البحث بكلمة أخرى",
    language: "اللغة", darkMode: "الوضع الداكن", appearance: "المظهر", legal: "القانوني", support: "الدعم",
    privacy: "الخصوصية والسياسة", about: "حول التطبيق", contact: "اتصل بنا", share: "مشاركة التطبيق",
    newPlace: "مكان جديد", name: "الاسم", icon: "الأيقونة", color: "اللون", addPlace: "إضافة مكان",
    addItem: "إضافة عنصر", addingTo: "إضافة إلى", itemName: "اسم العنصر", description: "الوصف",
    optional: "اختياري", photo: "صورة", noPhoto: "لا توجد صورة", tapPhoto: "اضغط لإضافة صورة",
    moveTo: "نقل إلى…", selectDest: "اختر وجهة لـ",
    noOtherPlaces: "لا توجد أماكن أخرى", addAnotherFirst: "أضف مكاناً آخر أولاً",
    deletePlaceTitle: "حذف المكان؟", deletePlaceBody: "وجميع عناصره ستُحذف نهائياً.",
    deleteItemTitle: "حذف العنصر؟", deleteItemBody: "سيتم حذف هذا العنصر نهائياً من هذا المكان.",
    cancel: "إلغاء", remove: "حذف", delete: "حذف",
    storedHere: "عناصر مخزنة هنا", nothingYet: "لا يوجد شيء هنا بعد",
    tapToAdd: "اضغط + لإضافة أول عنصر", noItems: "لا توجد عناصر", tryDiff: "جرب مصطلحاً مختلفاً",
    addedOn: "أُضيف في", searchIcons: "ابحث عن أيقونة… (بيت، سيارة…)", noIconsFound: "لا أيقونات لـ",
    change: "تغيير", placeholderName: "مثل: غرفة النوم، المطبخ، الكراج…",
    whatIsIt: "ما اسمه؟", colorSizeBrand: "اللون، الحجم، الماركة…",
    aboutTitle: "Stuffer", aboutVersion: "الإصدار 1.0.0",
    aboutDesc: "نظّم أغراضك حسب المكان. لا تفقد شيئاً بعد الآن.",
    privacyTitle: "الخصوصية والسياسة",
    privacyText: "جميع بياناتك مخزنة محلياً على جهازك. نحن لا نجمع أو نشارك أو نرسل أي معلومات شخصية. أماكنك وعناصرك خاصة تماماً وآمنة.",
    contactTitle: "اتصل بنا", contactText: "هل لديك سؤال أو اقتراح؟ تواصل معنا:",
    contactEmail: "develo679@gmail.com",
    shareText: "https://drive.google.com/file/d/1gaCSjXTS8OVgtdINkjt882riu9dwNn-b/view?usp=drive_link",
    copied: "تم النسخ!", noPlacesYet: "لا توجد أماكن بعد", tapToAddPlace: "اضغط + لإضافة مكانك الأول",
  },
};

const INITIAL_PLACES: Place[] = [
  {
    id: "1", name: "My Desk", icon: "🖥️", color: "0",
    items: [
    ],
  },
  {
    id: "2", name: "My Car", icon: "🚗", color: "1",
    items: [
    ],
  },
  {
    id: "3", name: "Storage Room", icon: "📦", color: "2",
    items: [
    ],
  },
];

function fmtDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(
    lang === "ar" ? "ar-SA" : lang === "fr" ? "fr-FR" : "en-US",
    { month: "short", day: "numeric" }
  );
}

// SVG chevron paths
const FWD = "M1 1L7 7L1 13";
const BWD = "M7 1L1 7L7 13";

export default function App() {
    const [isDark, setIsDark] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem("stuffer_dark_mode");
            return saved === "true";
        } catch (error) {
            console.error("Failed to load dark mode:", error);
            return false;
        }
    });
    useEffect(() => {
        try {
            localStorage.setItem("stuffer_dark_mode", String(isDark));
        } catch (error) {
            console.error("Failed to save dark mode:", error);
        }
    }, [isDark]);


    const [lang, setLang] = useState<Lang>(() => {
        try {
            const saved = localStorage.getItem("stuffer_language");

            if (saved === "en" || saved === "fr" || saved === "ar") {
                return saved;
            }

            return "en";
        } catch (error) {
            console.error("Failed to load language:", error);
            return "en";
        }
    });
    useEffect(() => {
        try {
            localStorage.setItem("stuffer_language", lang);
        } catch (error) {
            console.error("Failed to save language:", error);
        }
    }, [lang]);

  // to save places each time user add new ones
    const [places, setPlaces] = useState<Place[]>(() => {
        try {
            const saved = localStorage.getItem("stuffer_places");

            if (saved) {
                return JSON.parse(saved);
            }

            return INITIAL_PLACES;
        } catch (error) {
            console.error("Failed to load saved places:", error);
            return INITIAL_PLACES;
        }
    });
    useEffect(() => {
        try {
            localStorage.setItem("stuffer_places", JSON.stringify(places));
        } catch (error) {
            console.error("Failed to save places:", error);
        }
    }, [places]);

  const [screen, setScreen] = useState<Screen>("home");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Item/place modals
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showDeleteItem, setShowDeleteItem] = useState<string | null>(null);
  const [showDeletePlace, setShowDeletePlace] = useState<string | null>(null);
  const [showMoveItem, setShowMoveItem] = useState<string | null>(null);
  const [viewPhoto, setViewPhoto] = useState<string | null>(null);

  // Settings modals
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [copied, setCopied] = useState(false);

  // Add place form
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceIcon, setNewPlaceIcon] = useState("📦");
  const [newPlaceColor, setNewPlaceColor] = useState("0");
  const [iconSearch, setIconSearch] = useState("");

  // Add item form
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemPhoto, setNewItemPhoto] = useState<string | undefined>();

  const photoRef = useRef<HTMLInputElement>(null);
  const t = T[lang];
  const isRtl = lang === "ar";
  const selectedPlace = places.find((p) => p.id === selectedPlaceId) ?? null;
  const ci = selectedPlace ? parseInt(selectedPlace.color) % PLACE_COLORS.length : 0;
  const pc = PLACE_COLORS[ci];

  const q = searchQuery.toLowerCase().trim();
  const globalPlaces = q ? places.filter((p) => p.name.toLowerCase().includes(q)) : places;
  const globalItems: { item: Item; place: Place }[] = q
    ? places.flatMap((p) =>
        p.items
          .filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
          .map((item) => ({ item, place: p }))
      )
    : [];

  const filteredItems = selectedPlace
    ? selectedPlace.items.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredEmojis = iconSearch.trim()
    ? EMOJI_DATA.filter((e) => e.keywords.some((k) => k.includes(iconSearch.toLowerCase())))
    : EMOJI_DATA;

  function openPlace(id: string) {
    history.pushState({ s: "place" }, "");
    setSelectedPlaceId(id);
    setSearchQuery("");
    setScreen("place");
  }

  function openSettings() {
    history.pushState({ s: "settings" }, "");
    setScreen("settings");
  }

  function goHome() {
    setScreen("home");
    setSelectedPlaceId(null);
    setSearchQuery("");
  }

  useEffect(() => {
    const onPop = () => {
      if (screen === "place" || screen === "settings") goHome();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [screen]);

  function handleAddPlace() {
    if (!newPlaceName.trim()) return;
    setPlaces((p) => [...p, { id: Date.now().toString(), name: newPlaceName.trim(), icon: newPlaceIcon, color: newPlaceColor, items: [] }]);
    setNewPlaceName(""); setNewPlaceIcon("📦"); setNewPlaceColor("0"); setIconSearch("");
    setShowAddPlace(false);
  }

  function handleAddItem() {
    if (!newItemName.trim() || !selectedPlaceId) return;
    const item: Item = { id: Date.now().toString(), name: newItemName.trim(), description: newItemDesc.trim(), addedAt: new Date().toISOString().split("T")[0], photo: newItemPhoto };
    setPlaces((p) => p.map((pl) => pl.id === selectedPlaceId ? { ...pl, items: [...pl.items, item] } : pl));
    setNewItemName(""); setNewItemDesc(""); setNewItemPhoto(undefined);
    setShowAddItem(false);
  }

  function handleDeleteItem(id: string) {
    if (!selectedPlaceId) return;
    setPlaces((p) => p.map((pl) => pl.id === selectedPlaceId ? { ...pl, items: pl.items.filter((i) => i.id !== id) } : pl));
    setShowDeleteItem(null);
  }

  function handleDeletePlace(id: string) {
    setPlaces((p) => p.filter((pl) => pl.id !== id));
    setShowDeletePlace(null);
  }

  function handleMoveItem(toId: string) {
    if (!selectedPlaceId || !showMoveItem) return;
    setPlaces((prev) => {
      const item = prev.find((p) => p.id === selectedPlaceId)?.items.find((i) => i.id === showMoveItem);
      if (!item) return prev;
      return prev.map((p) => {
        if (p.id === selectedPlaceId) return { ...p, items: p.items.filter((i) => i.id !== showMoveItem) };
        if (p.id === toId) return { ...p, items: [...p.items, item] };
        return p;
      });
    });
    setShowMoveItem(null);
  }

  const handlePhotoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewItemPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: "Where Is My Stuff?", text: t.shareText });
    } else {
      navigator.clipboard.writeText(t.shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  }

  const totalItems = places.reduce((a, p) => a + p.items.length, 0);
  const sc = isDark ? "#ffffff" : "#1c1c1e";

  // Color helpers
  const bg = isDark ? "bg-[#1c1c1e]" : "bg-[#f2f2f7]";
  const card = isDark ? "bg-[#2c2c2e]" : "bg-white";
  const inputBg = isDark ? "bg-[#3a3a3c]" : "bg-slate-50";
  const mutedBg = isDark ? "bg-[#3a3a3c]" : "bg-slate-100";
  const primaryText = isDark ? "text-white" : "text-slate-900";
  const secondaryText = isDark ? "text-slate-200" : "text-slate-700";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const dimText = isDark ? "text-slate-500" : "text-slate-400";
  const ring = isDark ? "ring-[#3a3a3c]" : "ring-slate-100";
  const ring2 = isDark ? "ring-[#48484a]" : "ring-slate-200";
  const divider = isDark ? "border-[#3a3a3c]" : "border-slate-100";
  const label = isDark ? "text-[#8e8e93]" : "text-slate-500";
  const modalBg = isDark ? "bg-[#1c1c1e]" : "bg-white";
  const closeBtn = isDark ? `${mutedBg} ${primaryText}` : "bg-slate-100 text-slate-500";

  // Chevron direction for RTL
  const chevFwd = isRtl ? BWD : FWD;
  const chevBack = isRtl ? FWD : BWD;

  const anyModal = showAddPlace || showAddItem || showMoveItem || showDeleteItem || showDeletePlace ||
    viewPhoto || showLangPicker || showPrivacy || showAbout || showContact;

  return (
    <div className="size-full flex items-center justify-center bg-slate-200">
          <div
              dir={isRtl ? "rtl" : "ltr"}
              className={`relative flex flex-col w-full h-full ${bg} overflow-hidden`}
          >

        {/* ── HOME SCREEN ── */}
        {screen === "home" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className={`flex-none px-6 pt-3 pb-4 ${bg}`}>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h1 className={`text-[28px] font-bold leading-tight ${primaryText}`}>{t.myPlaces}</h1>
                  <p className={`text-[13px] mt-0.5 ${mutedText}`}>
                    {places.length} {t.places} · {totalItems} {t.items}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPlace(true)}
                  className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center shadow-md shadow-violet-400/40 active:scale-95 transition-transform mt-1"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 3.5V14.5M3.5 9H14.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="mt-3 relative">
                <svg className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 ${dimText}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${isRtl ? "pr-9 pl-9" : "pl-9 pr-9"} py-2.5 rounded-xl ${inputBg} text-[14px] ${primaryText} placeholder-slate-400 outline-none ring-1 ${ring2} focus:ring-violet-400 transition-all`}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className={`absolute ${isRtl ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 ${dimText}`}>
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className={`flex-1 overflow-y-auto px-6 pb-4 space-y-3 ${bg}`}>
              {q && globalPlaces.length === 0 && globalItems.length === 0 && (
                <div className="flex flex-col items-center justify-center pt-20">
                  <span className="text-5xl mb-3">🔍</span>
                  <p className={`text-[15px] font-medium ${mutedText}`}>{t.noResults}</p>
                  <p className={`text-[13px] mt-1 ${dimText}`}>{t.noResultsHint}</p>
                </div>
              )}
              {!q && places.length === 0 && (
                <div className="flex flex-col items-center justify-center pt-20">
                  <span className="text-5xl mb-3">📍</span>
                  <p className={`text-[15px] font-medium ${mutedText}`}>{t.noPlacesYet}</p>
                  <p className={`text-[13px] mt-1 ${dimText}`}>{t.tapToAddPlace}</p>
                </div>
              )}

              {/* Places section */}
              {globalPlaces.length > 0 && (
                <>
                  {q && <p className={`text-[11px] font-bold uppercase tracking-widest px-1 ${label}`}>{t.places}</p>}
                  {globalPlaces.map((place) => {
                    const ci2 = parseInt(place.color) % PLACE_COLORS.length;
                    const c = PLACE_COLORS[ci2];
                    return (
                      <div key={place.id} className={`${card} rounded-2xl ring-1 ${ring} shadow-sm overflow-hidden`}>
                        <div className="flex items-center gap-4 p-4">
                          <button onClick={() => openPlace(place.id)} className="flex items-center gap-4 flex-1 min-w-0 text-left active:opacity-70">
                            <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center flex-none text-2xl`}>{place.icon}</div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[16px] font-semibold truncate ${primaryText}`}>{place.name}</p>
                              <p className={`text-[13px] mt-0.5 font-medium ${c.text}`}>{place.items.length} {place.items.length === 1 ? t.item : t.items}</p>
                            </div>
                          </button>
                          <div className="flex items-center gap-1 flex-none">
                            <button
                              onClick={() => setShowDeletePlace(place.id)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${dimText} hover:text-rose-400 hover:bg-rose-50 transition-colors`}
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 4H12M5 4V2.5C5 2.2 5.2 2 5.5 2H8.5C8.8 2 9 2.2 9 2.5V4M5.5 6.5V10M8.5 6.5V10M3 4L3.5 11.5C3.5 11.8 3.7 12 4 12H10C10.3 12 10.5 11.8 10.5 11.5L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                            <button onClick={() => openPlace(place.id)} className={`${dimText} active:opacity-50`}>
                              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                                <path d={chevFwd} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Global item results */}
              {q && globalItems.length > 0 && (
                <>
                  <p className={`text-[11px] font-bold uppercase tracking-widest px-1 pt-1 ${label}`}>{t.items}</p>
                  {globalItems.map(({ item, place }) => {
                    const ci2 = parseInt(place.color) % PLACE_COLORS.length;
                    const c = PLACE_COLORS[ci2];
                    return (
                      <button key={item.id} onClick={() => openPlace(place.id)} className={`w-full text-left ${card} rounded-2xl ring-1 ${ring} shadow-sm active:scale-[0.98] transition-transform`}>
                        <div className="p-3.5 flex items-center gap-3">
                          {item.photo ? (
                            <div className="w-12 h-12 rounded-xl overflow-hidden flex-none ring-1 ring-slate-100">
                              <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className={`w-12 h-12 rounded-xl ${c.bg} flex flex-col items-center justify-center flex-none`}>
                              <svg width="18" height="16" viewBox="0 0 24 20" fill="none" className={c.text}>
                                <rect x="1" y="3" width="22" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="12" cy="11" r="4" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M8 3L9.5 1H14.5L16 3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-[14px] font-semibold truncate ${primaryText}`}>{item.name}</p>
                            {item.description && <p className={`text-[12px] truncate ${mutedText}`}>{item.description}</p>}
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[11px]">{place.icon}</span>
                              <span className={`text-[11px] font-medium ${c.text}`}>{place.name}</span>
                            </div>
                          </div>
                          <svg width="7" height="12" viewBox="0 0 8 14" fill="none" className={`${dimText} flex-none`}>
                            <path d={chevFwd} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}

        {/* ── PLACE DETAIL ── */}
        {screen === "place" && selectedPlace && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className={`flex-none px-5 pt-2 pb-5 ${pc.bg}`}>
              <button onClick={goHome} className="flex items-center gap-1.5 text-violet-600 mb-3 active:opacity-70">
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                  <path d={chevBack} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[14px] font-medium">{t.places}</span>
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center text-3xl shadow-sm flex-none">{selectedPlace.icon}</div>
                <div className="flex-1 min-w-0">
                  <h2 className={`text-[24px] font-bold leading-tight truncate ${primaryText}`}>{selectedPlace.name}</h2>
                  <p className={`text-[13px] font-medium mt-0.5 ${pc.text}`}>{selectedPlace.items.length} {t.storedHere}</p>
                </div>
              </div>
              <div className="mt-4 relative">
                <svg className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 ${mutedText}`} width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${isRtl ? "pr-9" : "pl-9"} py-2.5 rounded-xl bg-white/70 text-[14px] ${primaryText} placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-400 transition-all`}
                />
              </div>
            </div>

            <div className={`flex-1 overflow-y-auto ${bg} px-5 pt-4 pb-28 space-y-2.5`}>
              {filteredItems.length === 0 && (
                <div className="flex flex-col items-center justify-center pt-16">
                  <span className="text-5xl mb-3">{selectedPlace.items.length === 0 ? "📭" : "🔍"}</span>
                  <p className={`text-[15px] font-medium ${mutedText}`}>{selectedPlace.items.length === 0 ? t.nothingYet : t.noItems}</p>
                  <p className={`text-[13px] mt-1 text-center ${dimText}`}>{selectedPlace.items.length === 0 ? t.tapToAdd : t.tryDiff}</p>
                </div>
              )}
              {filteredItems.map((item) => (
                <div key={item.id} className={`${card} rounded-2xl ring-1 ${ring} shadow-sm`}>
                  <div className="p-4 flex items-start gap-3">
                    {item.photo ? (
                      <button onClick={() => setViewPhoto(item.photo!)} className={`w-14 h-14 rounded-xl overflow-hidden flex-none ring-1 ${ring} active:scale-95 transition-transform`}>
                        <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                      </button>
                    ) : (
                      <div className={`w-14 h-14 rounded-xl ${pc.bg} flex flex-col items-center justify-center flex-none gap-1`}>
                        <svg width="20" height="18" viewBox="0 0 24 20" fill="none" className={pc.text}>
                          <rect x="1" y="3" width="22" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="12" cy="11" r="4" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M8 3L9.5 1H14.5L16 3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                        <span className={`text-[9px] font-medium ${pc.text} opacity-70`}>{t.noPhoto}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-[15px] font-semibold ${primaryText}`}>{item.name}</p>
                      {item.description && <p className={`text-[13px] mt-0.5 ${mutedText}`}>{item.description}</p>}
                      <p className={`text-[11px] mt-1.5 ${dimText}`}>{t.addedOn} {fmtDate(item.addedAt, lang)}</p>
                    </div>
                    <div className="flex flex-col gap-1 flex-none">
                      <button
                        onClick={() => setShowMoveItem(item.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${dimText} hover:text-violet-500 hover:bg-violet-50 transition-colors`}
                      >
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                          <path d="M2 8H14M10 4L14 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowDeleteItem(item.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${dimText} hover:text-rose-400 hover:bg-rose-50 transition-colors`}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 4H12M5 4V2.5C5 2.2 5.2 2 5.5 2H8.5C8.8 2 9 2.2 9 2.5V4M5.5 6.5V10M8.5 6.5V10M3 4L3.5 11.5C3.5 11.8 3.7 12 4 12H10C10.3 12 10.5 11.8 10.5 11.5L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-8 right-6">
              <button
                onClick={() => setShowAddItem(true)}
                className={`w-14 h-14 rounded-full ${pc.icon} flex items-center justify-center shadow-xl active:scale-90 transition-transform`}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 4V18M4 11H18" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── SETTINGS SCREEN ── */}
        {screen === "settings" && (
          <div className={`flex flex-col flex-1 overflow-hidden ${bg}`}>
            <div className={`flex-none px-6 pt-3 pb-2 ${bg}`}>
              <h1 className={`text-[28px] font-bold leading-tight ${primaryText}`}>{t.settings}</h1>
            </div>
            <div className={`flex-1 overflow-y-auto px-5 pb-4 space-y-5 ${bg}`}>
              {/* App identity */}
              <div className="flex flex-col items-center pt-2 pb-3">
                <div className="w-20 h-20 rounded-[22px] bg-violet-600 flex items-center justify-center text-4xl shadow-lg shadow-violet-400/30 mb-3">📍</div>
                <p className={`text-[17px] font-bold ${primaryText}`}>{t.aboutTitle}</p>
                <p className={`text-[13px] mt-0.5 ${mutedText}`}>{t.aboutVersion}</p>
              </div>

              {/* Appearance */}
              <div>
                <p className={`text-[11px] font-bold uppercase tracking-widest px-1 mb-2 ${label}`}>{t.appearance}</p>
                <div className={`${card} rounded-2xl ring-1 ${ring} divide-y ${divider}`}>
                  {/* Dark mode */}
                  <div className="flex items-center gap-3.5 px-4 py-3.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center flex-none">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="white" />
                      </svg>
                    </div>
                    <p className={`flex-1 text-[15px] font-medium ${primaryText}`}>{t.darkMode}</p>
                    <button
                      onClick={() => setIsDark(!isDark)}
                      className={`w-12 h-7 rounded-full transition-all duration-200 flex items-center px-0.5 flex-none ${isDark ? "bg-violet-600" : "bg-slate-200"}`}
                    >
                      <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${isDark ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                  {/* Language */}
                  <button onClick={() => setShowLangPicker(true)} className="w-full flex items-center gap-3.5 px-4 py-3.5 active:opacity-60">
                    <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center flex-none">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8" />
                        <path d="M12 3C10 6 9 9 9 12C9 15 10 18 12 21" stroke="white" strokeWidth="1.8" />
                        <path d="M12 3C14 6 15 9 15 12C15 15 14 18 12 21" stroke="white" strokeWidth="1.8" />
                        <path d="M3.5 9H20.5M3.5 15H20.5" stroke="white" strokeWidth="1.8" />
                      </svg>
                    </div>
                    <p className={`flex-1 text-left text-[15px] font-medium ${primaryText}`}>{t.language}</p>
                    <span className={`text-[14px] ${mutedText}`}>{lang === "en" ? "English" : lang === "fr" ? "Français" : "العربية"}</span>
                    <svg width="7" height="12" viewBox="0 0 8 14" fill="none" className={dimText}>
                      <path d={chevFwd} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Legal */}
              <div>
                <p className={`text-[11px] font-bold uppercase tracking-widest px-1 mb-2 ${label}`}>{t.legal}</p>
                <div className={`${card} rounded-2xl ring-1 ${ring} divide-y ${divider}`}>
                  <button onClick={() => setShowPrivacy(true)} className="w-full flex items-center gap-3.5 px-4 py-3.5 active:opacity-60">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center flex-none">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className={`flex-1 text-left text-[15px] font-medium ${primaryText}`}>{t.privacy}</p>
                    <svg width="7" height="12" viewBox="0 0 8 14" fill="none" className={dimText}>
                      <path d={chevFwd} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button onClick={() => setShowAbout(true)} className="w-full flex items-center gap-3.5 px-4 py-3.5 active:opacity-60">
                    <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center flex-none">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8" />
                        <path d="M12 8v1M12 11v5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <p className={`flex-1 text-left text-[15px] font-medium ${primaryText}`}>{t.about}</p>
                    <svg width="7" height="12" viewBox="0 0 8 14" fill="none" className={dimText}>
                      <path d={chevFwd} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Support */}
              <div>
                <p className={`text-[11px] font-bold uppercase tracking-widest px-1 mb-2 ${label}`}>{t.support}</p>
                <div className={`${card} rounded-2xl ring-1 ${ring} divide-y ${divider}`}>
                  <button onClick={() => setShowContact(true)} className="w-full flex items-center gap-3.5 px-4 py-3.5 active:opacity-60">
                    <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center flex-none">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="4" width="20" height="16" rx="3" stroke="white" strokeWidth="1.8" />
                        <path d="M2 7l10 7 10-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </div>
                    <p className={`flex-1 text-left text-[15px] font-medium ${primaryText}`}>{t.contact}</p>
                    <svg width="7" height="12" viewBox="0 0 8 14" fill="none" className={dimText}>
                      <path d={chevFwd} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button onClick={handleShare} className="w-full flex items-center gap-3.5 px-4 py-3.5 active:opacity-60">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center flex-none">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M16 6l-4-4-4 4M12 2v13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className={`flex-1 text-left text-[15px] font-medium ${primaryText}`}>{copied ? t.copied : t.share}</p>
                    {copied
                      ? <span className="text-emerald-500 text-[14px] font-semibold">✓</span>
                      : <svg width="7" height="12" viewBox="0 0 8 14" fill="none" className={dimText}><path d={chevFwd} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── BOTTOM NAV ── */}
        {screen !== "place" && (
          <div className={`flex-none flex items-center justify-around px-6 pt-2 pb-1 border-t ${divider} ${bg}`}>
            <button
              onClick={goHome}
              className={`flex flex-col items-center gap-0.5 px-6 py-1.5 rounded-xl transition-colors ${screen === "home" ? "text-violet-600" : mutedText}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
                  stroke="currentColor"
                  strokeWidth={screen === "home" ? "2.2" : "1.8"}
                  strokeLinejoin="round"
                  fill={screen === "home" ? "currentColor" : "none"}
                  fillOpacity="0.12"
                />
              </svg>
              <span className="text-[10px] font-semibold">{t.places}</span>
            </button>
            <button
              onClick={openSettings}
              className={`flex flex-col items-center gap-0.5 px-6 py-1.5 rounded-xl transition-colors ${screen === "settings" ? "text-violet-600" : mutedText}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3"
                  stroke="currentColor"
                  strokeWidth={screen === "settings" ? "2.2" : "1.8"}
                  fill={screen === "settings" ? "currentColor" : "none"}
                  fillOpacity="0.15"
                />
                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  stroke="currentColor"
                  strokeWidth={screen === "settings" ? "2.2" : "1.8"}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[10px] font-semibold">{t.settings}</span>
            </button>
          </div>
        )}

        {/* Home indicator */}
        <div className="flex-none flex justify-center pb-2 pt-1">
          <div className={`w-32 h-1 rounded-full ${isDark ? "bg-white/20" : "bg-slate-800/20"}`} />
        </div>

        {/* ══════════════ MODALS ══════════════ */}

        {/* Add Place */}
        {showAddPlace && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-end z-50">
            <div className={`w-full ${modalBg} rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl max-h-[90%] overflow-y-auto`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className={`text-[18px] font-bold ${primaryText}`}>{t.newPlace}</h3>
                <button onClick={() => { setShowAddPlace(false); setNewPlaceName(""); setIconSearch(""); }} className={`w-8 h-8 rounded-full ${closeBtn} flex items-center justify-center`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`text-[12px] font-semibold uppercase tracking-wider ${label}`}>{t.name}</label>
                  <input
                    type="text" placeholder={t.placeholderName} value={newPlaceName}
                    onChange={(e) => setNewPlaceName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddPlace()}
                    autoFocus
                    className={`mt-1.5 w-full px-4 py-3 rounded-xl ${inputBg} text-[15px] ${primaryText} placeholder-slate-400 outline-none ring-1 ${ring2} focus:ring-violet-400 transition-all`}
                  />
                </div>
                <div>
                  <label className={`text-[12px] font-semibold uppercase tracking-wider ${label}`}>{t.icon}</label>
                  <div className="mt-1.5 flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-violet-100 ring-2 ring-violet-400 flex items-center justify-center text-2xl flex-none">{newPlaceIcon}</div>
                    <div className="flex-1 relative">
                      <svg className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 ${dimText}`} width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <input
                        type="text" placeholder={t.searchIcons} value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                        className={`w-full ${isRtl ? "pr-8 pl-3" : "pl-8 pr-3"} py-2.5 rounded-xl ${inputBg} text-[13px] ${primaryText} placeholder-slate-400 outline-none ring-1 ${ring2} focus:ring-violet-400 transition-all`}
                      />
                    </div>
                  </div>
                  <div className="h-28 overflow-y-auto">
                    {filteredEmojis.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-2xl mb-1">🤷</span>
                        <p className={`text-[12px] ${mutedText}`}>{t.noIconsFound} "{iconSearch}"</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {filteredEmojis.map(({ emoji }) => (
                          <button
                            key={emoji}
                            onClick={() => setNewPlaceIcon(emoji)}
                            className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${newPlaceIcon === emoji ? "bg-violet-100 ring-2 ring-violet-400 scale-110" : `${mutedBg}`}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className={`text-[12px] font-semibold uppercase tracking-wider ${label}`}>{t.color}</label>
                  <div className="mt-1.5 flex gap-2">
                    {PLACE_COLORS.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setNewPlaceColor(String(i))}
                        className={`w-8 h-8 rounded-full ${c.icon} transition-all ${newPlaceColor === String(i) ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : ""}`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleAddPlace}
                  disabled={!newPlaceName.trim()}
                  className="w-full py-3.5 rounded-2xl bg-violet-600 text-white text-[16px] font-semibold disabled:opacity-40 active:scale-[0.98] transition-all mt-2"
                >
                  {t.addPlace}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Item */}
        {showAddItem && selectedPlace && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-end z-50">
            <div className={`w-full ${modalBg} rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-[18px] font-bold ${primaryText}`}>{t.addItem}</h3>
                <button onClick={() => { setShowAddItem(false); setNewItemName(""); setNewItemDesc(""); setNewItemPhoto(undefined); }} className={`w-8 h-8 rounded-full ${closeBtn} flex items-center justify-center`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </button>
              </div>
              <p className={`text-[13px] ${mutedText} mb-4`}>{t.addingTo} <span className={`font-semibold ${secondaryText}`}>{selectedPlace.name}</span> {selectedPlace.icon}</p>
              <div className="space-y-3">
                <div>
                  <label className={`text-[12px] font-semibold uppercase tracking-wider ${label}`}>{t.itemName}</label>
                  <input
                    type="text" placeholder={t.whatIsIt} value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)} autoFocus
                    className={`mt-1.5 w-full px-4 py-3 rounded-xl ${inputBg} text-[15px] ${primaryText} placeholder-slate-400 outline-none ring-1 ${ring2} focus:ring-violet-400 transition-all`}
                  />
                </div>
                <div>
                  <label className={`text-[12px] font-semibold uppercase tracking-wider ${label}`}>{t.description} <span className={`normal-case font-normal ${dimText}`}>({t.optional})</span></label>
                  <input
                    type="text" placeholder={t.colorSizeBrand} value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                    className={`mt-1.5 w-full px-4 py-3 rounded-xl ${inputBg} text-[15px] ${primaryText} placeholder-slate-400 outline-none ring-1 ${ring2} focus:ring-violet-400 transition-all`}
                  />
                </div>
                <div>
                  <label className={`text-[12px] font-semibold uppercase tracking-wider ${label}`}>{t.photo} <span className={`normal-case font-normal ${dimText}`}>({t.optional})</span></label>
                  <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                  {newItemPhoto ? (
                    <div className="mt-1.5 relative rounded-2xl overflow-hidden h-36">
                      <img src={newItemPhoto} alt="Preview" className="w-full h-full object-cover" />
                      <button onClick={() => setNewItemPhoto(undefined)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                      </button>
                      <button onClick={() => photoRef.current?.click()} className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-black/50 text-white text-[12px] font-medium">{t.change}</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => photoRef.current?.click()}
                      className={`mt-1.5 w-full py-4 rounded-2xl ${inputBg} ring-1 ring-dashed ${ring2} flex flex-col items-center gap-1.5 ${dimText} active:opacity-70 transition-opacity`}
                    >
                      <svg width="24" height="22" viewBox="0 0 24 20" fill="none">
                        <rect x="1" y="3" width="22" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="12" cy="11" r="4" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 3L9.5 1H14.5L16 3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                      <span className="text-[13px] font-medium">{t.tapPhoto}</span>
                    </button>
                  )}
                </div>
                <button
                  onClick={handleAddItem}
                  disabled={!newItemName.trim()}
                  className="w-full py-3.5 rounded-2xl bg-violet-600 text-white text-[16px] font-semibold disabled:opacity-40 active:scale-[0.98] transition-all"
                >
                  {t.addItem}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Move Item */}
        {showMoveItem && selectedPlace && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-end z-50">
            <div className={`w-full ${modalBg} rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-[18px] font-bold ${primaryText}`}>{t.moveTo}</h3>
                <button onClick={() => setShowMoveItem(null)} className={`w-8 h-8 rounded-full ${closeBtn} flex items-center justify-center`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </button>
              </div>
              <p className={`text-[13px] ${mutedText} mb-4`}>
                {t.selectDest} <span className={`font-semibold ${secondaryText}`}>{selectedPlace.items.find((i) => i.id === showMoveItem)?.name}</span>
              </p>
              <div className="space-y-2">
                {places.filter((p) => p.id !== selectedPlaceId).length === 0 ? (
                  <div className="flex flex-col items-center py-6">
                    <span className="text-3xl mb-2">📍</span>
                    <p className={`text-[14px] ${mutedText}`}>{t.noOtherPlaces}</p>
                    <p className={`text-[12px] mt-1 ${dimText}`}>{t.addAnotherFirst}</p>
                  </div>
                ) : (
                  places.filter((p) => p.id !== selectedPlaceId).map((p) => {
                    const ci2 = parseInt(p.color) % PLACE_COLORS.length;
                    const c = PLACE_COLORS[ci2];
                    return (
                      <button key={p.id} onClick={() => handleMoveItem(p.id)} className={`w-full flex items-center gap-4 p-3.5 rounded-2xl ${inputBg} ring-1 ${ring} active:scale-[0.98] transition-transform`}>
                        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center text-xl flex-none`}>{p.icon}</div>
                        <div className="flex-1 text-left">
                          <p className={`text-[15px] font-semibold ${primaryText}`}>{p.name}</p>
                          <p className={`text-[12px] font-medium ${c.text}`}>{p.items.length} {t.items}</p>
                        </div>
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className={`${dimText} flex-none`}>
                          <path d={chevFwd} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Place Confirm */}
        {showDeletePlace && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-8">
            <div className={`${modalBg} rounded-3xl p-6 w-full shadow-2xl`}>
              <h3 className={`text-[17px] font-bold text-center mb-2 ${primaryText}`}>{t.deletePlaceTitle}</h3>
              <p className={`text-[14px] text-center mb-5 ${mutedText}`}>
                <span className={`font-semibold ${secondaryText}`}>{places.find((p) => p.id === showDeletePlace)?.name}</span> {t.deletePlaceBody}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeletePlace(null)} className={`flex-1 py-3 rounded-2xl ${mutedBg} ${secondaryText} text-[15px] font-semibold active:scale-95 transition-transform`}>{t.cancel}</button>
                <button onClick={() => handleDeletePlace(showDeletePlace)} className="flex-1 py-3 rounded-2xl bg-rose-500 text-white text-[15px] font-semibold active:scale-95 transition-transform">{t.delete}</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Item Confirm */}
        {showDeleteItem && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-8">
            <div className={`${modalBg} rounded-3xl p-6 w-full shadow-2xl`}>
              <h3 className={`text-[17px] font-bold text-center mb-2 ${primaryText}`}>{t.deleteItemTitle}</h3>
              <p className={`text-[14px] text-center mb-5 ${mutedText}`}>{t.deleteItemBody}</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteItem(null)} className={`flex-1 py-3 rounded-2xl ${mutedBg} ${secondaryText} text-[15px] font-semibold active:scale-95 transition-transform`}>{t.cancel}</button>
                <button onClick={() => handleDeleteItem(showDeleteItem)} className="flex-1 py-3 rounded-2xl bg-rose-500 text-white text-[15px] font-semibold active:scale-95 transition-transform">{t.remove}</button>
              </div>
            </div>
          </div>
        )}

        {/* Photo viewer */}
        {viewPhoto && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setViewPhoto(null)}>
            <img src={viewPhoto} alt="" className="max-w-full max-h-full object-contain rounded-xl" />
            <button className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white" onClick={() => setViewPhoto(null)}>
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        )}

        {/* Language Picker */}
        {showLangPicker && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-end z-50">
            <div className={`w-full ${modalBg} rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className={`text-[18px] font-bold ${primaryText}`}>{t.language}</h3>
                <button onClick={() => setShowLangPicker(false)} className={`w-8 h-8 rounded-full ${closeBtn} flex items-center justify-center`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div className={`${inputBg} rounded-2xl ring-1 ${ring} divide-y ${divider}`}>
                {([ ["en", "🇺🇸", "English"], ["fr", "🇫🇷", "Français"], ["ar", "🇸🇦", "العربية"] ] as [Lang, string, string][]).map(([code, flag, label2]) => (
                  <button
                    key={code}
                    onClick={() => { setLang(code); setShowLangPicker(false); }}
                    className="w-full flex items-center gap-4 px-4 py-4 active:opacity-60"
                  >
                    <span className="text-2xl">{flag}</span>
                    <span className={`flex-1 text-left text-[16px] font-medium ${primaryText}`}>{label2}</span>
                    {lang === code && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L20 7" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Privacy Modal */}
        {showPrivacy && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-end z-50">
            <div className={`w-full ${modalBg} rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className={`text-[18px] font-bold ${primaryText}`}>{t.privacyTitle}</h3>
                <button onClick={() => setShowPrivacy(false)} className={`w-8 h-8 rounded-full ${closeBtn} flex items-center justify-center`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div className={`w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl mx-auto mb-4`}>🔒</div>
              <p className={`text-[15px] leading-relaxed text-center ${mutedText}`}>{t.privacyText}</p>
            </div>
          </div>
        )}

        {/* About Modal */}
        {showAbout && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-end z-50">
            <div className={`w-full ${modalBg} rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className={`text-[18px] font-bold ${primaryText}`}>{t.about}</h3>
                <button onClick={() => setShowAbout(false)} className={`w-8 h-8 rounded-full ${closeBtn} flex items-center justify-center`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[22px] bg-violet-600 flex items-center justify-center text-4xl shadow-lg shadow-violet-400/30 mb-4">📍</div>
                <p className={`text-[20px] font-bold ${primaryText}`}>{t.aboutTitle}</p>
                <p className={`text-[13px] mt-1 ${mutedText}`}>{t.aboutVersion}</p>
                <p className={`text-[15px] mt-4 leading-relaxed ${mutedText}`}>{t.aboutDesc}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Modal */}
        {showContact && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-end z-50">
            <div className={`w-full ${modalBg} rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className={`text-[18px] font-bold ${primaryText}`}>{t.contactTitle}</h3>
                <button onClick={() => setShowContact(false)} className={`w-8 h-8 rounded-full ${closeBtn} flex items-center justify-center`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center text-3xl mb-4`}>✉️</div>
                <p className={`text-[15px] ${mutedText} mb-3`}>{t.contactText}</p>
                <div className={`px-5 py-3 rounded-2xl ${inputBg} ring-1 ${ring}`}>
                  <p className="text-[15px] font-semibold text-violet-600">{t.contactEmail}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
