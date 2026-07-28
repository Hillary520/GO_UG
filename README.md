# GoUG

GoUG is a mobile-first Uganda travel companion built with React, TypeScript,
Firebase and Capacitor. It currently runs with a complete seeded catalogue and
local persistence, so the product can be reviewed before a Firebase project is
connected.

## What is implemented

- Branded welcome and guest/sign-in entry.
- Mobile-first Discover experience with search and category filters.
- Featured activity, destination and sponsored accommodation carousel.
- Uganda destination, safari, culture, food, stay and adventure catalogue.
- Place details, Maps links, sharing, saving and itinerary actions.
- Curated trip templates and a working local itinerary builder.
- Verified tour-guide directory and profiles.
- Profile, preferences, saved places and account-management placeholders.
- Responsive content-studio/admin preview.
- PWA installation and offline app-shell caching.
- Firebase configuration, repository fallback, Firestore rules, Storage rules
  and emulator configuration.
- Capacitor Android project targeting Android 16 / API 36.

Payments, provider availability, user reviews and transactional messaging are
deliberately represented as upcoming functionality.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The first visit shows the GoUG welcome
screen. Browser state can be reset by clearing local storage.

## Quality checks

```bash
npm test
npm run build
```

## Connect Firebase

1. Create separate Firebase projects for development, staging and production.
2. Enable Authentication providers for Email/Password and Google.
3. Create Firestore and Storage in a region selected for GoUG's users and legal
   requirements.
4. Copy `.env.example` to `.env.local` and add the web app credentials.
5. Install and sign in to Firebase CLI.
6. Select the correct project and deploy rules/indexes before adding production
   data.
7. Enable App Check before public release.

When configured, `src/lib/contentRepository.ts` reads published Firebase
content and falls back to the seeded catalogue if the project is unavailable or
empty.

## Android

The Capacitor Android project is already generated:

```bash
npm run android:sync
npm run android:open
```

Android Studio is required for signing, emulator/device testing, and creating
the release Android App Bundle. Replace the generated launcher art and verify
the current Google Play target API requirement before submission.

## Important production work

- Replace demonstration images and copy with licensed, partner-approved content.
- Connect real account deletion in Firebase and publish its public web endpoint.
- Add legal privacy, terms, community, cancellation and support pages.
- Configure custom claims for editor, moderator and administrator roles.
- Keep bookings and later payments behind trusted Cloud Functions.
- Add real moderation before enabling public reviews or uploads.
- Complete Data safety, content-rating, advertising and reviewer-access forms in
  Play Console.
