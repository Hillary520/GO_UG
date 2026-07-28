import { ArrowRight } from "lucide-react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  action?: string;
  onAction?: () => void;
};

export function SectionHeading({
  eyebrow,
  title,
  action,
  onAction
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {action && (
        <button className="text-button" onClick={onAction}>
          {action}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
