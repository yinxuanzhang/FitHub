import { Link } from 'react-router-dom';

const iconMap = {
  '/diet': '🥗',
  '/workout': '⚡',
  '/community': '◎',
};

export default function QuickLinkCard({ title, description, to }) {
  const icon = iconMap[to] ?? '→';

  return (
    <Link className="card quick-link" to={to}>
      <div className="quick-link-icon">{icon}</div>
      <h4>{title}</h4>
      <p>{description}</p>
      <span className="quick-link-arrow">
        Open
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </Link>
  );
}
