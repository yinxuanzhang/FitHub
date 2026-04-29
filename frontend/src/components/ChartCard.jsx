export default function ChartCard({ title, description, children }) {
  return (
    <section className="chart-card">
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </div>
      <div className="chart-wrap">{children}</div>
    </section>
  );
}
