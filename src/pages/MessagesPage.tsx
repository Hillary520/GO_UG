import { ArrowLeft, Send } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useSmartBack } from "@/lib/useSmartBack";

export function MessagesPage() {
  const { id } = useParams();
  const goBack = useSmartBack(`/guides/${id}`);
  const { guideItems, messages, sendMessage } = useApp();
  const guide = guideItems.find((item) => item.id === id);
  const [text, setText] = useState("");
  const thread = useMemo(
    () => messages.filter((message) => message.guideId === id),
    [id, messages]
  );

  if (!guide) return <div className="not-found">Guide not found.</div>;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const next = text.trim();
    if (!next) return;
    setText("");
    await sendMessage(guide.id, next);
  };

  return (
    <div className="message-page">
      <header>
        <button className="icon-button" onClick={goBack} aria-label="Go back">
          <ArrowLeft size={19} />
        </button>
        <img src={guide.image} alt="" />
        <span>
          <strong>{guide.name}</strong>
          <small>Verified local guide</small>
        </span>
      </header>
      <main>
        <div className="message-bubble message-bubble--guide">
          Hi, I’m {guide.name.split(" ")[0]}. Tell me the kind of Uganda
          experience you’re hoping for and the dates you have in mind.
        </div>
        {thread.map((message) => (
          <div
            key={message.id}
            className={`message-bubble message-bubble--${message.sender}`}
          >
            {message.text}
          </div>
        ))}
      </main>
      <form onSubmit={(event) => void submit(event)}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={`Message ${guide.name.split(" ")[0]}`}
          aria-label="Message"
        />
        <button className="icon-button icon-button--dark" aria-label="Send message">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
