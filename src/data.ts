import { QuickLink, FAQItem, PropertyListing, SocietyAmenity, SocietyBlockInfo, SocialLinkItem } from "./types";

/**
 * 🔒 SECURITY & OWNER CONFIGURATION
 * Strict Single-Owner Security Authorization:
 * Only authorized administrator: abidgoraya2098@gmail.com (GitHub: @abidgoraya2098-cyber)
 */
export const SECURITY_LOCK_ENABLED = true;
export const AUTHORIZED_ADMIN_EMAIL = "abidgoraya2098@gmail.com";
export const DEVELOPER_NAME = "عابد عباس علی گورائیہ";
export const DEVELOPER_ENGLISH_NAME = "Abid Abbas Ali Goraya";
export const DEVELOPER_GITHUB = "https://github.com/abidgoraya2098-cyber/Bin-Abbas-Properties";

export const CONTACT_PHONE = "923204800071";
export const CONTACT_PHONE_DISPLAY = "0320.4800071";
export const OWNER_NAME = "فریاد حسن گورائیہ";
export const OWNER_NAME_ENGLISH = "Faryad Hassan Goraya";
export const BUSINESS_NAME = "بن عباس پراپرٹیز";
export const ENGLISH_NAME = "BIN ABBAS PROPERTIES";
export const SUBTITLE = "BIN ABBAS PROPERTIES";
export const SUBTITLE_ENGLISH = "Real Estate & Builders";
export const LOCATION_TAGLINE = "رائل پام سٹی، گوجرانوالہ";
export const LOCATION_TAGLINE_ENGLISH = "Royal Palm City, Gujranwala";
export const ADDRESS = "بن عباس پراپرٹیز، پام کمرشل 235، مین مارکیٹ، رائل پام سٹی، گوجرانوالہ";
export const ADDRESS_ENGLISH = "Bin Abbas Properties, Palm Commercial 235, Main Market, Royal Palm City, Gujranwala";
export const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Palm+Commercial+Royal+Palm+City+Gujranwala+Bin+Abbas+Properties";
export const GOOGLE_MAPS_NAV_URL = "https://www.google.com/maps/dir/?api=1&destination=Palm+Commercial+Royal+Palm+City+Gujranwala";

