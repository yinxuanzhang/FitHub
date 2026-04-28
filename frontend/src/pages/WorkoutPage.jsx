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

const WEEK_ORDER = [
  { dow: 1, label: 'Mon' },
  { dow: 2, label: 'Tue' },
  { dow: 3, label: 'Wed' },
  { dow: 4, label: 'Thu' },
  { dow: 5, label: 'Fri' },
  { dow: 6, label: 'Sat' },
  { dow: 0, label: 'Sun' },
];

const TABS = [
  { id: 'plan',  label: 'Weekly Plan' },
  { id: 'today', label: 'Today' },
];

const EMPTY_DAY = { muscleGroups: [], exercisesByGroup: {} };

function todayKey() { return new Date().toISOString().slice(0, 10); }

// ── Shared small components ───────────────────────────────────────────
function ExerciseRow({ ex, onRemove }) {
  return (
    <div className="exercise-row">
      <div className="exercise-row-body">
        <span className="exercise-row-name">{ex.name}</span>
        <div className="exercise-row-stats">
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
        </div>
      </div>
      {onRemove && (
        <button type="button" className="exercise-delete-btn" onClick={() => onRemove(ex.id)}>×</button>
      )}
    </div>
  );
}

function AddExerciseForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', sets: '', reps: '', weight: '' });
  const [unit, setUnit] = useState('kg');

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd({
      id: Date.now().toString(),
      name: form.name.trim(),
      sets: parseInt(form.sets) || 0,
      reps: parseInt(form.reps) || 0,
      weight: parseFloat(form.weight) || 0,
      unit,
    });
    setForm({ name: '', sets: '', reps: '', weight: '' });
    setOpen(false);
  }

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
    <form className="inline-exercise-form" onSubmit={handleSubmit}>
      <input
        className="iex-name"
        type="text"
        placeholder="Exercise name"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        autoFocus
      />
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
      <button type="submit">Add</button>
      <button type="button" className="ghost-btn" onClick={() => setOpen(false)}>Cancel</button>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────────────
