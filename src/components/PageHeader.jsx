export default function PageHeader({ title, subtitle, actions, gradient = false }) {
  return (
    <header className="page-header">
      <div>
        <h1>
          {gradient ? <span className="gradient-text">{title}</span> : title}
        </h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="header-actions">{actions}</div>}
    </header>
  );
}
