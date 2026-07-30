import { ArrowLeft, CalendarDays, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useSmartBack } from "@/lib/useSmartBack";

export function RequestPage() {
  const { kind, id } = useParams();
  const navigate = useNavigate();
  const goBack = useSmartBack(kind === "guide" ? `/guides/${id}` : `/places/${id}`);
  const { catalogItems, guideItems, createBooking } = useApp();
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const entity =
    kind === "guide"
      ? guideItems.find((guide) => guide.id === id)
      : catalogItems.find((item) => item.id === id);

  if (!entity || (kind !== "guide" && kind !== "place")) {
    return <div className="not-found">We couldn’t find that request.</div>;
  }

  const title = "name" in entity ? entity.name : entity.title;
  const today = new Date().toISOString().slice(0, 10);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    await createBooking({
      kind,
      entityId: entity.id,
      title,
      date,
      guests,
      notes
    });
    setBusy(false);
    navigate("/trips", { replace: true });
  };

  return (
    <div className="page form-page">
      <button className="info-page__back" onClick={goBack}>
        <ArrowLeft size={18} />
        Back
      </button>
      <header>
        <p className="eyebrow">No payment required</p>
        <h1>Request {kind === "guide" ? "a day with" : "availability for"} {title}</h1>
        <p>
          Share the essentials now. You can review or cancel the request from
          Trips.
        </p>
      </header>
      <form className="request-form" onSubmit={(event) => void submit(event)}>
        <label className="field">
          <span>Preferred date</span>
          <span className="field__input-wrap">
            <CalendarDays size={18} />
            <input
              type="date"
              min={today}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </span>
        </label>
        <label className="field">
          <span>Travellers</span>
          <span className="field__input-wrap">
            <Users size={18} />
            <input
              type="number"
              min={1}
              max={20}
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
              required
            />
          </span>
        </label>
        <label className="field">
          <span>Anything we should know?</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Interests, accessibility needs or timing preferences"
          />
        </label>
        <button className="button button--sun button--full" disabled={busy}>
          {busy ? "Saving request…" : "Save request"}
        </button>
      </form>
    </div>
  );
}
