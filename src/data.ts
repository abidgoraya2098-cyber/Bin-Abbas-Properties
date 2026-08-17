import { SocietyCatalogItem } from './types';

export const BUSINESS_NAME = "بن عباس پراپرٹیز";
export const ENGLISH_NAME = "BIN ABBAS PROPERTIES";
export const SUBTITLE = "ریل اسٹیٹ ایڈوائزرز و کنسلٹنٹس";
export const LOCATION_TAGLINE = "رائل پام سٹی، گوجرانوالہ";
export const ADDRESS = "بن عباس پراپرٹیز، رائل پام سٹی، گوجرانوالہ (پام کمرشل 235)";
export const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Bin+Abbas+Properties,+Royal+Palm+City,+Gujranwala";
export const GOOGLE_MAPS_NAV_URL = "https://www.google.com/maps/dir/?api=1&destination=Bin+Abbas+Properties,+Royal+Palm+City,+Gujranwala";

export const CONTACT_PHONE = "0300-8647000";
export const CONTACT_PHONE_RAW = "+923008647000";
export const CONTACT_WHATSAPP = "923008647000";
export const CONTACT_EMAIL = "binabbasproperties@gmail.com";
export const OFFICE_HOURS = "صبح 10:00 تا رات 10:00 (ہفتہ وار چھٹی: جمعہ)";

// Storage Keys
export const STORAGE_KEYS = {
  PROPERTIES: "bin_abbas_properties_v2",
  INQUIRIES: "bin_abbas_inquiries_v2",
  DEALS: "bin_abbas_deals_v2",
  BACKUP_HISTORY: "bin_abbas_backup_history_v2"
};

// Initial state is strictly empty - NO dummy/temporary plots
export const INITIAL_PROPERTIES = [];
export const INITIAL_INQUIRIES = [];

export const PROPERTY_TYPES = [
  { value: "residential_plot", label: "رہائشی پلاٹ (Residential Plot)", icon: "Home" },
  { value: "commercial_plot", label: "کمرشل پلاٹ (Commercial Plot)", icon: "Building2" },
  { value: "house_villa", label: "مکان / کوٹھی / ولا (House/Villa)", icon: "Hotel" },
  { value: "shop_plaza", label: "دکان / پلازہ / ہال (Shop/Plaza)", icon: "Store" },
  { value: "agricultural_farm", label: "زرعی رقبہ / فارم ہاؤس (Farmhouse)", icon: "Trees" },
  { value: "other", label: "دیگر پراپرٹی (Other)", icon: "Layers" }
];

export const PROPERTY_PURPOSES = [
  { value: "sale", label: "برائے فروخت (For Sale)", color: "emerald" },
  { value: "purchase", label: "مطلوب / برائے خرید (Wanted/Buy)", color: "blue" },
  { value: "rent", label: "برائے کرایہ (For Rent)", color: "purple" },
  { value: "sold", label: "فروخت شدہ (Sold Deal)", color: "slate" }
];

