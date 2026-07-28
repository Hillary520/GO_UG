# GoUG Development Plan

## 1. Product direction

GoUG will launch as a mobile-first Uganda travel companion for discovering destinations, food, culture, accommodation, activities, safaris, and local tour guides. It will help travellers plan and save trips, then book selected physical travel services.

The first release should be intentionally smaller than the full feature list in the original brief. It should feel complete and polished rather than expose many unfinished tools.

### Decisions taken from the adjustment document

- Focus entirely on Uganda at launch.
- Show a branded welcome screen before sign-up.
- Allow users to continue as a guest; require sign-in only when they save, book, or review.
- Replace the large static home banner with a horizontally swipeable featured carousel containing at least:
  - one activity or destination;
  - one tour guide;
  - one accommodation.
- Reserve clearly labelled sponsored placements for brands, companies, and guides.
- Make the Guide tab a directory of tour guides.
- Replace the prototype's purple accents with a warm orange/yellow palette.
- Retain the bottom navigation: Discover, Trips, Guide, Profile.
- Treat the supplied Figma prototype as visual direction, not a final technical specification.

## 2. Recommended launch scope

### Traveller experience

1. **Welcome and authentication**
   - Branded welcome screen.
   - Continue as guest.
   - Email/password and Google sign-in.
   - Profile, language, and currency preferences.
   - In-app account deletion.

2. **Discover Uganda**
   - Featured swipeable carousel.
   - Search and filters by region, category, price range, and interest.
   - Sections for destinations, safaris/activities, accommodation, local food, culture, and guides.
   - Clearly labelled sponsored cards.
   - Curated seasonal articles and travel tips.

3. **Detail pages**
   - Photos, description, location/map, price indicator, opening information, highlights, and practical tips.
   - Save to favourites or a trip.
   - Share a link.
   - Accommodation cards initially open the provider's own trusted booking page.
   - Activity and guide pages support booking requests or direct booking where a commercial agreement exists.

4. **Trips**
   - Saved items and wish lists.
   - Curated, pre-made itineraries.
   - A simple day-by-day itinerary builder.
   - Booking status and booking history.
   - The expense calculator and packing checklist are deferred because the original document explicitly marks them as uncertain.

5. **Tour guides**
   - Searchable guide directory.
   - Verified guide profiles, languages, areas served, specialties, rates, reviews, and availability.
   - Booking request and contact flow.
   - Verification badge controlled by GoUG administrators, not self-assigned.

6. **Bookings and payments**
   - Book activities, safaris, and guides supplied directly through GoUG.
   - Redirect accommodation and transport bookings to trusted partner sites in the first release.
   - Use a supported payment provider for physical travel services; verify every payment by server-side webhook before confirming a booking.
   - Show cancellation/refund rules before payment.
   - Start with one settlement currency and display converted prices only as estimates.

7. **Reviews**
   - Launch with text and photo reviews from signed-in users.
   - Include report content, block user, moderation status, and admin takedown tools.
   - Add video reviews after storage cost, transcoding, upload reliability, and moderation workflows have been proven.

8. **Administration**
   - A protected web admin area for destinations, guides, activities, accommodation, articles, featured carousel items, sponsored placements, bookings, refunds, users, and review moderation.
   - Role-based access for administrator, editor, booking support, and moderator.
   - Audit records for high-impact changes.

### Explicitly defer until after launch

- Offline map packs and turn-by-turn navigation.
- Public forums, travel buddies, friend/group planning, and bill splitting.
- Video reviews and travel journals.
- Real-time public transport schedules and flight tracking.
- Emergency SOS automation, insurance assistance, and real-time safety warnings.
- AR navigation.
- Voice/AI translation.
- Gamification, rewards, referrals, and badges.
- Carbon tracking.
- Automated recommendations based on behavioural profiling.

Static emergency contacts, common phrases, scam-awareness guidance, and seasonal safety notes can still be included as editorial content in the first release.

## 3. Technical approach

### Recommended stack

- **Frontend:** React, TypeScript, Vite, React Router, Tailwind CSS.
- **Mobile packaging:** Capacitor for Android; do not ship a bare WebView whose only job is opening the public website.
- **PWA:** service worker, install manifest, cached app shell, responsive images, and graceful offline/error states.
- **Authentication:** Firebase Authentication with email/password and Google sign-in.
- **Database:** Cloud Firestore.
- **Media:** Cloud Storage for Firebase.
- **Trusted server logic:** Cloud Functions for Firebase.
- **Hosting:** Firebase Hosting.
- **Push:** Firebase Cloud Messaging.
- **Protection:** Firebase Security Rules, App Check, rate limits, and least-privilege admin roles.
- **Observability:** Firebase Analytics, Crashlytics for the Android container, and structured Cloud Functions logs.
- **Maps:** Google Maps or Mapbox for maps/places; defer offline maps.
- **Payments:** choose a Uganda-capable provider after checking settlement, Mobile Money, card support, refunds, fees, and webhook quality.

