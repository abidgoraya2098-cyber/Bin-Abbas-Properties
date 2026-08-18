import { QuickLink, FAQItem, PropertyListing, SocietyAmenity, SocietyBlockInfo, SocialLinkItem } from "./types";

export const CONTACT_PHONE = "923204800071";
export const CONTACT_PHONE_DISPLAY = "0320.4800071";
export const OWNER_NAME = "عابد عباس علی گورائیہ";
export const BUSINESS_NAME = "بن عباس پراپرٹیز";
export const ENGLISH_NAME = "BIN ABBAS PROPERTIES";
export const SUBTITLE = "BIN ABBAS PROPERTIES";
export const LOCATION_TAGLINE = "رائل پام سٹی، گوجرانوالہ";
export const ADDRESS = "بن عباس پراپرٹیز، رائل پام سٹی، گوجرانوالہ (پام کمرشل 235)";
export const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Bin+Abbas+Properties,+Royal+Palm+City,+Gujranwala";
export const GOOGLE_MAPS_NAV_URL = "https://www.google.com/maps/dir/?api=1&destination=Bin+Abbas+Properties,+Royal+Palm+City,+Gujranwala";

export const QUICK_LINKS: QuickLink[] = [
  {
    id: "sell",
    title: "پلاٹ فروخت کریں",
    subtitle: "اپنے پلاٹ کی تفصیلات درج کریں اور بہترین مارکیٹ ریٹ حاصل کریں",
    iconName: "Rupee",
    url: `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("السلام علیکم! عابد عباس صاحب، میں اپنا پلاٹ فروخت کرنا چاہتا ہوں۔ براہ کرم تفصیلات حاصل کریں۔")}`,
    colorClass: "bg-slate-900/90 hover:bg-slate-800/90 border border-amber-400/30 hover:border-amber-400/60 shadow-md",
    textColorClass: "text-slate-100"
  },
  {
    id: "buy",
    title: "پلاٹ خرید کریں",
    subtitle: "5، 10 مرلہ، 1 و 2 کنال رہائشی اور 2، 4، 8 مرلہ کمرشل پلاٹس",
    iconName: "Home",
    url: `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("السلام علیکم! عابد عباس صاحب، مجھے رائل پام سٹی میں پلاٹ خریدنا ہے، دستیاب آپشنز اور ریٹ لسٹ بتائیں۔")}`,
    colorClass: "bg-slate-900/90 hover:bg-slate-800/90 border border-amber-400/30 hover:border-amber-400/60 shadow-md",
    textColorClass: "text-slate-100"
  },
  {
    id: "rent",
    title: "کرایہ پر مکان / کمرشل",
    subtitle: "رائل پام سٹی میں فیملی کے لیے لگژری گھر اور کمرشل دکانیں",
    iconName: "Key",
    url: `https://wa.me/923204800071?text=${encodeURIComponent("السلام علیکم! مجھے رائل پام سٹی میں کرایہ کے لیے پراپرٹی درکار ہے۔")}`,
    colorClass: "bg-slate-900/90 hover:bg-slate-800/90 border border-amber-400/30 hover:border-amber-400/60 shadow-md",
    textColorClass: "text-slate-100"
  },
  {
    id: "whatsapp",
    title: "براہِ راست واٹس ایپ رابطہ",
    subtitle: "تازہ ترین ریٹس اور تفصیلی مشاورت کے لیے کلک کریں",
    iconName: "WhatsApp",
    url: `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("السلام علیکم! عابد عباس علی گورائیہ صاحب، مجھے بن عباس پراپرٹیز سے متعلق معلومات درکار ہیں۔")}`,
    colorClass: "bg-gradient-to-r from-[#1b6b47] via-[#0f5334] to-[#1b6b47] hover:brightness-110 border-2 border-amber-400/70 shadow-xl",
    textColorClass: "text-white"
  }
];

