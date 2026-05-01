export const ACTIVITY_LEVELS = {
  sedentary:   { label: "Sedentary (little to no exercise)", multiplier: 1.4 },
  light:       { label: "Lightly active (1–3 days/week)", multiplier: 1.6 },
  moderate:    { label: "Moderately active (3–5 days/week)", multiplier: 1.8 },
  very_active: { label: "Very active (6–7 days/week)", multiplier: 2.0 },
};

function calcAge(birthDate) {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age > 0 ? age : null;
}

export function estimateTDEE({ weight, height, birthDate, sex, activityLevel = "moderate" }) {
  if (!weight || !height || !birthDate || !sex) return null;
  const weightKg = weight / 2.2046;
  const heightCm = height * 2.54;
  const age = calcAge(birthDate);
  if (!age) return null;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
  const multiplier = ACTIVITY_LEVELS[activityLevel]?.multiplier ?? 1.8;
  return Math.round(bmr * multiplier);
}

export function calculateExerciseVolume(exercise) {
  return exercise.sets.reduce((total, set) => total + Number(set.reps || 0) * Number(set.weight || 0), 0);
}

export function calculateCategoryVolume(category) {
  return category.exercises.reduce((total, exercise) => total + calculateExerciseVolume(exercise), 0);
}

export function calculateProgramVersionVolume(version) {
  return version.categories.reduce((total, category) => total + calculateCategoryVolume(category), 0);
}

export function countProgramExercises(version) {
  return version.categories.reduce((total, category) => total + category.exercises.length, 0);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

export function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

export function getProgramVolumeTrend(versions) {
  return [...versions]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((version) => ({
      date: version.createdAt.slice(5),
      version: `v${version.versionNumber}`,
      volume: calculateProgramVersionVolume(version)
    }));
}