export const QUICK_LINKS: readonly QuickLink[] = Object.freeze([
  {
    id: "sell",
    title: "پلاٹ فروخت کریں",
    titleEn: "Sell Your Plot",
    subtitle: "اپنے پلاٹ کی تفصیلات درج کریں اور بہترین مارکیٹ ریٹ حاصل کریں",
    subtitleEn: "Submit your plot details and get the best market rates",
    iconName: "Rupee",
    url: `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("السلام علیکم! فریاد حسن گورائیہ صاحب، میں اپنا پلاٹ فروخت کرنا چاہتا ہوں۔ براہ کرم تفصیلات حاصل کریں۔")}`,
    urlEn: `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("Hello Mr. Faryad Hassan Goraya, I want to sell my plot in Royal Palm City Gujranwala. Please guide me with current market rates.")}`,
    colorClass: "bg-slate-900/90 hover:bg-slate-800/90 border border-amber-400/30 hover:border-amber-400/60 shadow-md",
    textColorClass: "text-slate-100"
  },
  {
    id: "buy",
    title: "پلاٹ خرید کریں",
    titleEn: "Buy A Plot",
    subtitle: "5، 10 مرلہ، 1 و 2 کنال رہائشی اور 2، 4، 8 مرلہ کمرشل پلاٹس",
    subtitleEn: "5, 10 Marla, 1 & 2 Kanal Residential & 2, 4, 8 Marla Commercial plots",
    iconName: "Home",
    url: `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("السلام علیکم! فریاد حسن گورائیہ صاحب، مجھے رائل پام سٹی میں پلاٹ خریدنا ہے، دستیاب آپشنز اور ریٹ لسٹ بتائیں۔")}`,
    urlEn: `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("Hello Mr. Faryad Hassan Goraya, I am interested in buying a plot in Royal Palm City Gujranwala. Please share available options and price list.")}`,
    colorClass: "bg-slate-900/90 hover:bg-slate-800/90 border border-amber-400/30 hover:border-amber-400/60 shadow-md",
    textColorClass: "text-slate-100"
  },
  {
    id: "rent",
    title: "کرایہ پر مکان / کمرشل",
    titleEn: "House / Commercial for Rent",
    subtitle: "رائل پام سٹی میں فیملی کے لیے لگژری گھر اور کمرشل دکانیں",
    subtitleEn: "Luxury family houses and prime commercial shops in Royal Palm City",
    iconName: "Key",
    url: `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("السلام علیکم! فریاد حسن گورائیہ صاحب، مجھے رائل پام سٹی میں کرایہ کے لیے پراپرٹی درکار ہے۔")}`,
    urlEn: `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("Hello Mr. Faryad Hassan Goraya, I am looking for a rental house or commercial property in Royal Palm City Gujranwala.")}`,
    colorClass: "bg-slate-900/90 hover:bg-slate-800/90 border border-amber-400/30 hover:border-amber-400/60 shadow-md",
    textColorClass: "text-slate-100"
  },
  {
    id: "call",
    title: `براہِ راست فون کال (${CONTACT_PHONE_DISPLAY})`,
    titleEn: `Direct Phone Call (${CONTACT_PHONE_DISPLAY})`,
    subtitle: "بغیر انٹرنیٹ کے فوری سم کال کے لیے کلک کریں (آف لائن دستیاب)",
    subtitleEn: "Tap for direct offline cellular phone call",
    iconName: "Phone",
    url: `tel:+${CONTACT_PHONE}`,
    colorClass: "bg-slate-900/90 hover:bg-slate-800/90 border border-amber-400/30 hover:border-amber-400/60 shadow-md",
    textColorClass: "text-slate-100"
  },
  {
    id: "whatsapp",
    title: "براہِ راست واٹس ایپ رابطہ",
    titleEn: "Direct WhatsApp Contact",
    subtitle: "فوری چیٹ و ریٹس (انٹرنیٹ یا واٹس ایپ سوشل پیکج درکار ہے)",
    subtitleEn: "Instant chat, rates & real estate consultations",
    iconName: "WhatsApp",
    url: `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("السلام علیکم! فریاد حسن گورائیہ صاحب، مجھے بن عباس پراپرٹیز سے متعلق معلومات درکار ہیں۔")}`,
    urlEn: `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("Hello Mr. Faryad Hassan Goraya, I need information regarding Bin Abbas Properties in Royal Palm City.")}`,
    colorClass: "bg-gradient-to-r from-[#1b6b47] via-[#0f5334] to-[#1b6b47] hover:brightness-110 border-2 border-amber-400/70 shadow-xl",
    textColorClass: "text-white"
  }
]);

export const SOCIAL_LINKS: readonly SocialLinkItem[] = Object.freeze([
  {
    id: "facebook",
    name: "فیس بک",
    nameEn: "Facebook",
    url: "https://www.facebook.com/share/1GGf6i4dMu/",
    appUrl: "fb://facewebmodal/f?href=https://www.facebook.com/share/1GGf6i4dMu/",
    intentUrl: "intent://facebook.com/share/1GGf6i4dMu/#Intent;package=com.facebook.katana;scheme=https;end",
    iconName: "Facebook",
    colorClass: "bg-slate-900 text-[#1877F2] hover:bg-blue-950/40 border border-blue-500/40 shadow-sm"
  },
  {
    id: "instagram",
    name: "انسٹاگرام",
    nameEn: "Instagram",
    url: "https://www.instagram.com/f.hgorayagroup/",
    appUrl: "instagram://user?username=f.hgorayagroup",
    intentUrl: "intent://instagram.com/_u/f.hgorayagroup#Intent;package=com.instagram.android;scheme=https;end",
    iconName: "Instagram",
    colorClass: "bg-slate-900 text-[#E4405F] hover:bg-pink-950/40 border border-pink-500/40 shadow-sm"
  },
  {
    id: "youtube",
    name: "یوٹیوب",
    nameEn: "YouTube",
    url: "https://youtube.com/@f.hgorayagroup?si=LEgsRd7EqSj4w7lU",
    appUrl: "vnd.youtube://youtube.com/@f.hgorayagroup",
    intentUrl: "intent://www.youtube.com/@f.hgorayagroup#Intent;package=com.google.android.youtube;scheme=https;end",
    iconName: "Youtube",
    colorClass: "bg-slate-900 text-[#CD201F] hover:bg-red-950/40 border border-red-500/40 shadow-sm"
  },
  {
    id: "tiktok",
    name: "ٹک ٹاک",
    nameEn: "TikTok",
    url: "https://www.tiktok.com/@binabbasproperties",
    appUrl: "snssdk1233://user/profile/@binabbasproperties",
    intentUrl: "intent://www.tiktok.com/@binabbasproperties#Intent;package=com.zhiliaoapp.musically;scheme=https;end",
    iconName: "Video",
    colorClass: "bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 shadow-sm"
  },
  {
    id: "twitter",
    name: "ٹویٹر",
    nameEn: "X (Twitter)",
    url: "https://x.com/AbidAbbasGoraya",
    appUrl: "twitter://user?screen_name=AbidAbbasGoraya",
    intentUrl: "intent://x.com/AbidAbbasGoraya#Intent;package=com.twitter.android;scheme=https;end",
    iconName: "Twitter",
    colorClass: "bg-slate-900 text-amber-300 hover:bg-slate-800 border border-amber-400/40 shadow-sm"
  }
]);

