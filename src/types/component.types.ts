// Component-specific types

// Spotlight component types
export interface SpotlightProps {
  items: string[];
  isFocused: boolean;
  onLoseFocus: () => void;
}

export interface ProductDetails {
  title: string;
  SuperHeroArt: {
    url?: string;
    Url?: string; // Legacy support
  } | null;
  publisherName: string;
  heroImageUrl?: string;
  averageRating?: number;
  displayPrice?: string;
}