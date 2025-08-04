// Store-related types for Microsoft Store API integration

// Enhanced ImageData interface for richer metadata
export interface ImageData {
  imageType: string;
  url: string;
  height: number;
  width: number;
  backgroundColor?: string;
  foregroundColor?: string;
  caption?: string;
  imagePositionInfo?: string;
  // Legacy support
  ImageType?: string;
  Url?: string;
  Height?: number;
  Width?: number;
  VideoPurpose?: string;
}

// System requirements interface
export interface SystemRequirement {
  level: string;
  itemCode: string;
  name: string;
  description: string;
  validationHint?: string;
  isValidationPassed?: boolean;
  priority: string;
  helpLink?: string;
  helpTitle?: string;
}

export interface SystemRequirements {
  minimum: {
    title: string;
    items: SystemRequirement[];
  };
  recommended: {
    title: string;
    items: SystemRequirement[];
  };
}

// Rating interface
export interface ProductRating {
  ratingSystem: string;
  ratingSystemShortName: string;
  ratingSystemId: string;
  ratingValue: string;
  ratingId: string;
  ratingAge: number;
  longName: string;
  shortName: string;
  description: string;
  hasInAppPurchases: boolean;
}

// Trailer interface
export interface Trailer {
  title: string;
  videoPurpose: string;
  url: string;
  height: number;
  width: number;
  image: ImageData;
  sortOrder?: number;
}

// Price information interface
export interface PriceInfo {
  msrp: number;
  price: number;
  displayPrice: string;
  narratorText: string;
  ownership: number;
}

// Best match result from search API
export interface BestMatch {
  productId: string;
  title: string;
  publisherName: string;
}

// Legacy ProductData interface (keeping for backward compatibility)
export interface ProductData {
  Title: string;
  PublisherName: string;
  ProductId: string;
  Images: ImageData[];
  Previews: ImageData[];
  categories: string[];
  description: string;
  developerName: string;
  iconUrl: string;
  iconUrlBackground: string;
  pdpImageUrl: string;
  posterArtUrl: string;
  publisherName: string;
  title: string;
}

// Legacy ApiResponse interface (keeping for backward compatibility)
export interface ApiResponse {
  Payload: {
    SearchResults: ProductData[];
  };
}

// Enhanced ProductResponse interface with rich product-info API data
export interface ProductResponse {
  // Core product information
  productId: string;
  title: string;
  shortTitle?: string;
  description: string;
  shortDescription?: string;
  publisherName: string;
  developerName?: string;
  
  // Categories and classification
  categoryId?: string;
  categoryIds?: string[];
  categories?: string[];
  
  // Images and media
  images: ImageData[];
  screenshots?: ImageData[];
  trailers?: Trailer[];
  iconUrl?: string;
  posterArtUrl?: string;
  boxArtUrl?: string;
  heroImageUrl?: string;
  iconUrlBackground?: string;
  
  // Specific image types for backward compatibility
  Poster: ImageData | null;
  BoxArt: ImageData | null;
  SuperHeroArt: ImageData | null;
  Trailer: ImageData | null;
  
  // Ratings and reviews
  averageRating?: number;
  ratingCount?: number;
  ratingCountFormatted?: string;
  productRatings?: ProductRating[];
  
  // Pricing
  price?: number;
  displayPrice?: string;
  priceInfo?: PriceInfo;
  
  // Technical details
  systemRequirements?: SystemRequirements;
  capabilities?: string[];
  approximateSizeInBytes?: number;
  maxInstallSizeInBytes?: number;
  supportedLanguages?: string[];
  
  // Release information
  releaseDateUtc?: string;
  lastUpdateDateUtc?: string;
  
  // Additional metadata
  mediaType?: string;
  hasAddOns?: boolean;
  hasThirdPartyIAPs?: boolean;
  gamingOptionsXboxLive?: boolean;
  allowedPlatforms?: string[];
}