export default function WorkoutPage() {
  const {
    workoutPlan, setWorkoutPlan,
    workoutExtraLogs, setWorkoutExtraLogs,
    workoutCheckIns, setWorkoutCheckIns,
  } = useAppData();

  const [tab, setTab] = useState('plan');
  const [selectedPlanDay, setSelectedPlanDay] = useState(() => new Date().getDay());
  const [editingDay, setEditingDay] = useState(null); // null = edit panel closed

  function openEditDay(dow) {
    setSelectedPlanDay(dow);
    setEditingDay(prev => (prev === dow ? null : dow));
  }

  const today = todayKey();
  const todayDow = new Date().getDay();
  const todayPlan = workoutPlan[todayDow] || EMPTY_DAY;
  const todayExtra = workoutExtraLogs[today] || [];
  const isCheckedIn = workoutCheckIns.includes(today);

  // dayPlan is used by toggleMuscleGroup / add / remove helpers (keyed on selectedPlanDay)
  const dayPlan = workoutPlan[selectedPlanDay] || EMPTY_DAY;

  function toggleMuscleGroup(group) {
    const current = dayPlan.muscleGroups || [];

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

    setWorkoutPlan(prev => ({
      ...prev,
      [selectedPlanDay]: {
        muscleGroups: nextGroups,
        exercisesByGroup: prev[selectedPlanDay]?.exercisesByGroup || {},
      },
    }));
  }

  function addExerciseToGroup(group, ex) {
    setWorkoutPlan(prev => {
      const d = prev[selectedPlanDay] || EMPTY_DAY;
      return {
        ...prev,
        [selectedPlanDay]: {
          ...d,
          exercisesByGroup: {
            ...d.exercisesByGroup,
            [group]: [...(d.exercisesByGroup[group] || []), ex],
          },
        },
      };
    });
  }

  function removeExerciseFromGroup(group, id) {
    setWorkoutPlan(prev => {
      const d = prev[selectedPlanDay] || EMPTY_DAY;
      return {
        ...prev,
        [selectedPlanDay]: {
          ...d,
          exercisesByGroup: {
            ...d.exercisesByGroup,
            [group]: (d.exercisesByGroup[group] || []).filter(e => e.id !== id),
          },
        },
      };
    });
  }

  // ── Today tab ──────────────────────────────────────────────────────
  function addTodayExtra(ex) {
    setWorkoutExtraLogs(prev => ({ ...prev, [today]: [...(prev[today] || []), ex] }));
  }

  function removeTodayExtra(id) {
    setWorkoutExtraLogs(prev => ({
      ...prev,
      [today]: (prev[today] || []).filter(e => e.id !== id),
    }));
  }

  function checkIn() {
    if (!isCheckedIn) setWorkoutCheckIns(prev => [...prev, today]);
  }

  const todayIsRest = todayPlan.muscleGroups.includes('rest') || todayPlan.muscleGroups.length === 0;
  const todayActiveGroups = todayIsRest ? [] : todayPlan.muscleGroups;

  return (
    <>
      <PageHeader title="Workout" subtitle="Plan and track your training" />
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {/* ── PLAN TAB ── */}
      {tab === 'plan' && (
        <div className="week-plan-list">
          {WEEK_ORDER.map(({ dow, label }) => {
            const d = workoutPlan[dow] || EMPTY_DAY;
            const groups = (d.muscleGroups || []).filter(g => g !== 'rest');
            const isRest = d.muscleGroups.includes('rest') || d.muscleGroups.length === 0;
            const isEditing = editingDay === dow;

            // For edit panel, use selectedPlanDay data
            const ep = workoutPlan[dow] || EMPTY_DAY;
            const epIsRest = ep.muscleGroups.includes('rest') || ep.muscleGroups.length === 0;
            const epGroups = epIsRest ? [] : ep.muscleGroups;

            return (
              <div key={dow}>
                {/* ── Day overview card ── */}
                <article className={`card week-plan-day-card${isEditing ? ' week-plan-day-card--active' : ''}`}>
                  <div className="week-plan-day-header">
                    <div className="week-plan-day-left">
                      <span className="week-plan-day-name">{label}</span>
                      <div className="week-plan-day-tags">
                        {isRest
                          ? <span className="week-plan-rest-tag">Rest Day</span>
                          : groups.map(g => (
                            <span key={g} className="week-plan-group-pill"
                              style={{ background: MUSCLE_COLORS[g] + '20', color: MUSCLE_COLORS[g], borderColor: MUSCLE_COLORS[g] + '55' }}>
                              {MUSCLE_LABEL[g]}
                            </span>
                          ))
                        }
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`week-plan-edit-btn${isEditing ? ' week-plan-edit-btn--active' : ''}`}
                      onClick={() => openEditDay(dow)}
                    >
                      {isEditing ? 'Done' : 'Edit'}
                    </button>
                  </div>

                  {/* Exercises per group */}
                  {!isRest && groups.map(g => {
                    const exs = d.exercisesByGroup?.[g] || [];
                    if (exs.length === 0) return null;
                    return (
                      <div key={g} className="week-plan-group-block">
                        <p className="week-plan-group-label" style={{ color: MUSCLE_COLORS[g] }}>
                          {MUSCLE_LABEL[g]}
                        </p>
                        <div className="week-plan-ex-table">
                          {exs.map(ex => (
                            <div key={ex.id} className="week-plan-ex-item">
                              <span className="week-plan-ex-name">{ex.name}</span>
                              <div className="week-plan-ex-stats">
                                <div className="week-plan-stat-box">
                                  <span className="week-plan-stat-num">{ex.sets}</span>
                                  <span className="week-plan-stat-label">sets</span>
                                </div>
                                <span className="week-plan-stat-sep">×</span>
                                <div className="week-plan-stat-box">
                                  <span className="week-plan-stat-num">{ex.reps}</span>
                                  <span className="week-plan-stat-label">reps</span>
                                </div>
                                <span className="week-plan-stat-sep">·</span>
                                <div className="week-plan-stat-box">
                                  <span className="week-plan-stat-num">{ex.weight}</span>
                                  <span className="week-plan-stat-label">{ex.unit}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {!isRest && groups.every(g => (d.exercisesByGroup?.[g] || []).length === 0) && (
                    <p className="week-plan-no-ex">No exercises added. Click Edit to set up.</p>
                  )}
                </article>

                {/* ── Edit panel (inline, only for this day) ── */}
                {isEditing && (
                  <article className="card week-plan-edit-panel">
                    <p className="card-label" style={{ marginBottom: '0.625rem' }}>Muscle Groups</p>
                    <div className="muscle-group-grid" style={{ marginBottom: '1.25rem' }}>
                      {MUSCLE_GROUPS.map(({ value, label: ml }) => {
                        const active = (ep.muscleGroups || []).includes(value);
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
                            onClick={() => toggleMuscleGroup(value)}
                          >
                            {ml}
                          </button>
                        );
                      })}
                    </div>

                    {epIsRest && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Rest day — no exercises needed.
                      </p>
                    )}

                    {!epIsRest && epGroups.map(group => (
                      <div key={group} className="exercise-group-section">
                        <div className="exercise-group-header">
                          <span className="exercise-group-dot" style={{ background: MUSCLE_COLORS[group] }} />
                          <span style={{ color: MUSCLE_COLORS[group], fontWeight: 700 }}>{MUSCLE_LABEL[group]}</span>
                          <span className="exercise-group-count">
                            {(ep.exercisesByGroup?.[group] || []).length} exercises
                          </span>
                        </div>
                        {(ep.exercisesByGroup?.[group] || []).map(ex => (
                          <ExerciseRow key={ex.id} ex={ex} onRemove={id => removeExerciseFromGroup(group, id)} />
                        ))}
                        <AddExerciseForm onAdd={ex => addExerciseToGroup(group, ex)} />
                      </div>
                    ))}
                  </article>
                )}
              </div>
            );
          })}
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

          {/* Plan exercises grouped by muscle group */}
          {!todayIsRest && todayActiveGroups.length > 0 && (
            <article className="card">
              <h3 className="card-section-title" style={{ marginBottom: '1rem' }}>Today&apos;s Plan</h3>
              {todayActiveGroups.map(group => {
                const exList = todayPlan.exercisesByGroup?.[group] || [];
                return (
                  <div key={group} className="exercise-group-section">
                    <div className="exercise-group-header">
                      <span className="exercise-group-dot" style={{ background: MUSCLE_COLORS[group] }} />
                      <span style={{ color: MUSCLE_COLORS[group], fontWeight: 700 }}>{MUSCLE_LABEL[group]}</span>
                    </div>
                    {exList.length > 0
                      ? exList.map(ex => <ExerciseRow key={ex.id} ex={ex} onRemove={null} />)
                      : <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', padding: '0.25rem 0 0.5rem' }}>No exercises set in plan.</p>
                    }
                  </div>
                );
              })}
            </article>
          )}

          {/* Extra exercises for today */}
          <article className="card">
            <h3 className="card-section-title" style={{ marginBottom: '0.875rem' }}>
              {todayExtra.length > 0 ? 'Extra Exercises' : 'Add Extra Exercise'}
            </h3>
            {todayExtra.map(ex => (
              <ExerciseRow key={ex.id} ex={ex} onRemove={removeTodayExtra} />
            ))}
            <AddExerciseForm onAdd={addTodayExtra} />

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

    </>
  );
}
