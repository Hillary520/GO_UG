import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="not-found">
      <span>404</span>
      <h1>This trail isn't on our map.</h1>
      <p>Let's get you back to Uganda's best stories.</p>
      <Link to="/" className="button button--dark">
        Return to Discover
      </Link>
    </div>
  );
}
