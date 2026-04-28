import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import TabBar from '../components/TabBar';
import { useAppData } from '../context/AppDataContext';

const MUSCLE_GROUPS = [
  { value: 'chest',      label: 'Chest' },
  { value: 'shoulders',  label: 'Shoulders' },
  { value: 'back',       label: 'Back' },
  { value: 'arms',       label: 'Arms' },
  { value: 'legsglutes', label: 'Legs & Glutes' },
  { value: 'cardio',     label: 'Cardio' },
  { value: 'rest',       label: 'Rest' },
];

const TRAINING_GROUPS = MUSCLE_GROUPS.filter(g => g.value !== 'rest');

const MUSCLE_COLORS = {
  chest:      '#e8724a',
  shoulders:  '#7b6cf0',
  back:       '#4a9cf0',
  arms:       '#50c878',
  legsglutes: '#f0a84a',
  cardio:     '#f05a8a',
  rest:       '#aaaaaa',
};

const MUSCLE_LABEL = Object.fromEntries(MUSCLE_GROUPS.map(g => [g.value, g.label]));

const TABS = [
  { id: 'plan',  label: 'Exercises' },
  { id: 'today', label: 'Today' },
];

function todayKey() { return new Date().toISOString().slice(0, 10); }

// ── Shared small components ───────────────────────────────────────────
function ExerciseForm({
  initialExercise,
  variant = 'strength',
  onSubmit,
  onCancel,
  submitLabel = 'Add',
  className = 'inline-exercise-form',
}) {
  const [form, setForm] = useState(() => ({
    name: initialExercise?.name || '',
    sets: initialExercise?.sets?.toString() || '',
    reps: initialExercise?.reps?.toString() || '',
    weight: initialExercise?.weight?.toString() || '',
    duration: initialExercise?.duration?.toString() || '',
    intensity: initialExercise?.intensity || '',
  }));
  const [unit, setUnit] = useState(initialExercise?.unit || 'kg');
  const isCardio = variant === 'cardio';

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const baseExercise = {
      id: initialExercise?.id || Date.now().toString(),
      name: form.name.trim(),
    };
    onSubmit(isCardio ? {
      ...baseExercise,
      duration: parseInt(form.duration) || 0,
      intensity: form.intensity.trim(),
    } : {
      ...baseExercise,
      sets: parseInt(form.sets) || 0,
      reps: parseInt(form.reps) || 0,
      weight: parseFloat(form.weight) || 0,
      unit,
    });
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      <input
        className="iex-name"
        type="text"
        placeholder="Exercise name"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        autoFocus
      />
      {isCardio ? (
        <>
          <input
            className="iex-num"
            type="number"
            placeholder="Minutes"
            min="0"
            value={form.duration}
            onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
          />
          <input
            className="iex-intensity"
            type="text"
            placeholder="Intensity"
            value={form.intensity}
            onChange={e => setForm(f => ({ ...f, intensity: e.target.value }))}
          />
        </>
      ) : (
        <>
          <input
            className="iex-num"
            type="number"
            placeholder="Sets"
            min="0"
            value={form.sets}
            onChange={e => setForm(f => ({ ...f, sets: e.target.value }))}
          />
          <input
            className="iex-num"
            type="number"
            placeholder="Reps"
            min="0"
            value={form.reps}
            onChange={e => setForm(f => ({ ...f, reps: e.target.value }))}
          />
          <input
            className="iex-num"
            type="number"
            placeholder="Weight"
            min="0"
            step="0.5"
            value={form.weight}
            onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
          />
          <div className="unit-toggle">
            <button type="button" className={`unit-btn${unit === 'kg' ? ' unit-btn--active' : ''}`} onClick={() => setUnit('kg')}>kg</button>
            <button type="button" className={`unit-btn${unit === 'lbs' ? ' unit-btn--active' : ''}`} onClick={() => setUnit('lbs')}>lbs</button>
          </div>
        </>
      )}
      <button type="submit">{submitLabel}</button>
      {onCancel && (
        <button type="button" className="ghost-btn" onClick={onCancel}>Cancel</button>
      )}
    </form>
  );
}