### Why Capacitor instead of a raw WebView

The React application remains the main codebase, but the Android package owns a real mobile shell. The initial UI bundle ships inside the app, while Firebase supplies changing content and data. This avoids a blank app on a poor connection and makes it practical to support native back navigation, deep links, sharing, camera/photo selection, push notifications, network state, status bar styling, and secure native configuration.

The same React app is still deployed to the web as a PWA.

### Firebase suitability

Firebase is a good MVP backend for GoUG because it provides authentication, realtime data, media storage, server functions, push notifications, and hosting without a large operations burden.

Use these safeguards:

- Client code must never confirm payments, approve guides, set roles, publish sponsored content, or calculate authoritative booking totals.
- Put booking, payment, refund, moderation, notification, and role changes in Cloud Functions.
- Use Firestore transactions and idempotency keys for booking/payment operations.
- Enforce access with Security Rules and test the rules in the Firebase Emulator Suite.
- Enable App Check before public launch.
- Set billing alerts, media limits, and image compression from the beginning.
- Keep data access behind a small repository/service layer so search or booking data can later move to a specialist service or SQL database.

Firestore is not a strong full-text search engine. Start with curated filters, regions, categories, tags, and prefix search. Add Algolia or Typesense only when the catalogue justifies it.

## 4. Initial data model

Suggested top-level Firestore collections:

- `users`
- `destinations`
- `activities`
- `accommodations`
- `guides`
- `food_places`
- `articles`
- `itinerary_templates`
- `user_trips`
- `bookings`
- `reviews`
- `reports`
- `featured_items`
- `sponsored_placements`
- `notifications`
- `payment_events`
- `audit_logs`

Use stable references between documents, but copy immutable booking facts such as item name, price, currency, traveller count, cancellation terms, and provider details into each booking. This preserves the transaction record if catalogue content later changes.

## 5. UI and design direction

- Use a warm Ugandan palette: deep forest green, sunrise orange, golden yellow, warm cream, charcoal, and white.
- Keep orange/yellow as accents; preserve strong contrast for text and controls.
- Use large editorial photography with a consistent image crop and colour treatment.
- Use one clean sans-serif family, a restrained type scale, rounded cards, and subtle motion.
- Keep a minimum 44–48 px touch target and place primary actions within thumb reach.
- Design at 360 px first, then test common Android widths, tablets, and desktop web.
- Use skeleton loading, clear empty states, retry states, and cached last-known content.
- Mark paid placement with a visible `Sponsored` label and never disguise it as an organic recommendation.
- Compress images, serve responsive sizes, lazy-load lists, and never autoplay review video.

### Primary navigation

- **Discover:** search, featured carousel, categories, nearby/region browsing, and articles.
- **Trips:** saved items, itinerary templates, user itineraries, and bookings.
- **Guide:** verified tour-guide directory and profiles.
- **Profile:** preferences, reviews, support, legal pages, and account deletion.

## 6. Delivery phases

### Phase 0 — product and commercial decisions

- Confirm GoUG's legal/operator identity.
- Confirm the launch regions and seed catalogue.
- Decide which activities/guides GoUG may actually sell.
- Choose the payment provider and define cancellations, refunds, commissions, and provider payouts.
- Define guide verification and content moderation procedures.
- Collect photography/content rights and partner permissions.
- Convert the prototype into an approved screen list and design system.

**Exit:** approved MVP scope, content spreadsheet, partner model, payment choice, and release policy.

### Phase 1 — foundation and design system

- Create React/TypeScript application, Firebase environments, and CI checks.
- Add routing, responsive shell, bottom navigation, theme tokens, shared components, and error handling.
- Add welcome/onboarding and guest mode.
- Configure local emulators, App Check plan, Security Rules tests, logging, and separate development/staging/production projects.

**Exit:** installable PWA and Android development build with representative screens.

### Phase 2 — catalogue, discovery, and admin

- Build admin roles and catalogue editing.
- Build Discover, search/filter, featured carousel, sponsored placements, maps, and detail pages.
- Seed real Uganda content and optimise all images.
- Add accommodation/transport outbound links with partner attribution.

