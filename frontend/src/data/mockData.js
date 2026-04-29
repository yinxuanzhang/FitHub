export const users = [
  {
    id: "user-1",
    name: "Alex Chen",
    email: "alex@example.com",
    password: "password123",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=240&q=80",
    bio: "Building a long-term strength and body composition system.",
    createdAt: "2026-01-12",
    privacy: {
      showLatestBodyRecord: true
    }
  },
  {
    id: "user-2",
    name: "Maya Rivera",
    email: "maya@example.com",
    password: "password123",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    bio: "Hypertrophy-focused lifter keeping training simple and repeatable.",
    createdAt: "2026-02-03",
    privacy: {
      showLatestBodyRecord: false
    }
  }
];

export const trainingPrograms = [
{
  id: "program-1",
  userId: "user-1",
  name: "Main Strength & Hypertrophy Program",
  goal: "Maintain a stable weekly training flow while progressively adjusting load, reps, and exercise selection.",
  versions: [
    {
      id: "pv-003",
      versionNumber: 3,
      createdAt: "2026-04-24",
      changeSummary: "Increased pressing load and added direct arm volume.",
      categories: [
        {
          id: "cat-chest",
          name: "Chest",
          exercises: [
            {
              id: "ex-bench",
              name: "Barbell Bench Press",
              notes: "Paused first rep on each set.",
              sets: [
                { reps: 5, weight: 185 },
                { reps: 5, weight: 190 },
                { reps: 4, weight: 195 }
              ]
            },
            {
              id: "ex-incline-db",
              name: "Incline Dumbbell Press",
              notes: "Controlled eccentric, stop before shoulder irritation.",
              sets: [
                { reps: 8, weight: 70 },
                { reps: 8, weight: 70 },
                { reps: 7, weight: 70 }
              ]
            }
          ]
        },
        {
          id: "cat-shoulders",
          name: "Shoulders",
          exercises: [
            {
              id: "ex-shoulder-press",
              name: "Dumbbell Shoulder Press",
              notes: "Keep ribs down.",
              sets: [
                { reps: 8, weight: 55 },
                { reps: 8, weight: 55 },
                { reps: 7, weight: 55 }
              ]
            },
            {
              id: "ex-lateral-raise",
              name: "Cable Lateral Raise",
              notes: "Use strict form and steady tempo.",
              sets: [
                { reps: 12, weight: 20 },
                { reps: 12, weight: 20 },
                { reps: 12, weight: 20 }
              ]
            }
          ]
        },
        {
          id: "cat-back",
          name: "Back",
          exercises: [
            {
              id: "ex-row",
              name: "Chest-Supported Row",
              notes: "No hip drive.",
              sets: [
                { reps: 8, weight: 125 },
                { reps: 8, weight: 125 },
                { reps: 7, weight: 130 }
              ]
            },
            {
              id: "ex-pullup",
              name: "Weighted Pull-Up",
              notes: "Full lockout and clean top position.",
              sets: [
                { reps: 6, weight: 25 },
                { reps: 5, weight: 25 },
                { reps: 5, weight: 20 }
              ]
            }
          ]
        },
        {
          id: "cat-legs",
          name: "Glutes & Legs",
          exercises: [
            {
              id: "ex-front-squat",
              name: "Front Squat",
              notes: "Prioritize upright torso and bracing.",
              sets: [
                { reps: 6, weight: 175 },
                { reps: 6, weight: 180 },
                { reps: 5, weight: 185 }
              ]
            },
            {
              id: "ex-rdl",
              name: "Romanian Deadlift",
              notes: "Keep lats tight.",
              sets: [
                { reps: 8, weight: 205 },
                { reps: 8, weight: 205 },
                { reps: 8, weight: 205 }
              ]
            }
          ]
        },
        {
          id: "cat-arms",
          name: "Arms",
          exercises: [
            {
              id: "ex-curl",
              name: "Incline Dumbbell Curl",
              notes: "Full stretch, no swinging.",
              sets: [
                { reps: 10, weight: 30 },
                { reps: 10, weight: 30 },
                { reps: 9, weight: 30 }
              ]
            },
            {
              id: "ex-triceps",
              name: "Rope Triceps Pressdown",
              notes: "Hard lockout each rep.",
              sets: [
                { reps: 12, weight: 55 },
                { reps: 12, weight: 55 },
                { reps: 11, weight: 60 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "pv-002",
      versionNumber: 2,
      createdAt: "2026-03-22",
      changeSummary: "Added glute/leg emphasis and increased row volume.",
      categories: [
        {
          id: "cat-chest",
          name: "Chest",
          exercises: [
            { id: "ex-bench-v2", name: "Barbell Bench Press", notes: "Build volume conservatively.", sets: [{ reps: 5, weight: 180 }, { reps: 5, weight: 185 }, { reps: 5, weight: 185 }] },
            { id: "ex-incline-db-v2", name: "Incline Dumbbell Press", notes: "Moderate load.", sets: [{ reps: 8, weight: 65 }, { reps: 8, weight: 65 }, { reps: 8, weight: 65 }] }
          ]
        },
        {
          id: "cat-shoulders",
          name: "Shoulders",
          exercises: [
            { id: "ex-shoulder-press-v2", name: "Dumbbell Shoulder Press", notes: "Smooth reps.", sets: [{ reps: 8, weight: 50 }, { reps: 8, weight: 50 }, { reps: 8, weight: 50 }] }
          ]
        },
        {
          id: "cat-back",
          name: "Back",
          exercises: [
            { id: "ex-row-v2", name: "Chest-Supported Row", notes: "Add load if form holds.", sets: [{ reps: 8, weight: 120 }, { reps: 8, weight: 125 }, { reps: 8, weight: 125 }] },
            { id: "ex-pullup-v2", name: "Weighted Pull-Up", notes: "Keep reps clean.", sets: [{ reps: 5, weight: 20 }, { reps: 5, weight: 20 }, { reps: 5, weight: 20 }] }
          ]
        },
        {
          id: "cat-legs",
          name: "Glutes & Legs",
          exercises: [
            { id: "ex-front-squat-v2", name: "Front Squat", notes: "Technique focus.", sets: [{ reps: 6, weight: 165 }, { reps: 6, weight: 170 }, { reps: 6, weight: 170 }] },
            { id: "ex-rdl-v2", name: "Romanian Deadlift", notes: "Hamstring tension.", sets: [{ reps: 8, weight: 195 }, { reps: 8, weight: 195 }, { reps: 8, weight: 200 }] }
          ]
        },
        {
          id: "cat-arms",
          name: "Arms",
          exercises: [
            { id: "ex-curl-v2", name: "Incline Dumbbell Curl", notes: "Keep elbows back.", sets: [{ reps: 10, weight: 25 }, { reps: 10, weight: 25 }, { reps: 10, weight: 25 }] }
          ]
        }
      ]
    },
    {
      id: "pv-001",
      versionNumber: 1,
      createdAt: "2026-02-15",
      changeSummary: "Initial program structure with fixed training categories.",
      categories: [
        {
          id: "cat-chest",
          name: "Chest",
          exercises: [
            { id: "ex-bench-v1", name: "Barbell Bench Press", notes: "Baseline load.", sets: [{ reps: 5, weight: 175 }, { reps: 5, weight: 175 }, { reps: 5, weight: 180 }] }
          ]
        },
        {
          id: "cat-shoulders",
          name: "Shoulders",
          exercises: [
            { id: "ex-shoulder-press-v1", name: "Dumbbell Shoulder Press", notes: "Start light.", sets: [{ reps: 8, weight: 45 }, { reps: 8, weight: 45 }, { reps: 8, weight: 45 }] }
          ]
        },
        {
          id: "cat-back",
          name: "Back",
          exercises: [
            { id: "ex-row-v1", name: "Chest-Supported Row", notes: "Baseline row pattern.", sets: [{ reps: 8, weight: 115 }, { reps: 8, weight: 115 }, { reps: 8, weight: 120 }] }
          ]
        },
        {
          id: "cat-legs",
          name: "Glutes & Legs",
          exercises: [
            { id: "ex-front-squat-v1", name: "Front Squat", notes: "Conservative start.", sets: [{ reps: 6, weight: 155 }, { reps: 6, weight: 160 }, { reps: 6, weight: 160 }] }
          ]
        },
        {
          id: "cat-arms",
          name: "Arms",
          exercises: []
        }
      ]
    }
  ]
},
{
  id: "program-2",
  userId: "user-2",
  name: "Upper Lower Hypertrophy Program",
  goal: "Keep exercise selection stable while increasing weekly volume gradually.",
  versions: [
    {
      id: "pv-maya-001",
      versionNumber: 1,
      createdAt: "2026-04-05",
      changeSummary: "Initial public profile program summary.",
      categories: [
        {
          id: "maya-chest",
          name: "Chest",
          exercises: [
            { id: "maya-db-press", name: "Dumbbell Bench Press", notes: "Moderate incline.", sets: [{ reps: 10, weight: 55 }, { reps: 10, weight: 55 }, { reps: 9, weight: 60 }] }
          ]
        },
        {
          id: "maya-back",
          name: "Back",
          exercises: [
            { id: "maya-lat", name: "Lat Pulldown", notes: "Full stretch.", sets: [{ reps: 10, weight: 105 }, { reps: 10, weight: 110 }, { reps: 9, weight: 110 }] }
          ]
        },
        {
          id: "maya-legs",
          name: "Glutes & Legs",
          exercises: [
            { id: "maya-hip", name: "Hip Thrust", notes: "Pause at top.", sets: [{ reps: 8, weight: 185 }, { reps: 8, weight: 195 }, { reps: 8, weight: 195 }] }
          ]
        }
      ]
    }
  ]
}
];

export const bodyRecords = [
  { id: "b-1", userId: "user-1", date: "2026-03-01", height: 70, weight: 184.2, bodyFat: 18.6, waist: 34.5, chest: 41.0, notes: "Starting new nutrition phase.", isPrivate: true },
  { id: "b-2", userId: "user-1", date: "2026-03-15", height: 70, weight: 182.7, bodyFat: 18.1, waist: 34.0, notes: "Strength stable.", isPrivate: true },
  { id: "b-3", userId: "user-1", date: "2026-04-01", height: 70, weight: 181.4, bodyFat: 17.5, waist: 33.5, chest: 40.5, notes: "Sleep improved this block.", isPrivate: true },
  { id: "b-4", userId: "user-1", date: "2026-04-15", height: 70, weight: 180.6, bodyFat: 17.2, waist: 33.0, notes: "Waist measurement down slightly.", isPrivate: true },
  { id: "b-5", userId: "user-1", date: "2026-04-28", height: 70, weight: 179.8, bodyFat: 16.9, waist: 32.5, chest: 40.0, notes: "Good adherence during travel week.", isPrivate: true },
  { id: "b-6", userId: "user-2", date: "2026-04-20", height: 65, weight: 142.4, bodyFat: 21.5, notes: "Private baseline.", isPrivate: true }
];

export const dietPlans = [
  {
    id: "d-3",
    userId: "user-1",
    startDate: "2026-04-15",
    calories: 2450,
    protein: 185,
    carbs: 245,
    fat: 75,
    isPrivate: true,
    notes: "Lean cut target. Keep breakfast and post-workout meals consistent."
  },
  {
    id: "d-2",
    userId: "user-1",
    startDate: "2026-03-15",
    calories: 2600,
    protein: 180,
    carbs: 280,
    fat: 80,
    isPrivate: true,
    notes: "Small deficit with higher carbs on training days."
  },
  {
    id: "d-1",
    userId: "user-1",
    startDate: "2026-02-01",
    calories: 2850,
    protein: 175,
    carbs: 330,
    fat: 85,
    isPrivate: true,
    notes: "Maintenance target while increasing lower body volume."
  },
  {
    id: "d-4",
    userId: "user-2",
    startDate: "2026-04-05",
    calories: 2200,
    protein: 150,
    carbs: 220,
    fat: 65,
    isPrivate: true,
    notes: "Private hypertrophy target."
  }
];

export const socialPosts = [
  {
    id: "p-2",
    userId: "user-1",
    createdAt: "2026-04-25T18:40:00",
    visibility: "public",
    caption: "Logged a stronger upper session after two quieter weeks. Pressing volume finally moving again.",
    imageLabel: "Upper session snapshot",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Strength training setup in a gym"
  },
  {
    id: "p-1",
    userId: "user-1",
    createdAt: "2026-04-10T09:15:00",
    visibility: "private",
    caption: "Body composition trend is moving in the right direction. Keeping the plan boring and repeatable.",
    imageLabel: "Progress note"
  },
  {
    id: "p-3",
    userId: "user-2",
    createdAt: "2026-04-22T12:10:00",
    visibility: "public",
    caption: "Keeping the program stable for the next block and only changing load targets.",
    imageLabel: "Program update",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Gym training area with equipment"
  }
];
