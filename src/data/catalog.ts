import type { CatalogItem, Guide, TripTemplate } from "@/types";

const image = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;

export const catalog: CatalogItem[] = [
  {
    id: "bwindi",
    title: "Bwindi Impenetrable Forest",
    eyebrow: "A once-in-a-lifetime encounter",
    category: "Safari",
    location: "Kanungu District",
    region: "Western Uganda",
    image: image("photo-1516026672322-bc52d61a55d5"),
    description:
      "Walk ancient rainforest trails and meet mountain gorillas in their natural home.",
    longDescription:
      "Dense, misty and deeply alive, Bwindi is one of Uganda's most moving landscapes. Guided treks lead small groups through an ancient rainforest to spend a carefully managed hour with a habituated gorilla family.",
    rating: 4.9,
    reviewCount: 186,
    priceLabel: "From USD 800",
    duration: "Full day",
    tags: ["Wildlife", "Forest", "Bucket list"],
    highlights: [
      "Expert-guided gorilla trekking",
      "Community-led cultural visits",
      "Remarkable birdlife and forest walks"
    ],
    featured: true,
    coordinates: { lat: -1.0521, lng: 29.6182 }
  },
  {
    id: "nile-rafting",
    title: "White-water on the Nile",
    eyebrow: "Featured adventure",
    category: "Adventure",
    location: "Jinja",
    region: "Eastern Uganda",
    image: image("photo-1530866495561-507c9faab2ed"),
    description:
      "Paddle legendary rapids with an experienced river crew, minutes from Jinja.",
    longDescription:
      "Feel the force of the Nile on a professionally guided rafting day designed around your confidence level. Safety briefings, equipment, riverside lunch and transport from central Jinja are included.",
    rating: 4.8,
    reviewCount: 94,
    priceLabel: "From USD 115",
    duration: "6 hours",
    tags: ["Adrenaline", "River", "Groups"],
    highlights: [
      "International-standard safety equipment",
      "Routes for first-timers and confident rafters",
      "Riverside lunch included"
    ],
    featured: true,
    coordinates: { lat: 0.4479, lng: 33.2026 }
  },
  {
    id: "murchison",
    title: "Murchison Falls",
    eyebrow: "Wild Uganda",
    category: "Safari",
    location: "Masindi",
    region: "Northern Uganda",
    image: image("photo-1549366021-9f761d450615"),
    description:
      "See the Nile thunder through a narrow gorge, then track wildlife across open savannah.",
    longDescription:
      "Uganda's largest national park pairs one of the world's most powerful waterfalls with classic savannah game drives. A boat journey to the falls is a superb way to see hippos, crocodiles, elephants and river birds.",
    rating: 4.8,
    reviewCount: 142,
    priceLabel: "From USD 65",
    duration: "2–3 days",
    tags: ["Waterfall", "Wildlife", "Boat"],
    highlights: [
      "Boat safari to the base of the falls",
      "Sunrise game drives",
      "Top-of-the-falls viewpoint"
    ],
    coordinates: { lat: 2.2824, lng: 31.6856 }
  },
  {
    id: "bunyonyi",
    title: "Lake Bunyonyi",
    eyebrow: "Slow travel favourite",
    category: "Stay",
    location: "Kabale",
    region: "Southwestern Uganda",
    image: image("photo-1470770841072-f978cf4d019e"),
    description:
      "Wake to terraced hills and quiet islands at one of Uganda's most peaceful escapes.",
    longDescription:
      "Lake Bunyonyi's cool air, green hills and island-dotted water reward slow mornings. Paddle a dugout canoe, walk through nearby villages or settle into a waterside lodge with a good book.",
    rating: 4.7,
    reviewCount: 78,
    priceLabel: "Stays from USD 48",
    duration: "2 nights",
    tags: ["Lake", "Relax", "Couples"],
    highlights: [
      "Island canoe journeys",
      "Terraced hillside walks",
      "A restful stop after gorilla trekking"
    ],
    featured: true,
    sponsored: true,
    coordinates: { lat: -1.2833, lng: 29.9167 }
  },
  {
    id: "sipi-falls",
    title: "Sipi Falls & coffee country",
    eyebrow: "Highland escape",
    category: "Culture",
    location: "Kapchorwa",
    region: "Eastern Uganda",
    image: image("photo-1464278533981-50106e6176b1"),
    description:
      "Hike a chain of waterfalls and roast coffee with farming families on Mount Elgon.",
    longDescription:
      "Three dramatic waterfalls, cool highland air and welcoming coffee communities make Sipi a rewarding two-day escape. Local guides connect the landscape with the stories and livelihoods around it.",
    rating: 4.8,
    reviewCount: 65,
    priceLabel: "From UGX 80,000",
    duration: "1–2 days",
    tags: ["Hiking", "Coffee", "Community"],
    highlights: [
      "Three-waterfall hiking circuit",
      "Farm-to-cup coffee experience",
      "Sunset views across the plains"
    ],
    coordinates: { lat: 1.3311, lng: 34.3797 }
  },
  {
    id: "kampala-food",
    title: "Kampala after-dark food walk",
    eyebrow: "Eat like a local",
    category: "Food",
    location: "Kampala",
    region: "Central Uganda",
    image: image("photo-1555939594-58d7cb561ad1"),
    description:
      "Taste rolex, grilled favourites and modern Ugandan plates with a local host.",
    longDescription:
      "Follow a trusted Kampala host through a lively sequence of street-food stops and neighbourhood restaurants. The route mixes beloved classics with the chefs shaping the city's new food culture.",
    rating: 4.9,
    reviewCount: 51,
    priceLabel: "From UGX 95,000",
    duration: "3 hours",
    tags: ["Food", "City", "Evening"],
    highlights: [
      "Five generous tasting stops",
      "Small groups of up to eight",
      "Vegetarian route available"
    ],
    coordinates: { lat: 0.3476, lng: 32.5825 }
  },
  {
    id: "queen-elizabeth",
    title: "Queen Elizabeth National Park",
    eyebrow: "Classic safari",
    category: "Safari",
    location: "Kasese",
    region: "Western Uganda",
    image: image("photo-1516426122078-c23e76319801"),
    description:
      "Cruise the Kazinga Channel and search for tree-climbing lions on open plains.",
    longDescription:
      "This varied park combines crater lakes, broad savannah, forested gorges and the wildlife-rich Kazinga Channel. It is an excellent choice for travellers seeking a balanced safari experience.",
    rating: 4.7,
    reviewCount: 119,
    priceLabel: "From USD 55",
    duration: "2 days",
    tags: ["Safari", "Boat", "Birding"],
    highlights: [
      "Kazinga Channel boat safari",
      "Ishasha tree-climbing lions",
      "Crater lake viewpoints"
    ],
    coordinates: { lat: -0.1833, lng: 30.05 }
  },
  {
    id: "ndere-night",
    title: "An evening at Ndere",
    eyebrow: "Stories in motion",
    category: "Culture",
    location: "Ntinda, Kampala",
    region: "Central Uganda",
    image: image("photo-1504609813442-a8924e83f76e"),
    description:
      "Experience Uganda's musical traditions through dance, story and shared food.",
    longDescription:
      "The Ndere Troupe brings the country's extraordinary cultural range together in a generous evening of rhythm, dance, humour and storytelling, hosted in a lush Kampala amphitheatre.",
    rating: 4.8,
    reviewCount: 83,
    priceLabel: "From UGX 60,000",
    duration: "3 hours",
    tags: ["Dance", "Music", "Family"],
    highlights: [
      "Performances from across Uganda",
      "Open-air amphitheatre",
      "Dinner available on site"
    ],
    coordinates: { lat: 0.3659, lng: 32.612 }
  }
];

