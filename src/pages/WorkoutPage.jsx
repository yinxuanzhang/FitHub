import PageHeader from '../components/PageHeader';
import { workoutLogs } from '../data/mockData';

export default function WorkoutPage() {
  const totalVolume = workoutLogs.reduce(
    (acc, log) => acc + log.sets * log.reps * log.weight,
    0
  );
  const totalSets = workoutLogs.reduce((acc, log) => acc + log.sets, 0);

  return (
    <>
      <PageHeader title="Workout Tracker" subtitle="Log your session and keep improving" />

      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <article className="card stat-card">
          <p className="card-label">Total Volume</p>
          <div className="stat-value">{(totalVolume / 1000).toFixed(1)}k</div>
          <p className="card-hint">lbs lifted</p>
        </article>
        <article className="card stat-card">
          <p className="card-label">Exercises</p>
          <div className="stat-value">{workoutLogs.length}</div>
          <p className="card-hint">movements logged</p>
        </article>
        <article className="card stat-card">
          <p className="card-label">Total Sets</p>
          <div className="stat-value">{totalSets}</div>
          <p className="card-hint">sets completed</p>
        </article>
      </section>

      <article className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Log Exercise
        </h3>
        <form className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <label>
            Exercise Name
            <input type="text" placeholder="e.g., Pull-up" />
          </label>
          <label>
            Sets
            <input type="number" placeholder="0" />
          </label>
          <label>
            Reps
            <input type="number" placeholder="0" />
          </label>
          <label>
            Weight (lbs)
            <input type="number" placeholder="0" />
          </label>
          <label style={{ alignSelf: 'end' }}>
            &nbsp;
            <button type="button">Add Exercise</button>
          </label>
        </form>
      </article>

      <article className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Today&apos;s Session
        </h3>
        <div className="exercise-grid">
          {workoutLogs.map((log, i) => (
            <div
              key={log.id}
              className="exercise-card"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <p className="exercise-name">{log.exercise}</p>
              <div className="exercise-stats">
                <div className="exercise-stat">
                  <span className="exercise-stat-value">{log.sets}</span>
                  <span className="exercise-stat-label">Sets</span>
                </div>
                <div className="exercise-stat">
                  <span className="exercise-stat-value">{log.reps}</span>
                  <span className="exercise-stat-label">Reps</span>
                </div>
                <div className="exercise-stat">
                  <span className="exercise-stat-value" style={{ color: '#4f8ef7' }}>
                    {log.weight}
                  </span>
                  <span className="exercise-stat-label">lbs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="complete-btn">
          ✓ &nbsp;Workout Complete
        </button>
      </article>
    </>
  );
}