export const ROYAL_PALM_BLOCKS: readonly SocietyBlockInfo[] = Object.freeze([
  { 
    id: "A", 
    name: "بلاک A", 
    nameEn: "Block A",
    desc: "مین انٹرنس و مرکزی جامع مسجد کے قریب",
    descEn: "Near Main Entrance & Central Grand Mosque"
  },
  { 
    id: "B", 
    name: "بلاک B", 
    nameEn: "Block B",
    desc: "خوبصورت فیملی پارک اور پُرسکون رہائش",
    descEn: "Scenic Family Park & Peaceful Residence"
  },
  { 
    id: "C", 
    name: "بلاک C", 
    nameEn: "Block C",
    desc: "تیزی سے آباد ہوتا پرائم علاقہ",
    descEn: "Rapidly Developing Prime Location"
  },
  { 
    id: "D", 
    name: "بلاک D", 
    nameEn: "Block D",
    desc: "رہائش و محفوظ ترین سرمایہ کاری",
    descEn: "Ideal Living & Secure Investment"
  },
  { 
    id: "E", 
    name: "بلاک E", 
    nameEn: "Block E",
    desc: "بہترین مارکیٹ ریٹ اور ترقی یافتہ",
    descEn: "High Market Value & Fully Developed"
  },
  { 
    id: "F", 
    name: "بلاک F", 
    nameEn: "Block F",
    desc: "پرکشش رہائشی سیکٹر بلاک",
    descEn: "Attractive Residential Sector"
  },
  { 
    id: "Exec", 
    name: "ایگزیکٹو بلاک (Executive)", 
    nameEn: "Executive Block",
    desc: "VIP کیٹگری، وسیع 80 فٹ روڈز اور کلب",
    descEn: "VIP Category, 80ft Wide Roads & Club House"
  },
  { 
    id: "Royal", 
    name: "رائل بلاک (Royal)", 
    nameEn: "Royal Block",
    desc: "پریمیم لگژری رہائشی بلاک",
    descEn: "Premium Luxury Living Zone"
  },
  { 
    id: "Palm", 
    name: "پام بلاک (Palm)", 
    nameEn: "Palm Block",
    desc: "مرکزی کمرشل اور پام مال کے نزدیک",
    descEn: "Near Palm Mall & Central Commercial Area"
  },
  { 
    id: "Comm", 
    name: "پام کمرشل (Commercial)", 
    nameEn: "Palm Commercial",
    desc: "مرکزی بزنس ہب، 2، 4 و 8 مرلہ پلاٹس",
    descEn: "Main Business Hub, 2, 4 & 8 Marla Commercial Plots"
  }
]);

export const RESIDENTIAL_PLOT_SIZES_URDU: readonly string[] = Object.freeze([
  "5 مرلہ (رہائشی)",
  "10 مرلہ (رہائشی)",
  "1 کنال (رہائشی)",
  "2 کنال (رہائشی)"
]);

export const RESIDENTIAL_PLOT_SIZES_ENGLISH: readonly string[] = Object.freeze([
  "5 Marla (Residential)",
  "10 Marla (Residential)",
  "1 Kanal (Residential)",
  "2 Kanal (Residential)"
]);