export const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: "facebook",
    name: "فیس بک",
    url: "https://www.facebook.com/share/1GGf6i4dMu/",
    appUrl: "fb://facewebmodal/f?href=https://www.facebook.com/share/1GGf6i4dMu/",
    intentUrl: "intent://facebook.com/share/1GGf6i4dMu/#Intent;package=com.facebook.katana;scheme=https;end",
    iconName: "Facebook",
    colorClass: "bg-slate-900 text-[#1877F2] hover:bg-blue-950/40 border border-blue-500/40 shadow-sm"
  },
  {
    id: "instagram",
    name: "انسٹاگرام",
    url: "https://www.instagram.com/f.hgorayagroup/",
    appUrl: "instagram://user?username=f.hgorayagroup",
    intentUrl: "intent://instagram.com/_u/f.hgorayagroup#Intent;package=com.instagram.android;scheme=https;end",
    iconName: "Instagram",
    colorClass: "bg-slate-900 text-[#E4405F] hover:bg-pink-950/40 border border-pink-500/40 shadow-sm"
  },
  {
    id: "youtube",
    name: "یوٹیوب",
    url: "https://youtube.com/@f.hgorayagroup?si=LEgsRd7EqSj4w7lU",
    appUrl: "vnd.youtube://youtube.com/@f.hgorayagroup",
    intentUrl: "intent://www.youtube.com/@f.hgorayagroup#Intent;package=com.google.android.youtube;scheme=https;end",
    iconName: "Youtube",
    colorClass: "bg-slate-900 text-[#CD201F] hover:bg-red-950/40 border border-red-500/40 shadow-sm"
  },
  {
    id: "tiktok",
    name: "ٹک ٹاک",
    url: "https://www.tiktok.com/@binabbasproperties",
    appUrl: "snssdk1233://user/profile/@binabbasproperties",
    intentUrl: "intent://www.tiktok.com/@binabbasproperties#Intent;package=com.zhiliaoapp.musically;scheme=https;end",
    iconName: "Video",
    colorClass: "bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 shadow-sm"
  },
  {
    id: "twitter",
    name: "ٹویٹر",
    url: "https://x.com/AbidAbbasGoraya",
    appUrl: "twitter://user?screen_name=AbidAbbasGoraya",
    intentUrl: "intent://x.com/AbidAbbasGoraya#Intent;package=com.twitter.android;scheme=https;end",
    iconName: "Twitter",
    colorClass: "bg-slate-900 text-amber-300 hover:bg-slate-800 border border-amber-400/40 shadow-sm"
  }
];

export const ROYAL_PALM_BLOCKS: SocietyBlockInfo[] = [
  { id: "A", name: "بلاک A", desc: "مین انٹرنس و مرکزی جامع مسجد کے قریب" },
  { id: "B", name: "بلاک B", desc: "خوبصورت فیملی پارک اور پُرسکون رہائش" },
  { id: "C", name: "بلاک C", desc: "تیزی سے آباد ہوتا پرائم علاقہ" },
  { id: "D", name: "بلاک D", desc: "رہائش و محفوظ ترین سرمایہ کاری" },
  { id: "E", name: "بلاک E", desc: "بہترین مارکیٹ ریٹ اور ترقی یافتہ" },
  { id: "F", name: "بلاک F", desc: "پرکشش رہائشی سیکٹر بلاک" },
  { id: "Exec", name: "ایگزیکٹو بلاک (Executive)", desc: "VIP کیٹگری، وسیع 80 فٹ روڈز اور کلب" },
  { id: "Royal", name: "رائل بلاک (Royal)", desc: "پریمیم لگژری رہائشی بلاک" },
  { id: "Palm", name: "پام بلاک (Palm)", desc: "مرکزی کمرشل اور پام مال کے نزدیک" },
  { id: "Comm", name: "پام کمرشل (Commercial)", desc: "مرکزی بزنس ہب، 2، 4 و 8 مرلہ پلاٹس" }
];

export const RESIDENTIAL_PLOT_SIZES = [
  "5 مرلہ (رہائشی)",
  "10 مرلہ (رہائشی)",
  "1 کنال (رہائشی)",
  "2 کنال (رہائشی)"
];

export const COMMERCIAL_PLOT_SIZES = [
  "2 مرلہ (کمرشل)",
  "4 مرلہ (کمرشل)",
  "8 مرلہ (کمرشل)"
];

export const PLOT_SIZES = [
  ...RESIDENTIAL_PLOT_SIZES,
  ...COMMERCIAL_PLOT_SIZES
];

