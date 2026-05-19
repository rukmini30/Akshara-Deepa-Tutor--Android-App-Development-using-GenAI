export interface Chapter {
  id: string;
  title: string;
  completed: boolean;
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface Question {
  id: string;
  subjectId: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of options
}

export const INITIAL_SYLLABUS: Subject[] = [
  {
    id: "science",
    name: "Science",
    chapters: [
      { id: "s1", title: "Chemical Reactions and Equations", completed: false },
      { id: "s2", title: "Acids, Bases and Salts", completed: false },
      { id: "s3", title: "Metals and Non-metals", completed: false },
      { id: "s4", title: "Carbon and its Compounds", completed: false },
      { id: "s5", title: "Life Processes", completed: false },
      { id: "s6", title: "Control and Coordination", completed: false },
    ],
  },
  {
    id: "math",
    name: "Mathematics",
    chapters: [
      { id: "m1", title: "Arithmetic Progressions", completed: false },
      { id: "m2", title: "Triangles", completed: false },
      { id: "m3", title: "Pair of Linear Equations", completed: false },
      { id: "m4", title: "Quadratic Equations", completed: false },
      { id: "m5", title: "Introduction to Trigonometry", completed: false },
      { id: "m6", title: "Statistics", completed: false },
    ],
  },
  {
    id: "social",
    name: "Social Studies",
    chapters: [
      { id: "ss1", title: "The Advent of Europeans to India", completed: false },
      { id: "ss2", title: "The Extension of British Rule", completed: false },
      { id: "ss3", title: "Indian Challenges and Remedies", completed: false },
      { id: "ss4", title: "Lithosphere", completed: false },
      { id: "ss5", title: "Human Rights", completed: false },
    ],
  },
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    subjectId: "science",
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
    correctAnswer: 1,
  },
  {
    id: "q2",
    subjectId: "math",
    question: "What is the value of sin 90°?",
    options: ["0", "0.5", "1", "Infinity"],
    correctAnswer: 2,
  },
  {
    id: "q3",
    subjectId: "social",
    question: "Who was the first Prime Minister of India?",
    options: ["Mahatma Gandhi", "Sardar Patel", "Jawaharlal Nehru", "B.R. Ambedkar"],
    correctAnswer: 2,
  },
  {
    id: "q4",
    subjectId: "science",
    question: "Which gas is essential for photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctAnswer: 2,
  },
  {
    id: "q5",
    subjectId: "math",
    question: "What is the sum of angles in a triangle?",
    options: ["90°", "180°", "270°", "360°"],
    correctAnswer: 1,
  },
];

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
}

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Arjun Kumar", points: 2540 },
  { rank: 2, name: "Priya Singh", points: 2310 },
  { rank: 3, name: "Rohan Das", points: 2100 },
  { rank: 4, name: "Sneha Patil", points: 1950 },
  { rank: 5, name: "Kiran Rao", points: 1820 },
];

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const BADGES: Badge[] = [
  { id: "b1", name: "Fast Learner", icon: "⚡", description: "Completed 5 chapters in a day" },
  { id: "b2", name: "Quiz Master", icon: "🏆", description: "Scored 100% in 10 quizzes" },
  { id: "b3", name: "Daily Hero", icon: "🔥", description: "Maintained a 7-day streak" },
  { id: "b4", name: "AI Explorer", icon: "🤖", description: "Asked 20 questions to AI Tutor" },
];
