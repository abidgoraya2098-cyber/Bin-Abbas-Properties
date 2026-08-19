// Smart Market Price Valuation & Rate Estimator Engine for Royal Palm City Gujranwala

export interface ValuationInput {
  block: string;
  size: string;
  category?: string;
  isCommercial?: boolean;
}

export interface ValuationResult {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  ratePerMarlaMin: number;
  ratePerMarlaMax: number;
  marlaCount: number;
  demandLevel: "high" | "medium" | "moderate";
  demandLabelUrdu: string;
  demandLabelEnglish: string;
  formattedMin: string;
  formattedMax: string;
  formattedAvg: string;
  insightsUrdu: string;
  insightsEnglish: string;
}

export function formatLacsCrores(amount: number, isUrdu: boolean = true): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return isUrdu ? `${cr.toFixed(2).replace(/\.00$/, "")} کروڑ` : `${cr.toFixed(2).replace(/\.00$/, "")} Crore`;
  }
  if (amount >= 100000) {
    const lac = amount / 100000;
    return isUrdu ? `${lac.toFixed(1).replace(/\.0$/, "")} لاکھ` : `${lac.toFixed(1).replace(/\.0$/, "")} Lacs`;
  }
  return amount.toLocaleString("en-PK") + (isUrdu ? " روپے" : " PKR");
}

export function estimateRoyalPalmPrice(input: ValuationInput, isUrdu: boolean = true): ValuationResult {
  const { block, size, category = "جنرل / نارمل (General)", isCommercial = false } = input;

  // Extract Marla count
  let marla = 5;
  if (size.includes("10") || size.toLowerCase().includes("10 marla")) marla = 10;
  else if (size.includes("1 کنال") || size.toLowerCase().includes("1 kanal")) marla = 20;
  else if (size.includes("2 کنال") || size.toLowerCase().includes("2 kanal")) marla = 40;
  else if (size.includes("2 مرلہ") || size.toLowerCase().includes("2 marla")) marla = 2;
  else if (size.includes("4 مرلہ") || size.toLowerCase().includes("4 marla")) marla = 4;
  else if (size.includes("8 مرلہ") || size.toLowerCase().includes("8 marla")) marla = 8;
  else if (size.includes("5")) marla = 5;

  const isComm = isCommercial || size.includes("کمرشل") || size.toLowerCase().includes("commercial") || block.includes("کمرشل");

  // Base rate per marla depending on block (Residential baseline)
  let baseRateMin = 1300000; // 13 Lacs / Marla base
  let baseRateMax = 1550000; // 15.5 Lacs / Marla base
  let demandLevel: "high" | "medium" | "moderate" = "high";

  const cleanBlock = block.toLowerCase();

  if (isComm) {
    // Commercial Rates
    baseRateMin = 3800000; // 38 Lacs / Marla
    baseRateMax = 5200000; // 52 Lacs / Marla
    demandLevel = "high";
  } else if (cleanBlock.includes("executive") || cleanBlock.includes("ایگزیکٹو")) {
    baseRateMin = 1450000;
    baseRateMax = 1750000;
    demandLevel = "high";
  } else if (cleanBlock.includes("royal") || cleanBlock.includes("رائل")) {
    baseRateMin = 1400000;
    baseRateMax = 1700000;
    demandLevel = "high";
  } else if (cleanBlock.includes("بلاک a") || cleanBlock.includes("block a")) {
    baseRateMin = 1350000;
    baseRateMax = 1600000;
    demandLevel = "high";
  } else if (cleanBlock.includes("بلاک b") || cleanBlock.includes("block b")) {
    baseRateMin = 1300000;
    baseRateMax = 1550000;
    demandLevel = "high";
  } else if (cleanBlock.includes("بلاک c") || cleanBlock.includes("block c") || cleanBlock.includes("بلاک d")) {
    baseRateMin = 1150000;
    baseRateMax = 1400000;
    demandLevel = "medium";
  } else {
    baseRateMin = 1250000;
    baseRateMax = 1500000;
    demandLevel = "medium";
  }

  // Category Multipliers
  let multiplier = 1.0;
  const cleanCat = category.toLowerCase();
  if (cleanCat.includes("کارنر") || cleanCat.includes("corner")) {
    multiplier += 0.10; // +10%
  }
  if (cleanCat.includes("پارک") || cleanCat.includes("park")) {
    multiplier += 0.08; // +8%
  }
  if (cleanCat.includes("100") || cleanCat.includes("مین بلیوارڈ") || cleanCat.includes("boulevard")) {
    multiplier += 0.18; // +18%
  } else if (cleanCat.includes("60") || cleanCat.includes("80")) {
    multiplier += 0.07; // +7%
  }

  const ratePerMarlaMin = Math.round(baseRateMin * multiplier);
  const ratePerMarlaMax = Math.round(baseRateMax * multiplier);

  const minPrice = Math.round(ratePerMarlaMin * marla);
  const maxPrice = Math.round(ratePerMarlaMax * marla);
  const avgPrice = Math.round((minPrice + maxPrice) / 2);

  const demandLabelUrdu = demandLevel === "high" ? "انتہائی ہاٹ ڈیمانڈ 🔥" : demandLevel === "medium" ? "مضبوط مارکیٹ ڈیمانڈ ⭐" : "مستحکم ڈیمانڈ 📈";
  const demandLabelEnglish = demandLevel === "high" ? "High Market Demand 🔥" : demandLevel === "medium" ? "Strong Demand ⭐" : "Stable Demand 📈";

  const insightsUrdu = isComm 
    ? `${block} میں ${size} کمرشل پلازہ و بزنس کے لیے بہترین اور ہائی رینٹل ریٹرن والی سرمایہ کاری ہے۔`
    : `${block} میں ${size} پلاٹ رہائش اور تیز رفتار منافع بخش سرمایہ کاری کے لیے آئیڈیل لوکیشن پر ہے۔`;

  const insightsEnglish = isComm
    ? `${size} Commercial in ${block} offers exceptional business footprint and high rental yield.`
    : `${size} plot in ${block} is ideally positioned for peaceful living and high capital appreciation.`;

  return {
    minPrice,
    maxPrice,
    avgPrice,
    ratePerMarlaMin,
    ratePerMarlaMax,
    marlaCount: marla,
    demandLevel,
    demandLabelUrdu,
    demandLabelEnglish,
    formattedMin: formatLacsCrores(minPrice, isUrdu),
    formattedMax: formatLacsCrores(maxPrice, isUrdu),
    formattedAvg: formatLacsCrores(avgPrice, isUrdu),
    insightsUrdu,
    insightsEnglish
  };
}