function ExerciseRow({ ex, onRemove, onUpdate, variant = 'strength' }) {
  const [isEditing, setIsEditing] = useState(false);
  const isCardio = variant === 'cardio';

  if (isEditing) {
    return (
      <ExerciseForm
        initialExercise={ex}
        variant={variant}
        submitLabel="Save"
        className="inline-exercise-form exercise-edit-form"
        onSubmit={updated => {
          onUpdate(updated);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="exercise-row">
      <div className="exercise-row-body">
        <span className="exercise-row-name">{ex.name}</span>
        <div className="exercise-row-stats">
          {isCardio ? (
            <>
              <span className="exercise-row-stat">
                <strong>{ex.duration || 0}</strong>
                <span className="exercise-row-unit">min</span>
              </span>
              {ex.intensity && (
                <>
                  <span className="exercise-row-sep">·</span>
                  <span className="exercise-row-stat">
                    <strong>{ex.intensity}</strong>
                  </span>
                </>
              )}
            </>
          ) : (
            <>
              <span className="exercise-row-stat">
                <strong>{ex.sets}</strong>
                <span className="exercise-row-unit">sets</span>
              </span>
              <span className="exercise-row-sep">×</span>
              <span className="exercise-row-stat">
                <strong>{ex.reps}</strong>
                <span className="exercise-row-unit">reps</span>
              </span>
              <span className="exercise-row-sep">·</span>
              <span className="exercise-row-stat">
                <strong>{ex.weight}</strong>
                <span className="exercise-row-unit">{ex.unit}</span>
              </span>
            </>
          )}
        </div>
      </div>
      {(onUpdate || onRemove) && (
        <div className="exercise-row-actions">
          {onUpdate && (
            <button type="button" className="exercise-edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
          )}
          {onRemove && (
            <button type="button" className="exercise-delete-btn" onClick={() => onRemove(ex.id)}>×</button>
          )}
        </div>
      )}
    </div>
  );
}

function AddExerciseForm({ onAdd, variant = 'strength' }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        className="ghost-btn add-exercise-trigger"
        onClick={() => setOpen(true)}
      >
        + Add Exercise
      </button>
    );
  }

  return (
    <ExerciseForm
      submitLabel="Add"
      variant={variant}
      onSubmit={ex => {
        onAdd(ex);
        setOpen(false);
      }}
      onCancel={() => setOpen(false)}
    />
  );
}

// ── Main page ─────────────────────────────────────────────────────────
export default function WorkoutPage() {
  const {
    workoutPlan,
    workoutRoutines, setWorkoutRoutines,
    workoutDailyFocus, setWorkoutDailyFocus,
    workoutCheckIns, setWorkoutCheckIns,
  } = useAppData();

  const [tab, setTab] = useState('plan');

  const today = todayKey();
  const todayDow = new Date().getDay();
  const isCheckedIn = workoutCheckIns.includes(today);

  function legacyExercisesForGroup(group) {
    return Object.values(workoutPlan).flatMap(d => d.exercisesByGroup?.[group] || []);
  }

  function getRoutineExercises(group) {
    const saved = workoutRoutines?.[group] || [];
    return saved.length > 0 ? saved : legacyExercisesForGroup(group);
  }

  const legacyTodayFocus = workoutPlan[todayDow]?.muscleGroups || [];
  const todayFocus = workoutDailyFocus[today] || legacyTodayFocus;

  function toggleTodayFocus(group) {
    const current = todayFocus || [];

    let nextGroups;
    if (group === 'rest') {
      nextGroups = ['rest'];
    } else {
      const nonRest = current.filter(g => g !== 'rest');
      const isOn = nonRest.includes(group);
      nextGroups = isOn
        ? nonRest.filter(g => g !== group)
        : [...nonRest, group];
      if (nextGroups.length === 0) nextGroups = ['rest'];
    }

    setWorkoutDailyFocus(prev => ({
      ...prev,
      [today]: nextGroups,
    }));
  }

  function addExerciseToRoutine(group, ex) {
    setWorkoutRoutines(prev => ({
      ...prev,
      [group]: [...getRoutineExercises(group), ex],
    }));
  }

  function removeExerciseFromRoutine(group, id) {
    setWorkoutRoutines(prev => ({
      ...prev,
      [group]: getRoutineExercises(group).filter(e => e.id !== id),
    }));
  }

  function updateExerciseInRoutine(group, updatedExercise) {
    setWorkoutRoutines(prev => ({
      ...prev,
      [group]: getRoutineExercises(group).map(ex =>
        ex.id === updatedExercise.id ? updatedExercise : ex
      ),
    }));
  }

  function checkIn() {
    if (!isCheckedIn) setWorkoutCheckIns(prev => [...prev, today]);
  }

  const todayIsRest = todayFocus.includes('rest') || todayFocus.length === 0;
  const todayActiveGroups = todayIsRest ? [] : todayFocus;

  return (
    <div className="workout-page">
      <PageHeader title="Workout" subtitle="Plan and track your training" />

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {/* ── PLAN TAB ── */}
      {tab === 'plan' && (
        <div className="workout-builder">
          <div className="workout-builder-head">
            <div>
              <h3 className="card-section-title">Training Library</h3>
              <p className="workout-builder-subtitle">All body parts and exercises in one list.</p>
            </div>
          </div>

          <div className="routine-list">
            {TRAINING_GROUPS.map(({ value, label }) => {
              const exercises = getRoutineExercises(value);
              return (
                <article key={value} className="card routine-section">
                  <div className="routine-section-header">
                    <div className="exercise-group-header">
                      <span className="exercise-group-dot" style={{ background: MUSCLE_COLORS[value] }} />
                      <span style={{ color: MUSCLE_COLORS[value], fontWeight: 700 }}>
                        {label}
                      </span>
                      <span className="exercise-group-count">
                        {exercises.length} exercises
                      </span>
                    </div>
                  </div>

                  {exercises.map(ex => (
                    <ExerciseRow
                      key={ex.id}
                      ex={ex}
                      variant={value === 'cardio' ? 'cardio' : 'strength'}
                      onRemove={id => removeExerciseFromRoutine(value, id)}
                      onUpdate={updated => updateExerciseInRoutine(value, updated)}
                    />
                  ))}

                  {exercises.length === 0 && (
                    <p className="week-plan-no-ex">No exercises yet.</p>
                  )}

                  <AddExerciseForm
                    variant={value === 'cardio' ? 'cardio' : 'strength'}
                    onAdd={ex => addExerciseToRoutine(value, ex)}
                  />
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TODAY TAB ── */}
      {tab === 'today' && (
        <>
          {/* Banner */}
          <div className="card today-banner">
            <div className="today-banner-info">
              <p className="card-label">Today&apos;s Focus</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {todayIsRest
                  ? <span className="today-group-badge" style={{ background: '#f5f5f5', color: '#aaa', borderColor: '#ddd' }}>Rest Day</span>
                  : todayActiveGroups.map(g => (
                    <span
                      key={g}
                      className="today-group-badge"
                      style={{ background: MUSCLE_COLORS[g] + '22', color: MUSCLE_COLORS[g], borderColor: MUSCLE_COLORS[g] + '55' }}
                    >
                      {MUSCLE_LABEL[g]}
                    </span>
                  ))
                }
              </div>
            </div>
            {isCheckedIn && <div className="checkin-done">✓ Logged</div>}
          </div>

          <article className="card today-focus-card">
            <h3 className="card-section-title" style={{ marginBottom: '0.875rem' }}>Choose Today</h3>
            <div className="workout-focus-picker">
              {MUSCLE_GROUPS.map(({ value, label }) => {
                const active = todayFocus.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    className={`muscle-tag-btn${active ? ' muscle-tag-btn--active' : ''}`}
                    style={active ? {
                      background: MUSCLE_COLORS[value] + '22',
                      color: MUSCLE_COLORS[value],
                      borderColor: MUSCLE_COLORS[value] + '66',
                    } : {}}
                    onClick={() => toggleTodayFocus(value)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </article>

          {/* Plan exercises grouped by muscle group */}
          {!todayIsRest && todayActiveGroups.length > 0 && (
            <article className="card">
              <h3 className="card-section-title" style={{ marginBottom: '1rem' }}>Today&apos;s Plan</h3>
              {todayActiveGroups.map(group => {
                const exList = getRoutineExercises(group);
                return (
                  <div key={group} className="exercise-group-section">
                    <div className="exercise-group-header">
                      <span className="exercise-group-dot" style={{ background: MUSCLE_COLORS[group] }} />
                      <span style={{ color: MUSCLE_COLORS[group], fontWeight: 700 }}>{MUSCLE_LABEL[group]}</span>
                    </div>
                    {exList.length > 0
                      ? exList.map(ex => (
                        <ExerciseRow
                          key={ex.id}
                          ex={ex}
                          variant={group === 'cardio' ? 'cardio' : 'strength'}
                          onRemove={null}
                        />
                      ))
                      : <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', padding: '0.25rem 0 0.5rem' }}>No exercises set in plan.</p>
                    }
                  </div>
                );
              })}
            </article>
          )}

          <article className="card">
            <button
              type="button"
              className={`complete-btn${isCheckedIn ? ' complete-btn--done' : ''}`}
              onClick={checkIn}
              disabled={isCheckedIn}
              style={{ marginTop: '1.25rem' }}
            >
              {isCheckedIn ? '✓ Workout Logged' : '✓ Mark Workout Complete'}
            </button>
          </article>
        </>
      )}

    </div>
  );
}
