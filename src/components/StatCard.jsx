export default function StatCard({ title, value, hint }) {
  return (
    <article className="card stat-card">
      <p className="card-label">{title}</p>
      <h3>{value}</h3>
      {hint && <p className="card-hint">{hint}</p>}
    </article>
  );
}
