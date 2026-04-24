export default function StatCard({ title, value, hint }) {
  return (
    <article className="card stat-card">
      <p className="card-label">{title}</p>
      <div className="stat-value">{value}</div>
      {hint && <p className="card-hint">{hint}</p>}
    </article>
  );
}