export const COMMERCIAL_PLOT_SIZES_URDU: readonly string[] = Object.freeze([
  "2 مرلہ (کمرشل)",
  "4 مرلہ (کمرشل)",
  "8 مرلہ (کمرشل)"
]);

export const COMMERCIAL_PLOT_SIZES_ENGLISH: readonly string[] = Object.freeze([
  "2 Marla (Commercial)",
  "4 Marla (Commercial)",
  "8 Marla (Commercial)"
]);

export const RESIDENTIAL_PLOT_SIZES = RESIDENTIAL_PLOT_SIZES_URDU;
export const COMMERCIAL_PLOT_SIZES = COMMERCIAL_PLOT_SIZES_URDU;
export const PLOT_SIZES = Object.freeze([...RESIDENTIAL_PLOT_SIZES_URDU, ...COMMERCIAL_PLOT_SIZES_URDU]);

export const PLOT_FEATURES_URDU: readonly string[] = Object.freeze([
  "جنرل پلاٹ",
  "کارنر پلاٹ (Corner)",
  "پارک فیسنگ (Facing Park)",
  "مین بلیوارڈ (Main Boulevard)",
  "60 فٹ چوڑی سڑک",
  "مسجد و مارکیٹ کے قریب",
  "اوپن انویسٹمنٹ"
]);

export const PLOT_FEATURES_ENGLISH: readonly string[] = Object.freeze([
  "General Plot",
  "Corner Plot",
  "Facing Park",
  "Main Boulevard",
  "60ft Wide Road",
  "Near Mosque & Market",
  "Open Investment"
]);

export const PLOT_FEATURES = PLOT_FEATURES_URDU;

export const FEATURED_PROPERTIES: readonly PropertyListing[] = Object.freeze([]);

export const SOCIETY_AMENITIES: readonly SocietyAmenity[] = Object.freeze([
  {
    id: "security",
    title: "24/7 سیکیورٹی و کیمرے",
    titleEn: "24/7 Gated Security & CCTV",
    description: "گیٹڈ کمیونٹی مع جدید مانیٹرنگ سسٹم اور تربیت یافتہ سیکیورٹی گارڈز۔",
    descriptionEn: "Gated community with state-of-the-art surveillance and trained security staff.",
    icon: "ShieldCheck"
  },
  {
    id: "power",
    title: "انڈر گراؤنڈ بجلی و گیس",
    titleEn: "Underground Power & Utilities",
    description: "بغیر کسی لٹکتی تاروں کے زیرِ زمین بجلی کا جدید نظام اور بلاتعطل فراہمی۔",
    descriptionEn: "Modern underground electrification with uninterrupted power and utility supply.",
    icon: "Zap"
  },
  {
    id: "fuel",
    title: "24 گھنٹے پٹرول پمپ و سروس",
    titleEn: "24/7 Fuel Station & Car Care",
    description: "سوسائٹی کی حدود میں بین الاقوامی معیار کا پٹرول پمپ اور جدید سروس اسٹیشن۔",
    descriptionEn: "International standard fuel station and comprehensive automobile service within society.",
    icon: "Fuel"
  },
  {
    id: "banks",
    title: "بینکوں کی برانچز و 24/7 ATM",
    titleEn: "Commercial Banks & 24/7 ATMs",
    description: "معروف کمرشل بینکوں کی فعال برانچز اور ہر وقت دستیاب اے ٹی ایم سروسز۔",
    descriptionEn: "Branches of leading commercial banks and 24-hour ATM machines.",
    icon: "Landmark"
  },
  {
    id: "masjid",
    title: "جامع مساجد و مراکز",
    titleEn: "Grand Mosques & Centers",
    description: "ہر بلاک میں خوبصورت مساجد اور وسیع اسلامی مراکز۔",
    descriptionEn: "Beautiful architecture grand mosques and spacious community Islamic centers in every block.",
    icon: "Building"
  },
  {
    id: "mall",
    title: "پام مال و کمرشل ایریا",
    titleEn: "Palm Mall & Commercial Zone",
    description: "شاپنگ مالز، بڑے قومی برانڈز، ریسٹورنٹس اور فوڈ اسٹریٹ۔",
    descriptionEn: "Multi-storey shopping malls, leading national brands, and vibrant food streets.",
    icon: "ShoppingBag"
  },
  {
    id: "parks",
    title: "تھیم پارکس اور گرین بیلٹس",
    titleEn: "Theme Parks & Botanical Green Belts",
    description: "خوبصورت فیملی پارکس، جوگنگ ٹریکس، وسیع گرین بیلٹس اور بچوں کے پلے ایریاز۔",
    descriptionEn: "Lush green botanical family parks, jogging tracks, landscaped green belts, and children's amusement zones.",
    icon: "Trees"
  }
]);

