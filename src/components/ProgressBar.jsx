export default function ProgressBar({ label, current, target, unit = '', color = '#00ff87' }) {
  const progress = Math.min(100, Math.round((current / target) * 100));

  return (
    <div className="progress-item">
      <div className="progress-head">
        <p>{label}</p>
        <span>
          {current} / {target} {unit}
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
            background: color,
            boxShadow: `0 0 8px ${color}88`,
          }}
        />
      </div>
    </div>
  );
}
