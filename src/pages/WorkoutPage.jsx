import PageHeader from '../components/PageHeader';
import { workoutLogs } from '../data/mockData';

export default function WorkoutPage() {
  return (
    <>
      <PageHeader title="Workout Tracker" subtitle="Log your session and keep improving" />

      <section className="card">
        <h3>Add Exercise Record</h3>
        <form className="form-grid workout-form">
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
          <button type="button">Add Exercise</button>
        </form>
      </section>

      <section className="card">
        <h3>Today's Workout Records</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Exercise</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {workoutLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.exercise}</td>
                  <td>{log.sets}</td>
                  <td>{log.reps}</td>
                  <td>{log.weight} lbs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="complete-btn">
          Workout Completed ✅
        </button>
      </section>
    </>
  );
}