**Exit:** a guest can reliably explore a content-complete Uganda guide.

### Phase 3 — accounts and trips

- Add authentication, profile/preferences, favourites, itinerary templates, itinerary builder, and sharing.
- Add account deletion in-app and a public deletion-request webpage.
- Test cross-device sync and offline/error behaviour.

**Exit:** signed-in users can save and plan trips safely.

### Phase 4 — guides, bookings, and payments

- Add guide onboarding through admin, public guide profiles, availability, booking requests, checkout, server-side payment verification, confirmations, cancellations, and notifications.
- Add booking support tools and audit logs.
- Test duplicate webhooks, abandoned payments, refunds, price changes, and failed notifications.

**Exit:** a complete booking can be traced from selection through settlement/refund.

### Phase 5 — reviews, moderation, and hardening

- Add text/photo reviews, terms acceptance, reporting, blocking, moderation queues, and abuse rate limits.
- Perform accessibility, security rules, low-bandwidth, device, browser, and end-to-end testing.
- Run a closed pilot with travellers, guides, and booking support staff.

**Exit:** release candidate passes moderation, security, performance, and operational checks.

### Phase 6 — Android and Play Store release

- Finalise Capacitor Android integration, deep links, push notifications, native back behaviour, splash/icon, network handling, and signed Android App Bundle.
- Prepare privacy policy, terms, cancellation/refund policy, community rules, Data safety form, content rating, ads declaration, account-deletion URL, support contacts, store copy, and screenshots.
- Provide Google reviewers with a permanent demo account and clear access instructions.
- Release through internal testing, closed testing, staged production, then monitor crashes and booking failures.

**Exit:** stable production release with a rollback/support process.

### Planning estimate

For a small experienced team, this scope is approximately 10–14 weeks after product decisions, partner content, and payment credentials are ready. A single developer should allow more time, especially for booking operations, moderation, content entry, and store testing.

## 7. Google Play assessment

**Yes, Google Play can accept this architecture.** React, Firebase, and a WebView-based runtime are not themselves prohibited. Approval depends on the submitted app being stable, useful, responsive, policy-compliant, and more than a very thin wrapper around a small or static website.

GoUG should reduce rejection risk by:

- packaging the app with Capacitor and shipping a cached application shell;
- including meaningful app functionality such as saved trips, itinerary planning, bookings, maps, sharing, push updates, and account management;
- handling poor/no connectivity without a blank screen;
- using only permissions that are needed at the moment the user invokes a feature;
- providing reviewer credentials for authenticated areas;
- keeping the store listing limited to features that are actually live;
- targeting the API level required on the submission date;
- publishing an accessible web privacy policy and completing the Data safety form;
- providing account deletion both from inside the app and through a public web URL;
- implementing terms acceptance, reporting, blocking, and ongoing moderation before enabling reviews/photos/videos;
- declaring advertising and visibly labelling sponsored content;
- maintaining current Android signing, package registration, and developer verification.

Payments for safaris, guides, accommodation, transport, and other consumed-in-the-real-world travel services are physical-service payments and should not use Google Play Billing. A suitable external payment provider may be used. If GoUG later sells digital subscriptions, premium app features, ad-free access, or other digital content in the Android app, those transactions must be reviewed separately under Google Play's billing rules.

Because the likely release is after 31 August 2026, plan the Android build to target Android 16 / API level 36 or newer unless Google changes the published deadline. Re-check all policies immediately before submission.

Official references:

- [Google Play: Functionality, Content, and User Experience](https://support.google.com/googleplay/android-developer/answer/9898783)
- [Google Play Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738)
- [Google Play User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311)
- [Google Play account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111)
- [Google Play User-Generated Content policy](https://support.google.com/googleplay/android-developer/answer/9876937)
- [Google Play target API requirements](https://support.google.com/googleplay/android-developer/answer/11926878)
- [Capacitor documentation](https://capacitorjs.com/docs)

## 8. Decisions needed before implementation

1. Who is the legal merchant for bookings and refunds: GoUG or each provider?
2. Which launch payments are required: cards, MTN MoMo, Airtel Money, or all three?
3. Will users pay the full amount, a deposit, or send a booking request first?
4. Who verifies tour guides, handles disputes, and moderates reviews?
5. What is the launch currency, and which additional currencies are display-only?
6. Which Uganda destinations, guides, activities, accommodation, and food places will supply the initial real content?
7. Will sponsored placements be sold manually through GoUG's business process? This is recommended for launch.
8. Is English sufficient for the first release?

