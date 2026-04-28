import { createContext, useContext, useState, useCallback } from 'react';

const Ctx = createContext(null);

function getLS(key, def) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
}

function usePersist(key, def) {
  const [state, setState] = useState(() => getLS(key, def));
  const set = useCallback(
    (val) =>
      setState((prev) => {
        const next = typeof val === 'function' ? val(prev) : val;
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      }),
    [key]
  );
  return [state, set];
}

// workoutPlan[dow] = { muscleGroups: string[] }
const DEFAULT_WORKOUT_PLAN = {
  0: { muscleGroups: ['rest'],       exercisesByGroup: {} },
  1: { muscleGroups: ['chest'],      exercisesByGroup: {} },
  2: { muscleGroups: ['back'],       exercisesByGroup: {} },
  3: { muscleGroups: ['shoulders'],  exercisesByGroup: {} },
  4: { muscleGroups: ['arms'],       exercisesByGroup: {} },
  5: { muscleGroups: ['legsglutes'], exercisesByGroup: {} },
  6: { muscleGroups: ['cardio'],     exercisesByGroup: {} },
};

// workoutRoutines[group] = [{id,name,sets,reps,weight,unit}]
const DEFAULT_WORKOUT_ROUTINES = {
  chest: [],
  shoulders: [],
  back: [],
  arms: [],
  legsglutes: [],
  cardio: [],
};

const DEFAULT_DIET_PLAN = {
  controlDays: [1, 2, 3, 4, 5],
  goals: { calories: 2000, protein: 150, fat: 60, carbs: 200 },
};

export function AppDataProvider({ children }) {
  const [workoutPlan, setWorkoutPlan] = usePersist('fh_workout_plan4', DEFAULT_WORKOUT_PLAN);
  const [workoutRoutines, setWorkoutRoutines] = usePersist('fh_workout_routines1', DEFAULT_WORKOUT_ROUTINES);
  const [workoutDailyFocus, setWorkoutDailyFocus] = usePersist('fh_workout_daily_focus1', {});
  const [workoutExtraLogs, setWorkoutExtraLogs] = usePersist('fh_workout_extra', {});
  const [workoutCheckIns, setWorkoutCheckIns] = usePersist('fh_workout_checkins', []);
  const [dietPlan, setDietPlan] = usePersist('fh_diet_plan', DEFAULT_DIET_PLAN);
  const [foodLogs, setFoodLogs] = usePersist('fh_food_logs', {});
  const [dietCheckIns, setDietCheckIns] = usePersist('fh_diet_checkins', []);

  return (
    <Ctx.Provider value={{
      workoutPlan, setWorkoutPlan,
      workoutRoutines, setWorkoutRoutines,
      workoutDailyFocus, setWorkoutDailyFocus,
      workoutExtraLogs, setWorkoutExtraLogs,
      workoutCheckIns, setWorkoutCheckIns,
      dietPlan, setDietPlan,
      foodLogs, setFoodLogs,
      dietCheckIns, setDietCheckIns,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAppData = () => useContext(Ctx);
