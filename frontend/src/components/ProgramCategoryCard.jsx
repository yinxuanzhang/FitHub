import { calculateCategoryVolume, calculateExerciseVolume, formatNumber } from "../utils/fitness.js";

export default function ProgramCategoryCard({ category }) {
  return (
    <section className="program-category-card">
      <div className="category-heading">
        <div>
          <span className="eyebrow">Training category</span>
          <h2>{category.name}</h2>
        </div>
        <div className="volume-pill">
          <span>Category volume</span>
          <strong>{formatNumber(calculateCategoryVolume(category))} lb</strong>
        </div>
      </div>

      <div className="exercise-list compact">
        {category.exercises.length === 0 && <p className="muted-copy">No exercises in this category yet.</p>}
        {category.exercises.map((exercise) => (
          <article className="program-exercise" key={exercise.id}>
            <div className="exercise-header">
              <div>
                <h3>{exercise.name}</h3>
                <p>{exercise.notes}</p>
              </div>
              <span>{formatNumber(calculateExerciseVolume(exercise))} lb</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Set</th>
                    <th>Reps</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {exercise.sets.map((set, index) => (
                    <tr key={`${exercise.id}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{set.reps}</td>
                      <td>{set.weight} lb</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
