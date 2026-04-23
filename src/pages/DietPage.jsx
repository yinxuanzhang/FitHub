import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import { foodLogs, nutritionGoals } from '../data/mockData';

export default function DietPage() {
  return (
    <>
      <PageHeader title="Diet Tracker" subtitle="Stay on top of your nutrition goals" />

      <section className="two-col">
        <article className="card">
          <h3>Daily Goal Setup</h3>
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
          <h3>Add Food Log</h3>
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

      <section className="card">
        <h3>Today's Nutrition Progress</h3>
        <div className="progress-stack">
          <ProgressBar label="Calories" {...nutritionGoals.calories} color="#6d5efc" />
          <ProgressBar label="Protein" {...nutritionGoals.protein} color="#0ea5e9" />
          <ProgressBar label="Carbs" {...nutritionGoals.carbs} color="#22c55e" />
          <ProgressBar label="Fat" {...nutritionGoals.fat} color="#f97316" />
        </div>
      </section>

      <section className="card">
        <h3>Today's Food Logs</h3>
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
                  <td>{entry.time}</td>
                  <td>{entry.meal}</td>
                  <td>{entry.calories}</td>
                  <td>{entry.protein}g</td>
                  <td>{entry.carbs}g</td>
                  <td>{entry.fat}g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="complete-btn">
          Diet Completed ✅
        </button>
      </section>
    </>
  );
}
