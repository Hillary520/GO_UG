import { ArrowRight } from "lucide-react";
import { Brand } from "@/components/Brand";

type OnboardingProps = {
  onExplore: () => void;
  onSignIn: () => void;
};

export function Onboarding({ onExplore, onSignIn }: OnboardingProps) {
  return (
    <section className="onboarding" aria-labelledby="welcome-title">
      <div className="onboarding__image" aria-hidden="true" />
      <div className="onboarding__shade" aria-hidden="true" />
      <header className="onboarding__header">
        <Brand />
        <span className="onboarding__country">UG</span>
      </header>
      <div className="onboarding__copy">
        <p className="eyebrow eyebrow--light">Uganda, thoughtfully explored</p>
        <h1 id="welcome-title">
          The stories are
          <br />
          closer than you think.
        </h1>
        <p>
          Find remarkable places, trusted local guides and the meals worth
          crossing town for.
        </p>
        <div className="onboarding__actions">
          <button className="button button--sun button--large" onClick={onExplore}>
            Explore Uganda
            <ArrowRight size={19} />
          </button>
          <button className="button button--glass" onClick={onSignIn}>
            Sign in or create account
          </button>
        </div>
      </div>
      <p className="onboarding__hint">Swipe into the Pearl of Africa</p>
    </section>
  );
}
