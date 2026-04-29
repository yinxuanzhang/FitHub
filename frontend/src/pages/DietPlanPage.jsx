import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { useFitnessData } from "../context/FitnessDataContext.jsx";
import { formatDate } from "../utils/fitness.js";

const PHASE_EXPLANATIONS = {
  Cutting: "Your calories are below estimated maintenance, so this plan is likely for fat loss.",
  Bulking: "Your calories are above estimated maintenance, so this plan is likely for muscle gain.",
  Maintenance: "Your calories are close to estimated maintenance, so this plan is likely for maintaining weight.",
};

export default function DietPlanPage() {
  const { dietPlans: plans, bodyRecords, addDietPlan } = useFitnessData();
  const [form, setForm] = useState({ calories: "", protein: "", carbs: "", fat: "", notes: "" });
  const currentPlan = plans[0];

  const latestWeight = [...bodyRecords]
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.weight ?? null;

  const currentPlanPhase = currentPlan
    ? calcDietPhase(currentPlan.calories, latestWeight)
    : null;

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.calories) return;
    addDietPlan({
      startDate: new Date().toISOString().slice(0, 10),
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fat: Number(form.fat),
      notes: form.notes
    });
    setForm({ calories: "", protein: "", carbs: "", fat: "", notes: "" });
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Nutrition targets"
        title="Diet plans"
        description="Store daily macro targets and simple meal guidance without meal-by-meal tracking."
      />

      {currentPlan && (
        <section className="current-plan">
          <div>
            <span className="eyebrow">Current plan · {formatDate(currentPlan.startDate)}</span>
            {currentPlanPhase && (
              <div style={{ marginTop: "0.5rem", marginBottom: "0.25rem" }}>
                <PhaseBadge phase={currentPlanPhase.phase} />
              </div>
            )}
            <h2>{currentPlan.calories} calories</h2>
            {currentPlan.notes && <p>{currentPlan.notes}</p>}
          </div>
          <div className="macro-grid">
            <span><strong>{currentPlan.protein}g</strong> Protein</span>
            <span><strong>{currentPlan.carbs}g</strong> Carbs</span>
            <span><strong>{currentPlan.fat}g</strong> Fat</span>
          </div>
        </section>
      )}

      <div className="two-column align-start">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Add or update target</h2>
          <div className="form-grid">
            <label>
              Calories
              <input inputMode="numeric" value={form.calories} onChange={(event) => updateField("calories", event.target.value)} placeholder="2450" />
            </label>
            <label>
              Protein
              <input inputMode="numeric" value={form.protein} onChange={(event) => updateField("protein", event.target.value)} placeholder="185" />
            </label>
            <label>
              Carbs
              <input inputMode="numeric" value={form.carbs} onChange={(event) => updateField("carbs", event.target.value)} placeholder="245" />
            </label>
            <label>
              Fat
              <input inputMode="numeric" value={form.fat} onChange={(event) => updateField("fat", event.target.value)} placeholder="75" />
            </label>
          </div>

          {form.calories && (
            <DietPhasePreview calories={form.calories} latestWeight={latestWeight} />
          )}

          <label>
            Notes / rough meal plan
            <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Simple meal structure or adherence notes" />
          </label>
          <button className="button primary" type="submit">Save plan</button>
        </form>

        <section className="history-panel">
          <h2>Plan history</h2>
          {plans.map((plan) => {
            const phaseInfo = calcDietPhase(plan.calories, latestWeight);
            return (
              <article className="history-row" key={plan.id}>
                <div className="history-row-header">
                  <span>{formatDate(plan.startDate)}</span>
                  {phaseInfo && <PhaseBadge phase={phaseInfo.phase} />}
                </div>
                <strong>{plan.calories} kcal</strong>
                <p>{plan.protein}P / {plan.carbs}C / {plan.fat}F</p>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}

function calcDietPhase(calories, weight) {
  if (!calories || !weight) return null;
  const tdee = Math.round(weight * 15);
  const cal = Number(calories);
  if (cal < tdee - 200) return { phase: "Cutting", tdee, calories: cal };
  if (cal > tdee + 200) return { phase: "Bulking", tdee, calories: cal };
  return { phase: "Maintenance", tdee, calories: cal };
}

function DietPhasePreview({ calories, latestWeight }) {
  if (!latestWeight) {
    return (
      <div className="diet-phase-card diet-phase-no-data">
        <p>Add your body weight first to estimate your diet phase.</p>
      </div>
    );
  }

  const info = calcDietPhase(calories, latestWeight);
  if (!info) return null;

  return (
    <div className="diet-phase-card">
      <div className="diet-phase-row">
        <span className="eyebrow">Diet phase estimate</span>
        <PhaseBadge phase={info.phase} />
      </div>
      <div className="diet-phase-stats">
        <span>
          <span className="eyebrow">Daily target</span>
          {info.calories} kcal
        </span>
        <span>
          <span className="eyebrow">Est. TDEE</span>
          {info.tdee} kcal
        </span>
      </div>
      <p className="diet-phase-explanation">{PHASE_EXPLANATIONS[info.phase]}</p>
      <p className="disclaimer-copy">Estimate only. Not medical advice.</p>
    </div>
  );
}

function PhaseBadge({ phase }) {
  const cls = phase === "Cutting" ? "cutting" : phase === "Bulking" ? "bulking" : "maintenance";
  return <span className={`phase-badge ${cls}`}>{phase}</span>;
}
