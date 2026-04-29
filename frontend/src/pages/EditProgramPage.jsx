import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useProgram } from "../context/ProgramContext.jsx";

const blankSet = () => ({ reps: "", weight: "" });
const blankExercise = () => ({
  id: crypto.randomUUID(),
  name: "",
  notes: "",
  sets: [blankSet()]
});

const blankCategory = () => ({
  id: crypto.randomUUID(),
  name: "",
  exercises: [blankExercise()]
});

export default function EditProgramPage() {
  const navigate = useNavigate();
  const { currentVersion, createProgramVersion, cloneCurrentVersion } = useProgram();
  const [snapshot, setSnapshot] = useState(() => cloneCurrentVersion());
  const [changeSummary, setChangeSummary] = useState("");

  function updateCategory(categoryId, field, value) {
    setSnapshot((current) => ({
      ...current,
      categories: current.categories.map((category) => (category.id === categoryId ? { ...category, [field]: value } : category))
    }));
  }

  function addCategory() {
    setSnapshot((current) => ({ ...current, categories: [...current.categories, blankCategory()] }));
  }

  function removeCategory(categoryId) {
    setSnapshot((current) => ({
      ...current,
      categories: current.categories.length === 1 ? current.categories : current.categories.filter((category) => category.id !== categoryId)
    }));
  }

  function updateExercise(categoryId, exerciseId, field, value) {
    setSnapshot((current) => ({
      ...current,
      categories: current.categories.map((category) => {
        if (category.id !== categoryId) return category;
        return {
          ...category,
          exercises: category.exercises.map((exercise) => (exercise.id === exerciseId ? { ...exercise, [field]: value } : exercise))
        };
      })
    }));
  }

  function addExercise(categoryId) {
    setSnapshot((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === categoryId ? { ...category, exercises: [...category.exercises, blankExercise()] } : category
      )
    }));
  }

  function removeExercise(categoryId, exerciseId) {
    setSnapshot((current) => ({
      ...current,
      categories: current.categories.map((category) => {
        if (category.id !== categoryId) return category;
        return {
          ...category,
          exercises: category.exercises.length === 1 ? category.exercises : category.exercises.filter((exercise) => exercise.id !== exerciseId)
        };
      })
    }));
  }

  function updateSet(categoryId, exerciseId, setIndex, field, value) {
    setSnapshot((current) => ({
      ...current,
      categories: current.categories.map((category) => {
        if (category.id !== categoryId) return category;
        return {
          ...category,
          exercises: category.exercises.map((exercise) => {
            if (exercise.id !== exerciseId) return exercise;
            const sets = exercise.sets.map((set, index) => (index === setIndex ? { ...set, [field]: value } : set));
            return { ...exercise, sets };
          })
        };
      })
    }));
  }

  function addSet(categoryId, exerciseId) {
    setSnapshot((current) => ({
      ...current,
      categories: current.categories.map((category) => {
        if (category.id !== categoryId) return category;
        return {
          ...category,
          exercises: category.exercises.map((exercise) =>
            exercise.id === exerciseId ? { ...exercise, sets: [...exercise.sets, blankSet()] } : exercise
          )
        };
      })
    }));
  }

  function removeSet(categoryId, exerciseId, setIndex) {
    setSnapshot((current) => ({
      ...current,
      categories: current.categories.map((category) => {
        if (category.id !== categoryId) return category;
        return {
          ...category,
          exercises: category.exercises.map((exercise) => {
            if (exercise.id !== exerciseId || exercise.sets.length === 1) return exercise;
            return { ...exercise, sets: exercise.sets.filter((_, index) => index !== setIndex) };
          })
        };
      })
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    createProgramVersion(snapshot, changeSummary);
    navigate("/program");
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={`Editing from version ${currentVersion.versionNumber}`}
        title="Edit program"
        description="Saving creates a new program version while preserving every previous snapshot."
        actions={<Link className="button secondary" to="/program">Cancel</Link>}
      />

      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Change summary
          <textarea
            value={changeSummary}
            onChange={(event) => setChangeSummary(event.target.value)}
            placeholder="What changed in this version? Example: increased bench load, replaced a shoulder exercise"
          />
        </label>

        <div className="form-section-title">
          <h2>Training categories</h2>
          <button className="button secondary" type="button" onClick={addCategory}>Add category</button>
        </div>

        {snapshot.categories.map((category, categoryIndex) => (
          <section className="nested-form program-editor-category" key={category.id}>
            <div className="exercise-form-title">
              <h3>Category {categoryIndex + 1}</h3>
              <button className="text-button" type="button" onClick={() => removeCategory(category.id)}>Remove category</button>
            </div>
            <label>
              Category name
              <input value={category.name} onChange={(event) => updateCategory(category.id, "name", event.target.value)} placeholder="Chest" />
            </label>

            <div className="sets-header">
              <span>Exercises</span>
              <button className="text-button" type="button" onClick={() => addExercise(category.id)}>Add exercise</button>
            </div>

            {category.exercises.map((exercise, exerciseIndex) => (
              <section className="nested-form exercise-editor" key={exercise.id}>
                <div className="exercise-form-title">
                  <h4>Exercise {exerciseIndex + 1}</h4>
                  <button className="text-button" type="button" onClick={() => removeExercise(category.id, exercise.id)}>Remove</button>
                </div>
                <label>
                  Exercise name
                  <input value={exercise.name} onChange={(event) => updateExercise(category.id, exercise.id, "name", event.target.value)} placeholder="Barbell Bench Press" />
                </label>
                <label>
                  Notes
                  <textarea value={exercise.notes} onChange={(event) => updateExercise(category.id, exercise.id, "notes", event.target.value)} placeholder="Technique, effort, or setup notes" />
                </label>
                <div className="sets-header">
                  <span>Sets</span>
                  <button className="text-button" type="button" onClick={() => addSet(category.id, exercise.id)}>Add set</button>
                </div>
                {exercise.sets.map((set, setIndex) => (
                  <div className="set-row" key={`${exercise.id}-${setIndex}`}>
                    <span>{setIndex + 1}</span>
                    <input inputMode="numeric" value={set.reps} onChange={(event) => updateSet(category.id, exercise.id, setIndex, "reps", event.target.value)} placeholder="Reps" />
                    <input inputMode="decimal" value={set.weight} onChange={(event) => updateSet(category.id, exercise.id, setIndex, "weight", event.target.value)} placeholder="Weight" />
                    <button className="text-button" type="button" onClick={() => removeSet(category.id, exercise.id, setIndex)}>Remove</button>
                  </div>
                ))}
              </section>
            ))}
          </section>
        ))}

        <button className="button primary submit-button" type="submit">Save as new version</button>
      </form>
    </div>
  );
}