export const guides: Guide[] = [
  {
    id: "amina",
    name: "Amina Nansubuga",
    image: image("photo-1494790108377-be9c29b29330", 500),
    coverImage: image("photo-1521295121783-8a321d551ad2"),
    location: "Kampala & Central",
    specialties: ["Food", "Culture", "City walks"],
    languages: ["English", "Luganda", "Swahili"],
    rating: 4.9,
    reviewCount: 76,
    priceLabel: "From UGX 85,000",
    verified: true,
    bio: "A Kampala storyteller connecting visitors with the food, art and everyday life that make the city unforgettable.",
    yearsExperience: 7,
    sponsored: true
  },
  {
    id: "james",
    name: "James Tumwesigye",
    image: image("photo-1500648767791-00dcc994a43e", 500),
    coverImage: image("photo-1516026672322-bc52d61a55d5"),
    location: "Bwindi & Kigezi",
    specialties: ["Gorillas", "Birding", "Community"],
    languages: ["English", "Rukiga"],
    rating: 5,
    reviewCount: 43,
    priceLabel: "From USD 45 / day",
    verified: true,
    bio: "A patient naturalist from Kigezi with a gift for birds, forest ecology and thoughtful community encounters.",
    yearsExperience: 11
  },
  {
    id: "miriam",
    name: "Miriam Chebet",
    image: image("photo-1531123897727-8f129e1688ce", 500),
    coverImage: image("photo-1464278533981-50106e6176b1"),
    location: "Sipi & Mount Elgon",
    specialties: ["Hiking", "Coffee", "Photography"],
    languages: ["English", "Kupsabiny", "Swahili"],
    rating: 4.8,
    reviewCount: 38,
    priceLabel: "From UGX 70,000",
    verified: true,
    bio: "Mountain guide and coffee grower creating unhurried hikes through the landscapes and family farms around Sipi.",
    yearsExperience: 6
  },
  {
    id: "sam",
    name: "Samuel Okello",
    image: image("photo-1507003211169-0a1dd7228f2d", 500),
    coverImage: image("photo-1549366021-9f761d450615"),
    location: "Murchison & North",
    specialties: ["Wildlife", "Birding", "Road trips"],
    languages: ["English", "Luo", "Swahili"],
    rating: 4.9,
    reviewCount: 61,
    priceLabel: "From USD 50 / day",
    verified: true,
    bio: "A northern Uganda safari specialist known for careful wildlife tracking and calm, flexible road trips.",
    yearsExperience: 9
  }
];

export const tripTemplates: TripTemplate[] = [
  {
    id: "wild-west",
    title: "Wild western Uganda",
    subtitle: "Gorillas, crater lakes and classic safari",
    days: 6,
    image: catalog[0].image,
    itemIds: ["bwindi", "queen-elizabeth", "bunyonyi"],
    tag: "Wildlife"
  },
  {
    id: "city-source",
    title: "Kampala to the Nile",
    subtitle: "Food, culture and a rush of adventure",
    days: 4,
    image: catalog[1].image,
    itemIds: ["kampala-food", "ndere-night", "nile-rafting"],
    tag: "First visit"
  },
  {
    id: "eastern-highlands",
    title: "Eastern highlands",
    subtitle: "Waterfalls, coffee and mountain air",
    days: 3,
    image: catalog[4].image,
    itemIds: ["sipi-falls"],
    tag: "Slow travel"
  }
];

export const categories = [
  "All",
  "Safari",
  "Adventure",
  "Culture",
  "Food",
  "Stay"
] as const;

export const featured = [
  catalog.find((item) => item.id === "nile-rafting")!,
  catalog.find((item) => item.id === "bwindi")!,
  catalog.find((item) => item.id === "bunyonyi")!
];
