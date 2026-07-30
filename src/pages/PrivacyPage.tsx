import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useSmartBack } from "@/lib/useSmartBack";

export function PrivacyPage() {
  const goBack = useSmartBack("/profile");
  return (
    <div className="page info-page">
      <button className="info-page__back" onClick={goBack}>
        <ArrowLeft size={18} />
        Back
      </button>
      <header>
        <span><ShieldCheck size={23} /></span>
        <p className="eyebrow">Privacy and legal</p>
        <h1>Your plans remain yours.</h1>
        <p>
          GoUG uses only the information needed to keep your account, saved
          places and trip requests working.
        </p>
      </header>
      <section>
        <h2>Information we use</h2>
        <p>
          Firebase Authentication processes your email address and account
          identifier when you sign in. GoUG stores saved places, itinerary
          choices, requests, messages and reviews that you choose to create.
        </p>
        <p>
          The map asks for approximate location only after you tap its location
          button. GoUG uses it to centre the map and does not store it or track
          location in the background.
        </p>
      </section>
      <section>
        <h2>How it is protected</h2>
        <p>
          Firebase security rules restrict access to account data. GoUG does
          not sell personal information, and payments are not collected in this
          version.
        </p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p>
          Discovery works without an account. You can remove account data from
          Profile or contact support with a privacy request.
        </p>
        <p>
          To request deletion outside the app, email{" "}
          <a href="mailto:92t.hillary@gmail.com?subject=GoUG%20account%20deletion">
            92t.hillary@gmail.com
          </a>{" "}
          from the address attached to your GoUG account.
        </p>
      </section>
      <p className="info-page__updated">Effective 30 July 2026</p>
    </div>
  );
}