export const PROPERTY_STATUSES = [
  { value: "available", label: "دستیاب (Available)", badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { value: "under_discussion", label: "زیرِ بحث / ٹوکن (Under Discussion)", badgeClass: "bg-amber-100 text-amber-800 border-amber-300" },
  { value: "sold", label: "فروخت شدہ (Sold)", badgeClass: "bg-slate-100 text-slate-800 border-slate-300" },
  { value: "cancelled", label: "منسوخ (Cancelled)", badgeClass: "bg-rose-100 text-rose-800 border-rose-300" }
];

export const SIZE_UNITS = [
  { value: "marla", label: "مرلہ (Marla)" },
  { value: "kanal", label: "کنال (Kanal)" },
  { value: "sqft", label: "اسکوائر فٹ (Sq. Ft)" },
  { value: "sqyd", label: "اسکوائر گز / یارڈ (Sq. Yd)" }
];

export const COMMON_FEATURES = [
  { id: "corner", label: "کارنر (Corner)" },
  { id: "park_facing", label: "پارک فیسنگ (Park Facing)" },
  { id: "main_boulevard", label: "مین بلیوارڈ (Main Boulevard)" },
  { id: "possession", label: "قبضہ دستیاب (Possession Available)" },
  { id: "non_possession", label: "نان پوزیشن (Non Possession)" },
  { id: "ready_construction", label: "تعمیر کے لیے تیار (Ready to Build)" },
  { id: "gas_electricity", label: "بجلی، گیس و سیوریج موجود (Utilities Ready)" },
  { id: "facing_commercial", label: "کمرشل کے بالمقابل (Near Commercial)" },
  { id: "wide_road", label: "60 تا 80 فٹ کشادہ سڑک (Wide Road)" },
  { id: "paid_in_full", label: "مکمل ادا شدہ (100% Paid)" },
  { id: "installments", label: "اقساط پر دستیاب (On Installments)" },
  { id: "urgent_sale", label: "ارجنٹ سیل (Urgent Sale / Hot Deal)" }
];

export const POPULAR_SOCIETIES: SocietyCatalogItem[] = [
  {
    id: "royal_palm_city",
    nameUrdu: "رائل پام سٹی گوجرانوالہ",
    nameEnglish: "Royal Palm City Gujranwala",
    location: "جی ٹی روڈ نزد بائی پاس، گوجرانوالہ",
    blocks: ["پام کمرشل (235)", "بلاک A", "بلاک B", "بلاک C", "بلاک D", "بلاک E", "پام ولاز"],
    highlight: "بن عباس پراپرٹیز کا ہیڈ آفس (پام کمرشل 235)",
    description: "گوجرانوالہ کی سب سے پرتعیش اور جدید ترین رہائشی و کمرشل سوسائٹی جس میں رائل گولڈ جم، انٹرنیشنل اسکولز، اور وسیع کمرشل حب شامل ہیں۔",
    isPopular: true
  },
  {
    id: "dha_gujranwala",
    nameUrdu: "ڈی ایچ اے گوجرانوالہ",
    nameEnglish: "DHA Gujranwala",
    location: "مین جی ٹی روڈ نزد کینٹ، گوجرانوالہ",
    blocks: ["فیز 1 (بلاک A تا K)", "کمرشل زون", "ایگزیکٹو ولاز"],
    highlight: "اعلیٰ ترین سیکیورٹی و بین الاقوامی معیار کا انفراسٹرکچر",
    description: "دفاع ہاؤسنگ اتھارٹی کا پروجیکٹ جس میں بہترین سرمایہ کاری اور محفوظ ترین رہائش کے مواقع موجود ہیں۔",
    isPopular: true
  },
  {
    id: "master_city",
    nameUrdu: "ماسٹر سٹی گوجرانوالہ",
    nameEnglish: "Master City Gujranwala",
    location: "سیالکوٹ بائی پاس روڈ، گوجرانوالہ",
    blocks: ["بلاک A", "بلاک B", "بلاک C", "بلاک D", "اوورسیز بلاک"],
    highlight: "سرسبز پارکس، بوٹنگ کینال اور لگژری سہولیات",
    description: "فیملی لونگ کے لیے شاندار سوسائٹی جس میں بین الاقوامی معیار کی سہولیات میسر ہیں۔",
    isPopular: true
  },
  {
    id: "citi_housing",
    nameUrdu: "سٹی ہاؤسنگ گوجرانوالہ",
    nameEnglish: "Citi Housing Gujranwala",
    location: "سیالکوٹ روڈ / بائی پاس، گوجرانوالہ",
    blocks: ["فیز 1", "فیز 2", "تھیم پارک زون"],
    highlight: "گولڈ مائن لوکیشن اور پرائم کمرشل مراکز",
    description: "گوجرانوالہ میں جدید طرزِ زندگی کا پیش خیمہ پروجیکٹ۔",
    isPopular: true
  },
  {
    id: "dc_colony",
    nameUrdu: "ڈی سی کالونی گوجرانوالہ",
    nameEnglish: "DC Colony Gujranwala",
    location: "جی ٹی روڈ نزد راہوالی کینٹ، گوجرانوالہ",
    blocks: ["ایکسٹینشن 1", "ایکسٹینشن 2", "بلاک الفا", "بلاک بیٹا"],
    highlight: "کینٹ کے پرسکون اور محفوظ ماحول کے قریب",
    description: "طویل عرصے سے قائم، انتہائی پُرسکون اور فیملیز کے لیے موزوں رہائشی علاقہ۔",
    isPopular: true
  },
  {
    id: "other_societies",
    nameUrdu: "دیگر تمام سوسائٹیز و لوکیشنز",
    nameEnglish: "Other Societies / GT Road",
    location: "گوجرانوالہ و گردونواح",
    blocks: ["شالیمار ٹاؤن", "گارڈن ٹاؤن", "ماڈل ٹاؤن", "پیپلز کالونی", "کینٹ ایریا"],
    highlight: "تمام اہم علاقوں میں خرید و فروخت کی سہولت",
    description: "گوجرانوالہ کے تمام مضافاتی و شہری علاقوں میں رہائشی و کمرشل ڈیلز۔",
    isPopular: false
  }
];

// Price Formatter Helper
export function formatPKR(amount: number): string {
  if (!amount || isNaN(amount)) return "0 روپے";
  
  if (amount >= 10000000) {
    const crore = amount / 10000000;
    const rounded = Math.round(crore * 100) / 100;
    return `${rounded} کروڑ روپے`;
  } else if (amount >= 100000) {
    const lakh = amount / 100000;
    const rounded = Math.round(lakh * 100) / 100;
    return `${rounded} لاکھ روپے`;
  } else if (amount >= 1000) {
    const thousand = amount / 1000;
    return `${thousand} ہزار روپے`;
  }
  return `${amount.toLocaleString('en-PK')} روپے`;
}

// WhatsApp Formatter for Property
export function generateWhatsAppMessage(property: any): string {
  const purposeText = property.purpose === 'sale' ? 'برائے فروخت' : property.purpose === 'purchase' ? 'مطلوب / برائے خرید' : 'برائے کرایہ';
  const sizeText = `${property.sizeValue} ${property.sizeUnit === 'marla' ? 'مرلہ' : property.sizeUnit === 'kanal' ? 'کنال' : 'اسکوائر فٹ'}`;
  const priceText = formatPKR(property.demandPrice);
  
  return `*${BUSINESS_NAME} - ڈیل تفصیلات*\n` +
    `📍 *لوکیشن:* ${property.society} (${property.blockPhase || 'بلاک'})\n` +
    `🏡 *پلاٹ/پراپرٹی نمبر:* ${property.plotNumber || 'دستیاب'}\n` +
    `📐 *سائز:* ${sizeText}\n` +
    `🏷️ *حیثیت:* ${purposeText}\n` +
    `💰 *ڈیمانڈ:* ${priceText} (${property.priceType === 'negotiable' ? 'کمی بیشی ممکن' : 'فکس ریٹ'})\n` +
    (property.features && property.features.length > 0 ? `✨ *خصوصیات:* ${property.features.join(', ')}\n` : '') +
    (property.description ? `📝 *تفصیل:* ${property.description}\n` : '') +
    `\n🏢 *دفتر:* ${ADDRESS}\n` +
    `🗺️ *گوگل میپس:* ${GOOGLE_MAPS_URL}\n` +
    `📞 *رابطہ:* ${CONTACT_PHONE}`;
}
