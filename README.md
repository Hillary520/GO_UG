# GoUG

GoUG is a mobile-first Uganda travel companion built with React, TypeScript,
Firebase, MapLibre and Capacitor. It runs as a public PWA and as an Android
WebView app backed by the same GitHub Pages deployment.

Public web app: <https://hillary520.github.io/GO_UG/>

## What is implemented

- Branded welcome and guest/sign-in entry.
- Mobile-first Discover experience with search and category filters.
- Built-in interactive Uganda map, geolocation and place markers.
- Featured activity, destination and sponsored accommodation carousel.
- Uganda destination, safari, culture, food, stay and adventure catalogue.
- Place details, embedded maps, directions, sharing, saving and itinerary actions.
- Curated trip templates and a working local itinerary builder.
- Verified tour-guide directory and profiles.
- Email/Google authentication, notifications, preferences, support, privacy and
  account deletion.
- Availability and guide requests, confirmations, cancellations and trip status.
- Guide messaging and moderated traveller reviews.
- Responsive content studio for places, map coordinates, featured and sponsored
  placements, bookings and moderation.
- PWA installation and offline app-shell caching.
- Firebase configuration, repository fallback, Firestore rules, Storage rules
  and emulator configuration.
- Capacitor Android project targeting Android 16 / API 36.
- OpenAI Sites worker packaging with SPA route fallback.

Payments remain intentionally excluded from this release. Booking requests do
not collect money.

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

## Firebase

The repository is connected to Firebase project `tourism-9e002`. Authentication
and Firestore are configured through the Firebase CLI. Deploy current database
rules and indexes with:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

The app remains local-first, so saved content and requests still work when the
network is weak. Signed-in writes are also sent to Firestore.

## Android

The Capacitor Android project is already generated:

```bash
npm run android:sync
npm run android:open
```

Android Studio is required for release signing and creating the Play Store
Android App Bundle. The debug APK can be built with:

```bash
npm run android:sync
cd android && ./gradlew assembleDebug
```

## Important production work

- Replace demonstration images and copy with licensed, partner-approved content.
- Configure custom claims for editor, moderator and administrator roles.
- Move booking confirmation and moderation writes behind trusted Cloud
  Functions before giving partners production access.
- Enable Firebase App Check.
- Complete Data safety, content-rating, advertising and reviewer-access forms in
  Play Console.