export const FAQS: readonly FAQItem[] = Object.freeze([
  {
    id: "faq-1",
    question: "رائل پام سٹی گوجرانوالہ میں کون سے سائز کے پلاٹس دستیاب ہیں؟",
    questionEn: "What plot sizes are available in Royal Palm City Gujranwala?",
    answer: "رائل پام سٹی میں 5 مرلہ، 10 مرلہ، 1 کنال اور 2 کنال کے رہائشی پلاٹس جبکہ 2 مرلہ، 4 مرلہ اور 8 مرلہ کے پرائم کمرشل پلاٹس نقد ادائیگی اور فوری پوزیشن پر دستیاب ہیں۔",
    answerEn: "Royal Palm City offers 5 Marla, 10 Marla, 1 Kanal, and 2 Kanal residential plots, as well as 2 Marla, 4 Marla, and 8 Marla prime commercial plots on cash payment and instant possession."
  },
  {
    id: "faq-2",
    question: "کیا سوسائٹی میں پٹرول پمپ اور بینک کی سہولیات موجود ہیں؟",
    questionEn: "Does the society have an operational fuel station and banking facilities?",
    answer: "جی ہاں! رائل پام سٹی میں 24 گھنٹے فعال پٹرول پمپ اور معروف کمرشل بینکوں کی برانچز مع 24/7 اے ٹی ایم کی جدید سہولیات موجود ہیں۔",
    answerEn: "Yes! Royal Palm City features a 24/7 fully functional international-standard fuel station and branches of major commercial banks with round-the-clock ATM services."
  },
  {
    id: "faq-3",
    question: "بن عباس پراپرٹیز کے پاس کون کون سی سروسز ہیں؟",
    questionEn: "What real estate services does Bin Abbas Properties offer?",
    answer: "ہم پلاٹس کی فوری خرید و فروخت، فائل ٹرانسفر، محفوظ سرمایہ کاری، مکانات کی تعمیر اور رائل پام سٹی میں روزانہ کے تازہ ترین ریٹس کی رہنمائی فراہم کرتے ہیں۔",
    answerEn: "We provide plot buying and selling, verified file transfers, secure investment advisory, residential home construction, and daily updated market price analysis."
  },
  {
    id: "faq-4",
    question: "کیا بن عباس پراپرٹیز کا دفتر رائل پام سٹی میں واقع ہے؟",
    questionEn: "Is Bin Abbas Properties office located inside Royal Palm City?",
    answer: "جی ہاں! ہمارا دفتر پام کمرشل 235، رائل پام سٹی، گوجرانوالہ میں واقع ہے۔ آپ تشریف لائیں، ہم آپ کو خوش آمدید کہیں گے۔",
    answerEn: "Yes! Our office is located at Palm Commercial 235, Royal Palm City, Gujranwala. You are always welcome to visit us."
  },
  {
    id: "faq-5",
    question: "پلاٹ فروخت کرنے یا خریدنے کے لیے کوائف کیسے درج کریں؟",
    questionEn: "How can I submit plot details for buying or selling?",
    answer: "آپ ہماری ایپ میں 'خرید و فروخت' ٹیب پر جا کر پلاٹ کا سائز، بلاک، پلاٹ نمبر، ڈیمانڈ یا فائنل قیمت درج کر کے 1 کلک پر براہِ راست واٹس ایپ پر ارسال کر سکتے ہیں۔ تمام فیلڈز مکمل طور پر اختیاری (Optional) ہیں۔",
    answerEn: "You can navigate to the 'Buy / Sell' tab in our app, select the block, size, and enter price details to send directly to WhatsApp in 1 click. All fields are completely optional."
  }
]);
