export type Category =
  | "Destination"
  | "Safari"
  | "Culture"
  | "Food"
  | "Stay"
  | "Adventure";

export type CatalogItem = {
  id: string;
  title: string;
  eyebrow: string;
  category: Category;
  location: string;
  region: string;
  image: string;
  description: string;
  longDescription: string;
  rating: number;
  reviewCount: number;
  priceLabel: string;
  duration?: string;
  tags: string[];
  highlights: string[];
  sponsored?: boolean;
  featured?: boolean;
  coordinates?: { lat: number; lng: number };
};

export type Guide = {
  id: string;
  name: string;
  image: string;
  coverImage: string;
  location: string;
  specialties: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  priceLabel: string;
  verified: boolean;
  bio: string;
  yearsExperience: number;
  sponsored?: boolean;
};

export type TripTemplate = {
  id: string;
  title: string;
  subtitle: string;
  days: number;
  image: string;
  itemIds: string[];
  tag: string;
};

export type ToastMessage = {
  id: number;
  message: string;
};

export type AppUser = {
  displayName: string;
  email: string;
  initials: string;
};