export const PLOT_FEATURES = [
  "جنرل پلاٹ",
  "کارنر پلاٹ (Corner)",
  "پارک فیسنگ (Facing Park)",
  "مین بلیوارڈ (Main Boulevard)",
  "60 فٹ چوڑی سڑک",
  "مسجد و مارکیٹ کے قریب",
  "اوپن انویسٹمنٹ"
];

export const FEATURED_PROPERTIES: PropertyListing[] = [
  {
    id: "prop-1",
    title: "5 مرلہ پرائم رہائشی پلاٹ",
    category: "residential",
    tag: "ہاٹ ڈیل 🔥",
    size: "5 مرلہ",
    block: "بلاک B - رائل پام سٹی",
    priceNote: "تازہ ترین ریٹ کے لیے رابطہ کریں",
    features: ["پارک فیسنگ", "فوری پوزیشن", "گیس و بجلی دستیاب"],
    isHot: true
  },
  {
    id: "prop-2",
    title: "10 مرلہ لگژری پلاٹ",
    category: "residential",
    tag: "VIP لوکیشن 🌟",
    size: "10 مرلہ",
    block: "ایگزیکٹو بلاک",
    priceNote: "مارکیٹ ڈیمانڈ ریٹ پر دستیاب",
    features: ["60 فٹ روڈ", "مین انٹرنس کے قریب", "خوبصورت لوکیشن"],
    isHot: true
  },
  {
    id: "prop-3",
    title: "2 مرلہ تیز رفتار کمرشل پلاٹ",
    category: "commercial",
    tag: "کمرشل ہب 💼",
    size: "2 مرلہ کمرشل",
    block: "پام کمرشل",
    priceNote: "بہترین سرمایہ کاری ریٹ",
    features: ["مین مارکیٹ", "فوری تعمیر کی اجازت", "ہائی رینٹل ریٹرن"],
    isHot: true
  },
  {
    id: "prop-4",
    title: "4 مرلہ مین کمرشل پلاٹ",
    category: "commercial",
    tag: "بزنس انویسٹمنٹ 💎",
    size: "4 مرلہ کمرشل",
    block: "پام کمرشل",
    priceNote: "پرائم لوکیشن ڈیل",
    features: ["مین بلیوارڈ", "بڑے برانڈز و بینکوں کے قریب", "بھاری کرایہ پوٹینشل"],
    isHot: false
  },
  {
    id: "prop-5",
    title: "8 مرلہ ہیوی کمرشل پلاٹ",
    category: "commercial",
    tag: "میگا پراجیکٹ 🏬",
    size: "8 مرلہ کمرشل",
    block: "مین بلیوارڈ کمرشل",
    priceNote: "کارپوریٹ و پلازہ کے لیے موزوں",
    features: ["100 فٹ مین بلیوارڈ", "بڑے پلازہ کے لیے آئیڈیل", "کارنر پوزیشن"],
    isHot: false
  },
  {
    id: "prop-6",
    title: "1 کنال خوبصورت کارنر پلاٹ",
    category: "residential",
    tag: "کارنر کیٹگری 💎",
    size: "1 کنال",
    block: "رائل بلاک",
    priceNote: "موقع کے ریٹ پر دستیاب",
    features: ["کارنر پلاٹ", "100 فٹ روڈ", "انتہائی پرائم لوکیشن"],
    isHot: false
  },
  {
    id: "prop-7",
    title: "2 کنال پروقار ایگزیکٹو ولا پلاٹ",
    category: "residential",
    tag: "شاہانہ رہائش 👑",
    size: "2 کنال",
    block: "ایگزیکٹو بلاک",
    priceNote: "خصوصی ڈیل",
    features: ["وسیع گرین بیلٹ", "پُرسکون ماحول", "لگژری مینشن کے لیے آئیڈیل"],
    isHot: true
  },
  {
    id: "prop-8",
    title: "10 مرلہ نیا مکان برائے کرایہ",
    category: "rent",
    tag: "برائے کرایہ 🔑",
    size: "10 مرلہ گھر",
    block: "بلاک A",
    priceNote: "ماہانہ کرایہ رابطہ پر",
    features: ["4 بیڈ رومز", "امپورٹڈ کچن", "فیملی کے لیے موزوں"],
    isHot: false
  }
];

