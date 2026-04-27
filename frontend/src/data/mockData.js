export const dashboardData = {
  dietProgress: 76,
  workoutProgress: 64,
  todayScore: { diet: 1, workout: 1 },
  totalCheckIns: 128,
  currentStreak: 9
};

export const nutritionGoals = {
  calories: { target: 2200, consumed: 1650, unit: 'kcal' },
  protein: { target: 160, consumed: 122, unit: 'g' },
  carbs: { target: 240, consumed: 173, unit: 'g' },
  fat: { target: 70, consumed: 56, unit: 'g' }
};

export const foodLogs = [
  { id: 1, meal: 'Breakfast Bowl', calories: 480, protein: 35, carbs: 52, fat: 14, time: '08:10' },
  { id: 2, meal: 'Chicken Wrap', calories: 620, protein: 47, carbs: 58, fat: 21, time: '13:20' },
  { id: 3, meal: 'Greek Yogurt', calories: 180, protein: 18, carbs: 14, fat: 5, time: '16:00' },
  { id: 4, meal: 'Salmon Plate', calories: 370, protein: 30, carbs: 22, fat: 16, time: '19:10' }
];

export const workoutLogs = [
  { id: 1, exercise: 'Back Squat', sets: 4, reps: 6, weight: 225 },
  { id: 2, exercise: 'Bench Press', sets: 4, reps: 8, weight: 155 },
  { id: 3, exercise: 'Romanian Deadlift', sets: 3, reps: 10, weight: 185 },
  { id: 4, exercise: 'Cable Row', sets: 3, reps: 12, weight: 120 }
];

export const posts = [
  {
    id: 'p1',
    user: 'Maya Fit',
    text: 'Hit a new PR on deadlifts today! Consistency is finally paying off.',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=900&q=80',
    likes: 184,
    comments: 26,
    createdAt: '2h ago'
  },
  {
    id: 'p2',
    user: 'Jordan K',
    text: 'Meal prep Sunday done ✅ Protein-packed and ready for the week.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80',
    likes: 129,
    comments: 18,
    createdAt: '5h ago'
  },
  {
    id: 'p3',
    user: 'Elena Moves',
    text: 'Quick mobility session after a long desk day. Feeling way better already.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    likes: 91,
    comments: 9,
    createdAt: '1d ago'
  }
];

export const commentsByPostId = {
  p1: [
    { id: 1, user: 'Kai', text: 'Massive lift. Let’s go!', time: '1h ago' },
    { id: 2, user: 'Nora', text: 'You inspired my workout today.', time: '50m ago' }
  ],
  p2: [
    { id: 1, user: 'Liam', text: 'Looks clean and delicious.', time: '3h ago' },
    { id: 2, user: 'Sara', text: 'Meal prep goals 🔥', time: '2h ago' }
  ],
  p3: [{ id: 1, user: 'Ty', text: 'Mobility is underrated.', time: '12h ago' }]
};

export const profile = {
  name: 'Alex Morgan',
  username: '@alexfit',
  bio: 'Building healthier habits, one day at a time.',
  avatar:
    'https://images.unsplash.com/photo-1542204625-de293a7b42d7?auto=format&fit=crop&w=300&q=80',
  totalPoints: 512,
  dietCheckIns: 74,
  workoutCheckIns: 65,
  currentStreak: 9,
  myPosts: [
    'Locked in this week and already feeling stronger.',
    'Post-workout nutrition really changes recovery.',
    'Anyone else love early morning sessions?'
  ]
};
