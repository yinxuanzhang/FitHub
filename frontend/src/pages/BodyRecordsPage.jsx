import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "../components/ChartCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useFitnessData } from "../context/FitnessDataContext.jsx";
import { estimateTDEE, formatDate } from "../utils/fitness.js";

export default function BodyRecordsPage() {
  const { currentUser } = useAuth();
  const { bodyRecords: records, dietPlans, addBodyRecord } = useFitnessData();
  const userProfile = {
    birthDate: currentUser?.birthDate,
    sex: currentUser?.sex,
    activityLevel: currentUser?.activityLevel ?? "moderate",
  };

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    weight: "",
    bodyFat: "",
    waist: "",
    chest: "",
    notes: ""
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.weight || !form.bodyFat) return;
    addBodyRecord({
      ...form,
      weight: Number(form.weight),
      bodyFat: Number(form.bodyFat),
      waist: form.waist ? Number(form.waist) : undefined,
      chest: form.chest ? Number(form.chest) : undefined,
    });
    setForm((current) => ({
      ...current,
      date: new Date().toISOString().slice(0, 10),
      weight: "",
      bodyFat: "",
      waist: "",
      chest: "",
      notes: ""
    }));
  }

  const sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
  const chartData = sortedRecords.map((r) => ({ date: r.date.slice(5), weight: r.weight, bodyFat: r.bodyFat }));
  const latestRecord = sortedRecords[sortedRecords.length - 1] ?? null;

  const progress = computeProgress(sortedRecords);
  const dietPhaseInfo = progress ? determineDietPhase(dietPlans, progress.latest, userProfile) : null;
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Body composition"
        title="Body records"
        description="Record body measurements over time and track trends instead of isolated daily noise."
      />

      {latestRecord ? (
        <section className="body-current-card">
          <div className="body-current-meta">
            <span className="eyebrow">Current stats</span>
            <span className="eyebrow">{formatDate(latestRecord.date)}</span>
          </div>
          <div className="body-current-stats">
            <div>
              <span className="eyebrow">Weight</span>
              <strong>{latestRecord.weight} lb</strong>
            </div>
            <div>
              <span className="eyebrow">Body fat</span>
              <strong>{latestRecord.bodyFat}%</strong>
            </div>
            {latestRecord.height && (
              <div>
                <span className="eyebrow">Height</span>
                <strong>{latestRecord.height}"</strong>
              </div>
            )}
            {latestRecord.waist && (
              <div>
                <span className="eyebrow">Waist</span>
                <strong>{latestRecord.waist}"</strong>
              </div>
            )}
            {latestRecord.chest && (
              <div>
                <span className="eyebrow">Chest</span>
                <strong>{latestRecord.chest}"</strong>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {progress ? (
        <section className="progress-summary">
          <div className="section-heading">
            <div>
              <h2>Progress insight</h2>
              <p>{formatDate(progress.reference.date)} → {formatDate(progress.latest.date)}</p>
            </div>
            {dietPhaseInfo && <PhaseBadge phase={dietPhaseInfo.phase} />}
          </div>
          <div className="change-grid">
            <ChangeCard label="Weight" delta={progress.weightDelta} unit="lb" />
            <ChangeCard label="Body fat" delta={progress.bodyFatDelta} unit="%" />
            {progress.waistDelta !== null && <ChangeCard label="Waist" delta={progress.waistDelta} unit="in" />}
            {progress.chestDelta !== null && <ChangeCard label="Chest" delta={progress.chestDelta} unit="in" />}
          </div>
          {dietPhaseInfo && (
            <p className="disclaimer-copy">
              TDEE estimate: {dietPhaseInfo.tdee} kcal · Current plan: {dietPhaseInfo.calories} kcal.
              Not medical advice. Based on user-entered data only.
            </p>
          )}
          {!dietPhaseInfo && (
            <p className="disclaimer-copy">Add a diet plan to get phase-specific insights. Not medical advice.</p>
          )}
        </section>
      ) : (
        <section className="progress-summary progress-summary-empty">
          <InsightIcon />
          <p>Add at least two records to see a progress insight.</p>
        </section>
      )}

      <div className="two-column align-start">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Add body record</h2>
          <label>
            Date
            <input type="date" value={form.date} onChange={(event) => updateField("date", event.target.value)} />
          </label>
          <div className="form-grid">
            <label>
              Body weight <span className="field-optional">lb</span>
              <input inputMode="decimal" value={form.weight} onChange={(event) => updateField("weight", event.target.value)} placeholder="179.8" />
            </label>
            <label>
              Body fat %
              <input inputMode="decimal" value={form.bodyFat} onChange={(event) => updateField("bodyFat", event.target.value)} placeholder="16.9" />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Waist <span className="field-optional">optional · in</span>
              <input inputMode="decimal" value={form.waist} onChange={(event) => updateField("waist", event.target.value)} placeholder="32.5" />
            </label>
          </div>
          <label>
            Chest <span className="field-optional">optional · in</span>
            <input inputMode="decimal" value={form.chest} onChange={(event) => updateField("chest", event.target.value)} placeholder="40.0" />
          </label>
          <label>
            Notes
            <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Measurement context or observations" />
          </label>
          <button className="button primary" type="submit">Add record</button>
        </form>

        <ChartCard title="Body trend" description="Weight and body fat percentage across saved records.">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#2d8a57" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="bodyFat" stroke="#5b8dd9" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <section className="records-grid">
        {sortedRecords.slice().reverse().map((record) => (
          <article className="record-card" key={record.id}>
            <span className="eyebrow">{formatDate(record.date)}</span>
            <strong>{record.weight} lb</strong>
            <p>{record.bodyFat}% body fat{record.height ? ` · ${record.height}"` : ""}</p>
            {(record.waist || record.chest) && (
              <div className="record-measurements">
                {record.waist && <span>Waist {record.waist}"</span>}
                {record.chest && <span>Chest {record.chest}"</span>}
              </div>
            )}
            {record.notes && <small>{record.notes}</small>}
          </article>
        ))}
      </section>
    </div>
  );
}

function findReferenceRecord(sortedRecords) {
  const latest = sortedRecords[sortedRecords.length - 1];
  const targetTime = new Date(latest.date).getTime() - 30 * 24 * 60 * 60 * 1000;
  const candidates = sortedRecords.slice(0, -1);
  if (candidates.length === 0) return null;
  return candidates.reduce((best, record) => {
    const diff = Math.abs(new Date(record.date).getTime() - targetTime);
    const bestDiff = Math.abs(new Date(best.date).getTime() - targetTime);
    return diff < bestDiff ? record : best;
  });
}

function computeProgress(sortedRecords) {
  if (sortedRecords.length < 2) return null;
  const latest = sortedRecords[sortedRecords.length - 1];
  const reference = findReferenceRecord(sortedRecords);
  if (!reference) return null;
  return {
    reference,
    latest,
    weightDelta: +((latest.weight - reference.weight).toFixed(1)),
    bodyFatDelta: +((latest.bodyFat - reference.bodyFat).toFixed(1)),
    waistDelta: (reference.waist && latest.waist) ? +((latest.waist - reference.waist).toFixed(1)) : null,
    chestDelta: (reference.chest && latest.chest) ? +((latest.chest - reference.chest).toFixed(1)) : null,
  };
}

function determineDietPhase(dietPlans, latestRecord, userProfile = {}) {
  if (!dietPlans.length || !latestRecord?.weight) return null;
  const tdee = estimateTDEE({
    weight: latestRecord.weight,
    height: latestRecord.height,
    ...userProfile,
  });
  if (!tdee) return null;
  const calories = dietPlans[0].calories;
  let phase;
  if (calories < tdee - 200) phase = "Cutting";
  else if (calories > tdee + 200) phase = "Bulking";
  else phase = "Maintenance";
  return { phase, tdee, calories };
}


function PhaseBadge({ phase }) {
  const cls = phase === "Cutting" ? "cutting" : phase === "Bulking" ? "bulking" : "maintenance";
  return <span className={`phase-badge ${cls}`}>{phase}</span>;
}

function ChangeCard({ label, delta, unit }) {
  const sign = delta > 0 ? "+" : "";
  const arrow = delta > 0 ? "↑" : delta < 0 ? "↓" : "—";
  const dirClass = delta > 0 ? "up" : delta < 0 ? "down" : "neutral";
  return (
    <div className="change-card">
      <span className="eyebrow">{label}</span>
      <div className={`change-delta ${dirClass}`}>
        <span className="change-arrow">{arrow}</span>
        <span>{sign}{delta} {unit}</span>
      </div>
    </div>
  );
}

function InsightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 3.2-2 5.8-4.5 7H9.5C7 16.8 5 14.2 5 9a7 7 0 0 1 7-7z" />
    </svg>
  );
}
