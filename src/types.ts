export type PropertyPurpose = 'sale' | 'purchase' | 'rent' | 'sold';
export type PropertyType = 'residential_plot' | 'commercial_plot' | 'house_villa' | 'shop_plaza' | 'agricultural_farm' | 'other';
export type PropertyStatus = 'available' | 'under_discussion' | 'sold' | 'cancelled';
export type SizeUnit = 'marla' | 'kanal' | 'sqft' | 'sqyd';
export type ClientRole = 'owner' | 'buyer' | 'investor' | 'dealer';

export interface PropertyListing {
  id: string;
  title: string;
  society: string; // e.g. "رائل پام سٹی"
  blockPhase: string; // e.g. "پام کمرشل / بلاک بی"
  plotNumber: string; // e.g. "235"
  type: PropertyType;
  purpose: PropertyPurpose;
  sizeValue: number; // e.g. 5, 10, 1
  sizeUnit: SizeUnit; // 'marla', 'kanal', 'sqft'
  demandPrice: number; // in PKR
  demandPriceDisplay?: string; // e.g. "1 کروڑ 25 لاکھ"
  priceType: 'fixed' | 'negotiable' | 'per_marla';
  
  // Client / Contact details
  clientName: string;
  clientPhone: string;
  clientRole: ClientRole;
  
  // Property Attributes
  features: string[]; // ['corner', 'park_facing', 'main_boulevard', 'possession', 'gas_available', 'paid_in_full']
  categoryTags?: string[];
  
  // Description and Notes
  description: string;
  privateNotes?: string;
  status: PropertyStatus;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface BuySellInquiry {
  id: string;
  clientName: string;
  clientPhone: string;
  role: 'buyer' | 'seller' | 'investor';
  society: string;
  propertyType: PropertyType;
  preferredSize: string; // e.g. "5 مرلہ"
  budgetMin?: number;
  budgetMax?: number;
  budgetDisplay?: string;
  requirements: string;
  status: 'active' | 'fulfilled' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface DealVoucher {
  id: string;
  propertyId?: string;
  propertyTitle: string;
  society: string;
  plotNumber: string;
  dealType: 'sale_purchase' | 'token_advance' | 'rent_agreement';
  sellerName: string;
  sellerPhone: string;
  sellerCnic?: string;
  buyerName: string;
  buyerPhone: string;
  buyerCnic?: string;
  totalDealAmount: number;
  tokenAdvanceAmount: number;
  remainingAmount: number;
  dealDate: string;
  completionDeadline?: string;
  commissionAmount?: number;
  witness1Name?: string;
  witness1Phone?: string;
  witness2Name?: string;
  witness2Phone?: string;
  terms: string[];
  notes?: string;
  createdAt: string;
}

export interface SocietyCatalogItem {
  id: string;
  nameUrdu: string;
  nameEnglish: string;
  location: string;
  blocks: string[];
  highlight: string;
  description: string;
  isPopular?: boolean;
}
