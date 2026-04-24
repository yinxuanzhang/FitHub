import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import { foodLogs, nutritionGoals } from '../data/mockData';

const MACRO_CONFIG = [
  { key: 'calories', label: 'Cal', strokeColor: '#efefef', unit: 'kcal' },
  { key: 'protein', label: 'Pro', strokeColor: '#aaa', unit: 'g' },
  { key: 'carbs', label: 'Carb', strokeColor: '#777', unit: 'g' },
  { key: 'fat', label: 'Fat', strokeColor: '#555', unit: 'g' },
];

function MacroRing({ label, current, target, strokeColor, unit }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, current / target);
  const offset = circ * (1 - pct);
  const pctLabel = Math.round(pct * 100);

  return (
    <div className="card macro-ring-card">
      <div className="macro-ring" style={{ width: 80, height: 80 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="#222" strokeWidth="5" />
          <circle
            cx="40" cy="40" r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="macro-ring-label">
          <span className="macro-ring-pct">{pctLabel}%</span>
          <span className="macro-ring-name">{label}</span>
        </div>
      </div>
      <div className="macro-ring-info">
        <div className="macro-ring-current">
          {current}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.75em' }}>
            /{target}
          </span>
        </div>
        <div className="macro-ring-target">{unit}</div>
      </div>
    </div>
  );
}

export default function DietPage() {
  return (
    <>
      <PageHeader title="Diet Tracker" subtitle="Stay on top of your nutrition goals" />

      <section className="macro-rings">
        {MACRO_CONFIG.map(({ key, label, strokeColor, unit }) => (
          <MacroRing
            key={key}
            label={label}
            current={nutritionGoals[key].consumed}
            target={nutritionGoals[key].target}
            strokeColor={strokeColor}
            unit={unit}
          />
        ))}
      </section>

      <section className="two-col">
        <article className="card">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Daily Goals
          </h3>
          <form className="form-grid">
            <label>
              Calories
              <input type="number" defaultValue={nutritionGoals.calories.target} />
            </label>
            <label>
              Protein (g)
              <input type="number" defaultValue={nutritionGoals.protein.target} />
            </label>
            <label>
              Carbs (g)
              <input type="number" defaultValue={nutritionGoals.carbs.target} />
            </label>
            <label>
              Fat (g)
              <input type="number" defaultValue={nutritionGoals.fat.target} />
            </label>
            <button type="button">Save Goals</button>
          </form>
        </article>

        <article className="card">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Log Food
          </h3>
          <form className="form-grid">
            <label>
              Food / Meal
              <input type="text" placeholder="e.g., Grilled chicken bowl" />
            </label>
            <label>
              Calories
              <input type="number" placeholder="0" />
            </label>
            <label>
              Protein (g)
              <input type="number" placeholder="0" />
            </label>
            <label>
              Carbs (g)
              <input type="number" placeholder="0" />
            </label>
            <label>
              Fat (g)
              <input type="number" placeholder="0" />
            </label>
            <button type="button">Add Food</button>
          </form>
        </article>
      </section>

      <article className="card">
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Today&apos;s Nutrition
        </h3>
        <div className="progress-stack">
          <ProgressBar label="Calories" {...nutritionGoals.calories} color="#efefef" />
          <ProgressBar label="Protein" {...nutritionGoals.protein} color="#aaa" />
          <ProgressBar label="Carbs" {...nutritionGoals.carbs} color="#777" />
          <ProgressBar label="Fat" {...nutritionGoals.fat} color="#555" />
        </div>
      </article>

      <article className="card">
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Today&apos;s Food Log</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Meal</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fat</th>
              </tr>
            </thead>
            <tbody>
              {foodLogs.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{entry.time}</td>
                  <td style={{ fontWeight: 600 }}>{entry.meal}</td>
                  <td>
                    <span className="badge">{entry.calories}</span>
                  </td>
                  <td>{entry.protein}g</td>
                  <td>{entry.carbs}g</td>
                  <td>{entry.fat}g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="complete-btn">
          Mark Diet Complete
        </button>
      </article>
    </>
  );
}