export const SOCIETY_AMENITIES: SocietyAmenity[] = [
  {
    id: "security",
    title: "24/7 سیکیورٹی و کیمرے",
    description: "گیٹڈ کمیونٹی مع جدید مانیٹرنگ سسٹم اور تربیت یافتہ سیکیورٹی گارڈز۔",
    icon: "ShieldCheck"
  },
  {
    id: "power",
    title: "انڈر گراؤنڈ بجلی و گیس",
    description: "بغیر کسی لٹکتی تاروں کے زیرِ زمین بجلی کا جدید نظام اور بلاتعطل فراہمی۔",
    icon: "Zap"
  },
  {
    id: "fuel",
    title: "24 گھنٹے پٹرول پمپ و سروس",
    description: "سوسائٹی کی حدود میں بین الاقوامی معیار کا پٹرول پمپ اور جدید سروس اسٹیشن۔",
    icon: "Fuel"
  },
  {
    id: "banks",
    title: "بینکوں کی برانچز و 24/7 ATM",
    description: "معروف کمرشل بینکوں کی فعال برانچز اور ہر وقت دستیاب اے ٹی ایم سروسز۔",
    icon: "Landmark"
  },
  {
    id: "masjid",
    title: "جامع مساجد و مراکز",
    description: "ہر بلاک میں خوبصورت مساجد اور وسیع اسلامی مراکز۔",
    icon: "Building"
  },
  {
    id: "mall",
    title: "پام مال و کمرشل ایریا",
    description: "شاپنگ مالز، بڑے قومی برانڈز، ریسٹورنٹس اور فوڈ اسٹریٹ۔",
    icon: "ShoppingBag"
  },
  {
    id: "parks",
    title: "تھیم پارکس اور فیملی جھیل",
    description: "خوبصورت فیملی پارکس، جوگنگ ٹریکس، جھیل اور بچوں کے پلے ایریاز۔",
    icon: "Trees"
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "رائل پام سٹی گوجرانوالہ میں کون سے سائز کے پلاٹس دستیاب ہیں؟",
    answer: "رائل پام سٹی میں 5 مرلہ، 10 مرلہ، 1 کنال اور 2 کنال کے رہائشی پلاٹس جبکہ 2 مرلہ، 4 مرلہ اور 8 مرلہ کے پرائم کمرشل پلاٹس نقد ادائیگی اور فوری پوزیشن پر دستیاب ہیں۔"
  },
  {
    id: "faq-2",
    question: "کیا سوسائٹی میں پٹرول پمپ اور بینک کی سہولیات موجود ہیں؟",
    answer: "جی ہاں! رائل پام سٹی میں 24 گھنٹے فعال پٹرول پمپ اور معروف کمرشل بینکوں کی برانچز مع 24/7 اے ٹی ایم کی جدید سہولیات موجود ہیں۔"
  },
  {
    id: "faq-3",
    question: "بن عباس پراپرٹیز کے پاس کون کون سی سروسز ہیں؟",
    answer: "ہم پلاٹس کی فوری خرید و فروخت، فائل ٹرانسفر، محفوظ سرمایہ کاری، مکانات کی تعمیر اور رائل پام سٹی میں روزانہ کے تازہ ترین ریٹس کی رہنمائی فراہم کرتے ہیں۔"
  },
  {
    id: "faq-4",
    question: "کیا بن عباس پراپرٹیز کا دفتر رائل پام سٹی میں واقع ہے؟",
    answer: "جی ہاں! ہمارا دفتر پام کمرشل 235، رائل پام سٹی، گوجرانوالہ میں واقع ہے۔ آپ تشریف لائیں، ہم آپ کو خوش آمدید کہیں گے۔"
  },
  {
    id: "faq-5",
    question: "پلاٹ فروخت کرنے یا خریدنے کے لیے کوائف کیسے درج کریں؟",
    answer: "آپ ہماری ایپ میں 'پلاٹ خریدیں / بیچیں' ٹیب پر جا کر پلاٹ کا سائز، بلاک، پلاٹ نمبر، ڈیمانڈ یا فائنل قیمت درج کر کے 1 کلک پر براہِ راست واٹس ایپ پر ارسال کر سکتے ہیں۔ تمام فیلڈز مکمل طور پر اختیاری (Optional) ہیں۔"
  }
];
