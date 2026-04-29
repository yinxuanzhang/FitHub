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
