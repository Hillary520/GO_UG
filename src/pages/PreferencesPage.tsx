import { ArrowLeft, Bell, Check, Coins, Languages, Sparkles } from "lucide-react";
import { categories } from "@/data/catalog";
import { useApp } from "@/context/AppContext";
import { useSmartBack } from "@/lib/useSmartBack";
import type { Category } from "@/types";

const interestCategories = categories.filter(
  (category) => category !== "All"
) as Category[];

export function PreferencesPage() {
  const goBack = useSmartBack("/profile");
  const { preferences, updatePreferences } = useApp();

  const toggleInterest = (category: Category) => {
    const interests = preferences.interests.includes(category)
      ? preferences.interests.filter((item) => item !== category)
      : [...preferences.interests, category];
    updatePreferences({ interests });
  };

  return (
    <div className="page info-page preferences-page">
      <button className="info-page__back" onClick={goBack}>
        <ArrowLeft size={18} />
        Back
      </button>
      <header>
        <span><Sparkles size={23} /></span>
        <p className="eyebrow">Make GoUG yours</p>
        <h1>Travel preferences</h1>
        <p>Choose how prices, ideas and useful reminders appear.</p>
      </header>
      <section>
        <h2><Languages size={19} /> Language</h2>
        <div className="choice-row">
          {(["English", "Luganda"] as const).map((language) => (
            <button
              key={language}
              className={preferences.language === language ? "is-active" : ""}
              onClick={() => updatePreferences({ language })}
            >
              {language}
              {preferences.language === language && <Check size={16} />}
            </button>
          ))}
        </div>
      </section>
      <section>
        <h2><Coins size={19} /> Currency</h2>
        <div className="choice-row">
          {(["UGX", "USD"] as const).map((currency) => (
            <button
              key={currency}
              className={preferences.currency === currency ? "is-active" : ""}
              onClick={() => updatePreferences({ currency })}
            >
              {currency}
              {preferences.currency === currency && <Check size={16} />}
            </button>
          ))}
        </div>
      </section>
      <section>
        <h2><Bell size={19} /> Notifications</h2>
        <button
          className={`preference-toggle ${
            preferences.notifications ? "is-active" : ""
          }`}
          onClick={() =>
            updatePreferences({ notifications: !preferences.notifications })
          }
        >
          <span>
            <strong>Trip reminders</strong>
            <small>Requests, confirmations and useful planning updates</small>
          </span>
          <i aria-hidden="true" />
        </button>
      </section>
      <section>
        <h2>Interests</h2>
        <div className="choice-row choice-row--wrap">
          {interestCategories.map((category) => (
              <button
                key={category}
                className={
                  preferences.interests.includes(category) ? "is-active" : ""
                }
                onClick={() => toggleInterest(category)}
              >
                {category}
              </button>
            ))}
        </div>
      </section>
    </div>
  );
}
