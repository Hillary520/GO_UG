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

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type BookingRequest = {
  id: string;
  kind: "place" | "guide";
  entityId: string;
  title: string;
  date: string;
  guests: number;
  notes: string;
  status: BookingStatus;
  createdAt: string;
};

export type TravellerReview = {
  id: string;
  entityId: string;
  author: string;
  rating: number;
  text: string;
  status: "pending" | "published" | "rejected";
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  guideId: string;
  sender: "traveller" | "guide";
  text: string;
  createdAt: string;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type TravelPreferences = {
  language: "English" | "Luganda";
  currency: "UGX" | "USD";
  notifications: boolean;
  interests: Category[];
};

export type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  status: "received" | "resolved";
  createdAt: string;
};

export type ManagedPlace = CatalogItem & {
  status: "draft" | "published";
};
