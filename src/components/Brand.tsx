import { Link } from "react-router-dom";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="brand" aria-label="GoUG home">
      <span className="brand__mark" aria-hidden="true">
        <span />
      </span>
      <span className="brand__text">
        <strong>GoUG</strong>
        {!compact && <small>Uganda in your pocket</small>}
      </span>
    </Link>
  );
}
