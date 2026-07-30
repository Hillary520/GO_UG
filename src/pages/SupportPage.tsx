import { ArrowLeft, CircleHelp, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useApp } from "@/context/AppContext";
import { useSmartBack } from "@/lib/useSmartBack";

export function SupportPage() {
  const goBack = useSmartBack("/profile");
  const { submitSupportTicket, supportTickets } = useApp();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await submitSupportTicket(subject, message);
    setSubject("");
    setMessage("");
  };

  return (
    <div className="page info-page support-page">
      <button className="info-page__back" onClick={goBack}>
        <ArrowLeft size={18} />
        Back
      </button>
      <header>
        <span><CircleHelp size={23} /></span>
        <p className="eyebrow">Help and support</p>
        <h1>How can we help?</h1>
        <p>Send a question about a trip, guide, place or your account.</p>
      </header>
      <form className="request-form" onSubmit={(event) => void submit(event)}>
        <label className="field">
          <span>Subject</span>
          <span className="field__input-wrap">
            <CircleHelp size={18} />
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="What do you need help with?"
              required
            />
          </span>
        </label>
        <label className="field">
          <span>Message</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Share the details"
            required
          />
        </label>
        <button className="button button--dark button--full">
          <Send size={17} />
          Send request
        </button>
      </form>
      {supportTickets.length > 0 && (
        <section>
          <h2>Your requests</h2>
          {supportTickets.map((ticket) => (
            <article className="support-ticket" key={ticket.id}>
              <span>{ticket.status}</span>
              <strong>{ticket.subject}</strong>
              <p>{ticket.message}</p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
