import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import TabBar from '../components/TabBar';
import { useAppData } from '../context/AppDataContext';

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

function todayKey() { return new Date().toISOString().slice(0, 10); }

function MacroBar({ label, consumed, target, color }) {
  const pct = target > 0 ? Math.min(100, Math.round((consumed / target) * 100)) : 0;
  return (
    <div className="macro-bar-row">
      <div className="macro-bar-head">
        <span>{label}</span>
        <span>{consumed} / {target}</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function DietPage() {
  const { dietPlan, setDietPlan, foodLogs, setFoodLogs, dietCheckIns, setDietCheckIns } = useAppData();

  const [tab, setTab] = useState('plan');
  const [draftPlan, setDraftPlan] = useState(() => ({
    controlDays: [...dietPlan.controlDays],
    goals: { ...dietPlan.goals },
  }));
  const [planSaved, setPlanSaved] = useState(false);
  const [foodForm, setFoodForm] = useState({ name: '', calories: '', protein: '', fat: '', carbs: '' });

  const today = todayKey();
  const todayDow = new Date().getDay();
  const isControlDay = dietPlan.controlDays.includes(todayDow);
  const isCheckedIn = dietCheckIns.includes(today);
  const { goals } = dietPlan;

  const dayFoods = foodLogs[today] || [];
  const totals = dayFoods.reduce(
    (acc, f) => ({
      calories: acc.calories + (f.calories || 0),
      protein:  acc.protein  + (f.protein  || 0),
      fat:      acc.fat      + (f.fat      || 0),
      carbs:    acc.carbs    + (f.carbs    || 0),
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  // ── Plan tab ──────────────────────────────────────────────────────
  function toggleControlDay(dow) {
    setDraftPlan(prev => {
      const days = prev.controlDays.includes(dow)
        ? prev.controlDays.filter(d => d !== dow)
        : [...prev.controlDays, dow];
      return { ...prev, controlDays: days };
    });
  }

  function setGoal(key, value) {
    setDraftPlan(prev => ({ ...prev, goals: { ...prev.goals, [key]: Number(value) || 0 } }));
  }

  function savePlan() {
    setDietPlan(draftPlan);
    setPlanSaved(true);
    setTimeout(() => setPlanSaved(false), 2000);
  }

  // ── Today tab ─────────────────────────────────────────────────────
  function addFood(e) {
    e.preventDefault();
    if (!foodForm.name.trim()) return;
    const entry = {
      id: Date.now().toString(),
      name: foodForm.name.trim(),
      calories: parseInt(foodForm.calories) || 0,
      protein:  parseFloat(foodForm.protein)  || 0,
      fat:      parseFloat(foodForm.fat)      || 0,
      carbs:    parseFloat(foodForm.carbs)    || 0,
    };
    setFoodLogs(prev => ({ ...prev, [today]: [...(prev[today] || []), entry] }));
    setFoodForm({ name: '', calories: '', protein: '', fat: '', carbs: '' });
  }

  function removeFood(id) {
    setFoodLogs(prev => ({ ...prev, [today]: (prev[today] || []).filter(f => f.id !== id) }));
  }

  function checkIn() {
    if (!isCheckedIn) setDietCheckIns(prev => [...prev, today]);
  }

  return (
    <>
      <PageHeader title="Diet" subtitle="Track your nutrition goals" />
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {/* ── PLAN TAB ── */}
      {tab === 'plan' && (
        <article className="card">
          <h3 className="card-section-title" style={{ marginBottom: '0.625rem' }}>Weekly Control Days</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Select days to track nutrition. Free days need no logging.
          </p>
          <div className="control-days-grid">
            {WEEK_ORDER.map(({ dow, label }) => (
              <button
                key={dow}
                type="button"
                className={`control-day-btn${draftPlan.controlDays.includes(dow) ? ' control-day-btn--active' : ''}`}
                onClick={() => toggleControlDay(dow)}
              >
                {label}
              </button>
            ))}
          </div>

          <h3 className="card-section-title" style={{ margin: '1.75rem 0 1rem' }}>Control Day Goals</h3>
          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            <label>Calories (kcal)
              <input type="number" min="0" value={draftPlan.goals.calories}
                onChange={e => setGoal('calories', e.target.value)} />
            </label>
            <label>Protein (g)
              <input type="number" min="0" value={draftPlan.goals.protein}
                onChange={e => setGoal('protein', e.target.value)} />
            </label>
            <label>Fat (g)
              <input type="number" min="0" value={draftPlan.goals.fat}
                onChange={e => setGoal('fat', e.target.value)} />
            </label>
            <label>Carbs (g)
              <input type="number" min="0" value={draftPlan.goals.carbs}
                onChange={e => setGoal('carbs', e.target.value)} />
            </label>
          </div>
          <button
            type="button"
            className={`complete-btn${planSaved ? ' complete-btn--done' : ''}`}
            style={{ marginTop: '1.5rem' }}
            onClick={savePlan}
          >
            {planSaved ? '✓ Saved!' : 'Save Plan'}
          </button>
        </article>
      )}

      {/* ── TODAY TAB ── */}
      {tab === 'today' && (
        <>
          {!isControlDay ? (
            <article className="card free-day-card">
              <div className="free-day-content">
                <div className="free-day-icon">🎉</div>
                <h3>Free Day</h3>
                <p>No tracking needed today. Enjoy!</p>
              </div>
            </article>
          ) : (
            <>
              {/* Status banner */}
              <div className="card today-banner">
                <div className="today-banner-info">
                  <p className="card-label">Today</p>
                  <span className="today-group-badge control-day-badge">Control Day</span>
                </div>
                {isCheckedIn && <div className="checkin-done">✓ Diet logged</div>}
              </div>

              {/* Macro progress */}
              <article className="card">
                <h3 className="card-section-title" style={{ marginBottom: '1.125rem' }}>Progress</h3>
                <div className="macro-bars">
                  <MacroBar label={`Calories — ${totals.calories} / ${goals.calories} kcal`}
                    consumed={totals.calories} target={goals.calories} color="#e8724a" />
                  <MacroBar label={`Protein — ${totals.protein}g / ${goals.protein}g`}
                    consumed={totals.protein} target={goals.protein} color="#4f8ef7" />
                  <MacroBar label={`Fat — ${totals.fat}g / ${goals.fat}g`}
                    consumed={totals.fat} target={goals.fat} color="#f0a84a" />
                  <MacroBar label={`Carbs — ${totals.carbs}g / ${goals.carbs}g`}
                    consumed={totals.carbs} target={goals.carbs} color="#50c878" />
                </div>
              </article>

              {/* Food log list */}
              {dayFoods.length > 0 && (
                <article className="card">
                  <h3 className="card-section-title" style={{ marginBottom: '0.875rem' }}>Food Log</h3>
                  <div className="food-log-list">
                    {dayFoods.map(f => (
                      <div key={f.id} className="food-log-row">
                        <div className="food-log-name">{f.name}</div>
                        <div className="food-log-macros">
                          <span>{f.calories} kcal</span>
                          <span>P {f.protein}g</span>
                          <span>F {f.fat}g</span>
                          <span>C {f.carbs}g</span>
                        </div>
                        <button
                          type="button"
                          className="exercise-delete-btn"
                          onClick={() => removeFood(f.id)}
                        >×</button>
                      </div>
                    ))}
                  </div>
                </article>
              )}

              {/* Add food form */}
              <article className="card">
                <h3 className="card-section-title" style={{ marginBottom: '1rem' }}>Log Food</h3>
                <form
                  className="form-grid"
                  style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}
                  onSubmit={addFood}
                >
                  <label>Food / Meal
                    <input type="text" placeholder="e.g. Chicken rice"
                      value={foodForm.name}
                      onChange={e => setFoodForm(f => ({ ...f, name: e.target.value }))} />
                  </label>
                  <label>Calories (kcal)
                    <input type="number" placeholder="0" min="0"
                      value={foodForm.calories}
                      onChange={e => setFoodForm(f => ({ ...f, calories: e.target.value }))} />
                  </label>
                  <label>Protein (g)
                    <input type="number" placeholder="0" min="0" step="0.1"
                      value={foodForm.protein}
                      onChange={e => setFoodForm(f => ({ ...f, protein: e.target.value }))} />
                  </label>
                  <label>Fat (g)
                    <input type="number" placeholder="0" min="0" step="0.1"
                      value={foodForm.fat}
                      onChange={e => setFoodForm(f => ({ ...f, fat: e.target.value }))} />
                  </label>
                  <label>Carbs (g)
                    <input type="number" placeholder="0" min="0" step="0.1"
                      value={foodForm.carbs}
                      onChange={e => setFoodForm(f => ({ ...f, carbs: e.target.value }))} />
                  </label>
                  <label style={{ alignSelf: 'end' }}>
                    &nbsp;<button type="submit">+ Add Food</button>
                  </label>
                </form>

                <button
                  type="button"
                  className={`complete-btn${isCheckedIn ? ' complete-btn--done' : ''}`}
                  onClick={checkIn}
                  disabled={isCheckedIn}
                  style={{ marginTop: '1.25rem' }}
                >
                  {isCheckedIn ? '✓ Diet Goal Achieved' : '✓ Mark Diet Complete'}
                </button>
              </article>
            </>
          )}
        </>
      )}

    </>
  );
}
