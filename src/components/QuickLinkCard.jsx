import { Link } from 'react-router-dom';

export default function QuickLinkCard({ title, description, to }) {
  return (
    <Link className="card quick-link" to={to}>
      <h4>{title}</h4>
      <p>{description}</p>
      <span>Open →</span>
    </Link>
  );
}
