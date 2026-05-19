import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  CheckCircle2, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Trophy, 
  Timer, 
  ArrowLeft, 
  Send, 
  User, 
  Lock,
  ChevronRight,
  Target,
  Award,
  BookMarked,
  Flame,
  Star,
  Zap,
  TrendingUp,
  Mic,
  MicOff,
  Sun,
  Moon,
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from "recharts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  INITIAL_SYLLABUS, 
  MOCK_QUESTIONS, 
  LEADERBOARD, 
  BADGES,
  Subject, 
  Question 
} from "./data";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
type Screen = "LOGIN" | "DASHBOARD" | "SYLLABUS" | "QUIZ" | "STRENGTH" | "TUTOR" | "LEADERBOARD" | "PROFILE";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface QuizResult {
  date: string;
  subjectId: string;
  score: number;
  total: number;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("LOGIN");
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [syllabus, setSyllabus] = useState<Subject[]>(INITIAL_SYLLABUS);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(1);
  const [level, setLevel] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Recovery from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedSyllabus = localStorage.getItem("syllabus");
    const savedResults = localStorage.getItem("quizResults");
    const savedPoints = localStorage.getItem("points");
    const savedStreak = localStorage.getItem("streak");
    const savedLevel = localStorage.getItem("level");
    const savedTheme = localStorage.getItem("theme");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setScreen("DASHBOARD");
    }
    if (savedSyllabus) setSyllabus(JSON.parse(savedSyllabus));
    if (savedResults) setQuizResults(JSON.parse(savedResults));
    if (savedPoints) setPoints(Number(savedPoints));
    if (savedStreak) setStreak(Number(savedStreak));
    if (savedLevel) setLevel(Number(savedLevel));
    if (savedTheme) setIsDarkMode(savedTheme === "dark");
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("syllabus", JSON.stringify(syllabus));
    localStorage.setItem("quizResults", JSON.stringify(quizResults));
    localStorage.setItem("points", points.toString());
    localStorage.setItem("streak", streak.toString());
    localStorage.setItem("level", level.toString());
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [user, syllabus, quizResults, points, streak, level, isDarkMode]);

  const addPoints = (amount: number) => {
    setPoints(prev => {
      const newPoints = prev + amount;
      const nextLevel = Math.floor(newPoints / 500) + 1;
      if (nextLevel > level) setLevel(nextLevel);
      return newPoints;
    });
  };

  const toggleChapter = (subjectId: string, chapterId: string) => {
    setSyllabus(prev => prev.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          chapters: s.chapters.map(c => {
            if (c.id === chapterId && !c.completed) {
              addPoints(50);
            }
            return c.id === chapterId ? { ...c, completed: !c.completed } : c;
          })
        };
      }
      return s;
    }));
  };

  const calculateProgress = (subjectId?: string) => {
    const subjects = subjectId ? syllabus.filter(s => s.id === subjectId) : syllabus;
    let total = 0;
    let completed = 0;
    subjects.forEach(s => {
      total += s.chapters.length;
      completed += s.chapters.filter(c => c.completed).length;
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setScreen("LOGIN");
    setPoints(0);
    setLevel(1);
    setStreak(1);
    setChatHistory([]);
    setQuizResults([]);
    setSyllabus(INITIAL_SYLLABUS);
  };

  return (
    <div className={cn(
      "min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900 transition-colors duration-300",
      isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      <AnimatePresence mode="wait">
        {screen === "LOGIN" && <LoginScreen onLogin={(name) => { setUser({ name }); setScreen("DASHBOARD"); }} />}
        
        {user && (
          <div className="pb-24 max-w-lg mx-auto md:max-w-4xl px-4 pt-4">
            {screen === "DASHBOARD" && (
              <DashboardScreen 
                user={user} 
                progress={calculateProgress()} 
                points={points} 
                streak={streak} 
                level={level}
                onNavigate={setScreen}
                isDarkMode={isDarkMode}
              />
            )}
            {screen === "SYLLABUS" && <SyllabusScreen syllabus={syllabus} onToggle={toggleChapter} onBack={() => setScreen("DASHBOARD")} isDarkMode={isDarkMode} />}
            {screen === "QUIZ" && <QuizScreen onBack={() => setScreen("DASHBOARD")} onComplete={(res) => { setQuizResults(prev => [...prev, res]); addPoints(res.score * 20); }} isDarkMode={isDarkMode} />}
            {screen === "STRENGTH" && <StrengthMapScreen results={quizResults} syllabus={syllabus} onBack={() => setScreen("DASHBOARD")} isDarkMode={isDarkMode} />}
            {screen === "TUTOR" && <TutorScreen chatHistory={chatHistory} setChatHistory={setChatHistory} onBack={() => setScreen("DASHBOARD")} isDarkMode={isDarkMode} />}
            {screen === "LEADERBOARD" && <LeaderboardScreen onBack={() => setScreen("DASHBOARD")} isDarkMode={isDarkMode} />}
            {screen === "PROFILE" && <ProfileScreen user={user} points={points} streak={streak} level={level} onLogout={handleLogout} onBack={() => setScreen("DASHBOARD")} isDarkMode={isDarkMode} syllabus={syllabus} results={quizResults} />}

            {/* Bottom Navigation */}
            <nav className={cn(
                "fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-16 rounded-2xl flex items-center justify-around px-4 z-50 shadow-2xl backdrop-blur-xl border transition-all",
                isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
            )}>
              <NavButton icon={<LayoutDashboard />} active={screen === "DASHBOARD"} onClick={() => setScreen("DASHBOARD")} label="Home" />
              <NavButton icon={<BookMarked />} active={screen === "SYLLABUS"} onClick={() => setScreen("SYLLABUS")} label="Study" />
              <NavButton icon={<MessageSquare />} active={screen === "TUTOR"} onClick={() => setScreen("TUTOR")} label="Tutor" />
              <NavButton icon={<Users />} active={screen === "LEADERBOARD"} onClick={() => setScreen("LEADERBOARD")} label="Ranking" />
              <NavButton icon={<User />} active={screen === "PROFILE"} onClick={() => setScreen("PROFILE")} label="Profile" />
            </nav>
          </div>
        )}
      </AnimatePresence>

      {/* Theme Toggle */}
      {screen !== "LOGIN" && (
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={cn(
            "fixed top-4 right-4 p-3 rounded-full shadow-lg transition-transform active:scale-90 z-50",
            isDarkMode ? "bg-slate-800 text-yellow-400" : "bg-white text-slate-900"
          )}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}

// --- Components ---

function NavButton({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) {
  return (
    <button onClick={onClick} className="relative flex flex-col items-center justify-center p-2 group">
      <div className={cn(
        "transition-all duration-300",
        active ? "text-orange-500 scale-110 -translate-y-1" : "text-slate-400 group-hover:text-slate-600"
      )}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <span className={cn(
        "text-[10px] font-bold mt-0.5 transition-all",
        active ? "opacity-100" : "opacity-0"
      )}>{label}</span>
      {active && <motion.div layoutId="nav-dot" className="absolute -bottom-1 w-1 h-1 bg-orange-500 rounded-full" />}
    </button>
  );
}

// --- Screens ---

function LoginScreen({ onLogin }: { onLogin: (name: string) => void }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden"
    >
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-200/50 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-200/50 blur-[120px] rounded-full animate-pulse" />

      <div className="w-full max-w-sm space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-orange-200 mb-6"
          >
            <BookOpen className="text-white w-12 h-12" />
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700">Akshara</h1>
          <h2 className="text-2xl font-bold tracking-tight text-orange-500 -mt-4">Deepa Tutor</h2>
          <p className="text-slate-500 font-medium tracking-wide">Elevate your SSLC Journey 🚀</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl border border-white space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Warrior Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none font-bold"
                  placeholder="Enter your name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secret Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            disabled={!name}
            onClick={() => onLogin(name)}
            className="w-full bg-slate-900 text-white rounded-2xl py-4 font-black text-lg active:scale-95 transition-all disabled:opacity-50 hover:bg-slate-800 shadow-xl shadow-slate-200"
          >
            Launch Core
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardScreen({ user, progress, points, streak, level, onNavigate, isDarkMode }: { 
  user: { name: string }, 
  progress: number, 
  points: number, 
  streak: number, 
  level: number,
  onNavigate: (s: Screen) => void,
  isDarkMode: boolean
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Header Profile Info */}
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-xl">
              {user.name[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full border-4 border-slate-50 flex items-center justify-center text-[10px] font-black text-white">
              {level}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight leading-none">Hi, {user.name.split(' ')[0]}!</h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                <Flame className="w-3 h-3 fill-current" /> {streak} Day Streak
              </div>
              <div className="flex items-center gap-1 bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                <Zap className="w-3 h-3 fill-current" /> {points} XP
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => onNavigate("PROFILE")} className="p-3 bg-white/50 border border-white rounded-2xl shadow-sm hover:bg-white transition-colors group">
          <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
        </button>
      </section>

      {/* Main Mission Card - Modern Bento Style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-6 text-white relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Quest Progress</span>
              <h4 className="text-2xl font-black leading-tight">Master the Syllabus</h4>
            </div>
            <div className="space-y-3 mt-6">
               <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-wider opacity-60">{progress}% Completed</span>
                <span className="text-xl font-black">Level {level}</span>
               </div>
               <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                  />
               </div>
            </div>
          </div>
          <Target className="absolute top-[-20px] right-[-20px] w-40 h-40 text-white opacity-[0.05] rotate-12 group-hover:scale-110 transition-transform" />
        </div>

        <motion.button 
          whileHover={{ y: -5 }}
          onClick={() => onNavigate("TUTOR")}
          className="col-span-1 bg-indigo-500 rounded-[32px] p-6 text-white flex flex-col justify-between group active:scale-95 transition-all"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="text-left font-black leading-tight">AI<br/>Tutor</div>
        </motion.button>

        <motion.button 
          whileHover={{ y: -5 }}
          onClick={() => onNavigate("QUIZ")}
          className="col-span-1 bg-white border border-slate-100 rounded-[32px] p-6 flex flex-col justify-between group active:scale-95 transition-all shadow-sm"
        >
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
            <Timer className="w-5 h-5" />
          </div>
          <div className="text-left font-black leading-tight text-slate-800">Quick<br/>Quiz</div>
        </motion.button>
      </div>

      {/* Analytics Card */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-black text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            Performance
          </h4>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Activity</span>
        </div>
        <div className="h-[120px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { day: 'M', xp: 120 }, { day: 'T', xp: 450 }, { day: 'W', xp: 300 }, { day: 'T', xp: 600 }, { day: 'F', xp: 400 }, { day: 'S', xp: 800 }, { day: 'S', xp: 500 }
            ]}>
              <defs>
                <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                cursor={{ stroke: '#F97316', strokeWidth: 2 }}
              />
              <Area type="monotone" dataKey="xp" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorXP)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Suggested Focus */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Target Quests</h4>
          <button 
            onClick={() => onNavigate("TUTOR")}
            className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-600 transition-colors"
          >
            <Star className="w-3 h-3 fill-current" /> AI Refine
          </button>
        </div>
        <div className="space-y-3">
          <FocusItem title="Science: Life Processes" desc="Complete 3 more chapters" icon={<Zap />} color="bg-emerald-500" onClick={() => onNavigate("SYLLABUS")} isDarkMode={isDarkMode} />
          <FocusItem title="Math Breakdown" desc="Take a 5-min trigonometry quiz" icon={<Timer />} color="bg-purple-500" onClick={() => onNavigate("QUIZ")} isDarkMode={isDarkMode} />
        </div>
      </section>
    </motion.div>
  );
}

function FocusItem({ title, desc, icon, color, onClick, isDarkMode }: { title: string, desc: string, icon: React.ReactNode, color: string, onClick: () => void, isDarkMode: boolean }) {
  return (
    <button onClick={onClick} className={cn(
      "w-full flex items-center gap-4 p-4 rounded-3xl border transition-all active:scale-[0.98] text-left group",
      isDarkMode ? "bg-slate-900 border-slate-800 hover:border-orange-500/30" : "bg-white border-slate-100 shadow-sm hover:border-orange-200"
    )}>
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0", color)}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="font-black text-sm text-slate-800 truncate">{title}</h5>
        <p className="text-xs text-slate-500 font-medium">{desc}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500" />
      </div>
    </button>
  );
}

function SyllabusScreen({ syllabus, onToggle, onBack, isDarkMode }: { 
  syllabus: Subject[], 
  onToggle: (s: string, c: string) => void,
  onBack: () => void,
  isDarkMode: boolean
}) {
  const [activeTab, setActiveTab] = useState(syllabus[0].id);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className={cn("p-2 rounded-xl transition-colors", isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black tracking-tighter">Mission Map</h2>
      </header>

      <div className={cn("flex gap-2 p-1.5 rounded-[24px] border", isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200")}>
        {syllabus.map(s => (
          <button 
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={cn(
              "flex-1 py-3 rounded-[18px] font-black text-xs uppercase tracking-widest transition-all",
              activeTab === s.id 
                ? (isDarkMode ? "bg-orange-500 text-white shadow-lg" : "bg-white text-orange-600 shadow-sm") 
                : (isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600")
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {syllabus.find(s => s.id === activeTab)?.chapters.map(chapter => (
          <motion.div 
            key={chapter.id}
            layout
            onClick={() => onToggle(activeTab, chapter.id)}
            className={cn(
              "p-5 rounded-[28px] border transition-all cursor-pointer flex items-center justify-between group",
              chapter.completed 
                ? (isDarkMode ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-100") 
                : (isDarkMode ? "bg-slate-900 border-slate-800 hover:border-orange-500/50" : "bg-white border-slate-100 hover:border-orange-200")
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all",
                chapter.completed 
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-sm" 
                  : (isDarkMode ? "border-slate-800 group-hover:border-orange-500" : "border-slate-200 group-hover:border-orange-500")
              )}>
                {chapter.completed && <CheckCircle2 className="w-5 h-5" />}
              </div>
              <span className={cn(
                "font-bold text-sm",
                chapter.completed 
                  ? (isDarkMode ? "text-emerald-400 line-through opacity-50" : "text-emerald-800 line-through opacity-60") 
                  : (isDarkMode ? "text-slate-200" : "text-slate-700")
              )}>{chapter.title}</span>
            </div>
            {chapter.completed && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-full">
                <Zap className="w-3 h-3 text-emerald-500 fill-current" />
                <span className="text-[10px] font-black text-emerald-500">+50 XP</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function QuizScreen({ onBack, onComplete, isDarkMode }: { onBack: () => void, onComplete: (r: QuizResult) => void, isDarkMode: boolean }) {
  const [questions] = useState(() => [...MOCK_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished) {
      finishQuiz();
    }
  }, [timeLeft, isFinished]);

  const handleNext = () => {
    if (selectedOption === questions[currentIdx].correctAnswer) {
      setScore(s => s + 1);
    }
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOption(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    const finalScore = score + (selectedOption === questions[currentIdx].correctAnswer ? 1 : 0);
    onComplete({
      date: new Date().toISOString(),
      subjectId: questions[0].subjectId,
      score: finalScore,
      total: questions.length
    });
  };

  if (isFinished) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto p-6 text-center space-y-10 pt-16">
        <div className="relative inline-block">
          <div className="w-40 h-40 bg-orange-100 rounded-full flex items-center justify-center mx-auto ring-8 ring-orange-50">
            <Award className="w-20 h-20 text-orange-500" />
          </div>
          <div className="absolute -top-2 -right-2 bg-indigo-500 text-white w-14 h-14 rounded-full flex flex-col items-center justify-center text-xs font-black shadow-lg">
             <span>Level</span>
             <span className="text-xl">UP</span>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-black tracking-tight">Mission Accomplished!</h2>
          <p className={isDarkMode ? "text-slate-400" : "text-slate-500"}>You collected {score * 20} XP</p>
          <div className="flex justify-center gap-4 mt-6">
            <div className="px-6 py-4 bg-slate-900 text-white rounded-3xl flex flex-col items-center">
              <span className="text-[10px] font-black uppercase opacity-50">Score</span>
              <span className="text-2xl font-black">{score}/{questions.length}</span>
            </div>
            <div className="px-6 py-4 bg-orange-500 text-white rounded-3xl flex flex-col items-center">
              <span className="text-[10px] font-black uppercase opacity-50">XP Earned</span>
              <span className="text-2xl font-black">+{score * 20}</span>
            </div>
          </div>
        </div>
        <button onClick={onBack} className="w-full bg-slate-900 text-white font-black py-5 rounded-[24px] active:scale-95 transition-all shadow-xl shadow-slate-200">
          Dismiss Mission
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <header className="flex items-center justify-between">
        <button onClick={onBack} className={cn("p-2 rounded-xl", isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4">
          <div className={cn("px-4 py-2 rounded-full flex items-center gap-2 font-black text-xs", isDarkMode ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-700")}>
            <Timer className="w-4 h-4" />
            0:{timeLeft.toString().padStart(2, '0')}
          </div>
          <span className="font-black text-slate-400 text-xs uppercase tracking-widest">{currentIdx + 1}/{questions.length}</span>
        </div>
      </header>

      <div className="space-y-8">
        <div className={cn("p-8 rounded-[32px] border-b-8", isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
          <h3 className="text-2xl font-black leading-tight tracking-tight">{questions[currentIdx].question}</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {questions[currentIdx].options.map((opt, i) => (
            <button 
              key={i}
              onClick={() => setSelectedOption(i)}
              className={cn(
                "group w-full p-6 bg-white border-2 rounded-[28px] text-left transition-all active:scale-[0.98] shadow-sm relative overflow-hidden",
                selectedOption === i 
                  ? (isDarkMode ? "border-orange-500 bg-orange-500/10" : "border-orange-500 bg-orange-50") 
                  : (isDarkMode ? "bg-slate-950 border-slate-800 hover:border-slate-700" : "border-slate-100 hover:border-slate-200")
              )}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all",
                  selectedOption === i ? "bg-orange-500 text-white shadow-lg" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                )}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className={cn("font-bold", selectedOption === i ? "text-orange-900" : (isDarkMode ? "text-slate-200" : "text-slate-700"))}>{opt}</span>
              </div>
              {selectedOption === i && (
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-orange-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <button 
        disabled={selectedOption === null}
        onClick={handleNext}
        className="w-full bg-slate-900 text-white font-black py-5 rounded-[24px] active:scale-95 transition-all shadow-2xl shadow-slate-200 disabled:opacity-50"
      >
        {currentIdx === questions.length - 1 ? 'Complete Quest' : 'Advance Forward'}
      </button>
    </motion.div>
  );
}

function StrengthMapScreen({ results, syllabus, onBack, isDarkMode }: { results: QuizResult[], syllabus: Subject[], onBack: () => void, isDarkMode: boolean }) {
  const chartData = syllabus.map(s => {
    const subjectResults = results.filter(r => r.subjectId === s.id);
    const totalQuestions = subjectResults.reduce((acc, r) => acc + r.total, 0);
    const correctAnswers = subjectResults.reduce((acc, r) => acc + r.score, 0);
    const strength = totalQuestions === 0 ? 30 : Math.max(30, Math.round((correctAnswers / totalQuestions) * 100)); // Default 30 for visualization
    return { subject: s.name, strength, full: 100 };
  });

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className={cn("p-2 rounded-xl transition-colors", isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black tracking-tighter">Strength Analytics</h2>
      </header>

      <div className={cn("p-8 rounded-[40px] border shadow-2xl overflow-hidden", isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-50")}>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke={isDarkMode ? "#1E293B" : "#F1F5F9"} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 11, fontWeight: 900 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Strength"
                dataKey="strength"
                stroke="#F97316"
                strokeWidth={3}
                fill="#FB923C"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4 mt-8">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject Proficiency</h4>
          {chartData.map(d => (
            <div key={d.subject} className={cn("p-4 rounded-3xl flex items-center justify-between", isDarkMode ? "bg-slate-800" : "bg-slate-50")}>
              <span className="font-bold text-sm">{d.subject}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${d.strength}%` }} />
                </div>
                <span className="font-black text-sm w-10 text-right">{d.strength}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TutorScreen({ chatHistory, setChatHistory, onBack, isDarkMode }: { 
  chatHistory: ChatMessage[], 
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  onBack: () => void,
  isDarkMode: boolean
}) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('WebkitSpeechRecognition' in window || 'speechRecognition' in window)) {
      const SpeechRecognition = (window as any).WebkitSpeechRecognition || (window as any).speechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInput("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput("");
    const newHistory = [...chatHistory, { role: "user" as const, text: userMsg }];
    setChatHistory(newHistory);
    setIsLoading(true);

    try {
      const res = await fetch("/api/tutor/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg,
          chatHistory: chatHistory.map(m => ({ 
            role: m.role, 
            parts: [{ text: m.text }] 
          }))
        })
      });
      const data = await res.json();
      if (data.response) {
        setChatHistory(prev => [...prev, { role: "model", text: data.response }]);
        // Simple Text-to-Speech
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.rate = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { role: "model", text: "Communication disruption. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn(
      "flex flex-col h-[calc(100vh-120px)] rounded-[40px] border shadow-2xl overflow-hidden relative",
      isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-white"
    )}>
      <header className={cn(
        "p-6 h-24 flex items-center justify-between border-b z-10",
        isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white/50 border-slate-100"
      )}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black tracking-tight text-lg leading-none">Deepa AI</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
            </div>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40 py-10">
             <div className="w-20 h-20 bg-slate-100 rounded-[30px] flex items-center justify-center mb-2">
                <Zap className="w-10 h-10 text-slate-400" />
             </div>
             <div className="max-w-xs mx-auto">
               <h3 className="font-black text-xl mb-2">Your Personal AI Brain</h3>
               <p className="text-xs font-bold leading-relaxed px-4">Ask anything about Science, Math, or Social Studies. I can even hear your voice!</p>
             </div>
             <div className="flex flex-wrap justify-center gap-2 px-6">
                {["Newton's Laws", "Algebra", "Human Rights", "Study Plan"].map(t => (
                  <button key={t} onClick={() => setInput(t === "Study Plan" ? "Create a 3-day study plan for Life Processes" : `Explain ${t} like I'm 5`)} className={cn("text-[10px] font-black px-4 py-2 rounded-full border border-slate-200 transition-colors uppercase tracking-widest", isDarkMode ? "hover:bg-slate-800 hover:border-slate-700" : "hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600")}>
                    {t}
                  </button>
                ))}
             </div>
          </div>
        )}
        {chatHistory.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={i} 
            className={cn(
              "max-w-[85%] p-5 rounded-[28px] text-sm leading-relaxed shadow-sm",
              msg.role === "user" 
                ? "ml-auto bg-slate-900 text-white rounded-tr-none" 
                : (isDarkMode ? "bg-slate-800 text-slate-200 rounded-tl-none border-l-4 border-indigo-500" : "bg-slate-50 text-slate-800 rounded-tl-none border-l-4 border-indigo-500 font-medium")
            )}
          >
            {msg.text}
          </motion.div>
        ))}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 p-5 bg-slate-100 rounded-[28px] w-24 rounded-tl-none">
            <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
          </motion.div>
        )}
      </div>

      <div className={cn("p-6 border-t relative z-10", isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
        <div className="relative flex items-center gap-3">
          <button 
            onClick={toggleListening}
            className={cn(
              "p-4 rounded-2xl shadow-xl transition-all active:scale-95",
              isListening ? "bg-red-500 text-white animate-pulse" : (isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-400")
            )}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <div className="relative flex-1">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder={isListening ? "Listening..." : "Ask your personal tutor..."}
              className={cn(
                "w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none font-bold",
                isDarkMode ? "bg-slate-800 border-transparent focus:border-indigo-500 text-white" : "bg-slate-100 border-transparent focus:border-indigo-500 text-slate-800"
              )}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-500 text-white rounded-xl shadow-lg hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LeaderboardScreen({ onBack, isDarkMode }: { onBack: () => void, isDarkMode: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className={cn("p-2 rounded-xl", isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black tracking-tighter">Leaderboard</h2>
      </header>

      <div className={cn("rounded-[40px] p-8 border shadow-xl", isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-white")}>
        <div className="flex items-center justify-around mb-12">
          <PodiumPlace rank={2} name={LEADERBOARD[1].name} points={LEADERBOARD[1].points} isDarkMode={isDarkMode} />
          <PodiumPlace rank={1} name={LEADERBOARD[0].name} points={LEADERBOARD[0].points} isDarkMode={isDarkMode} />
          <PodiumPlace rank={3} name={LEADERBOARD[2].name} points={LEADERBOARD[2].points} isDarkMode={isDarkMode} />
        </div>

        <div className="space-y-3">
          {LEADERBOARD.slice(3).map((entry) => (
            <div key={entry.rank} className={cn("p-4 rounded-3xl flex items-center justify-between border", isDarkMode ? "bg-slate-800/50 border-slate-800" : "bg-slate-50 border-slate-100")}>
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-black text-xs text-slate-500">{entry.rank}</span>
                <span className="font-bold">{entry.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-orange-500 fill-current" />
                <span className="font-black text-slate-700">{entry.points}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PodiumPlace({ rank, name, points, isDarkMode }: { rank: number, name: string, points: number, isDarkMode: boolean }) {
  const isTop = rank === 1;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className={cn(
          "rounded-3xl flex items-center justify-center text-white font-black shadow-2xl relative z-10",
          isTop ? "w-24 h-24 bg-orange-500 text-3xl" : "w-16 h-16 bg-slate-700 text-xl"
        )}>
          {name[0]}
        </div>
        <div className={cn(
          "absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white z-20 shadow-lg border-2",
          rank === 1 ? "bg-yellow-400 border-white" : rank === 2 ? "bg-slate-300 border-white" : "bg-orange-800 border-white"
        )}>
          {rank}
        </div>
        {isTop && <Star className="absolute -top-4 -left-4 w-10 h-10 text-yellow-400 fill-current animate-spin-slow" />}
      </div>
      <div className="text-center">
        <p className="font-black text-sm truncate w-24">{name.split(' ')[0]}</p>
        <p className="text-[10px] font-black uppercase text-orange-500">{points} XP</p>
      </div>
    </div>
  );
}

function ProfileScreen({ user, points, streak, level, onLogout, onBack, isDarkMode, syllabus, results }: { 
  user: { name: string }, 
  points: number, 
  streak: number, 
  level: number, 
  onLogout: () => void, 
  onBack: () => void,
  isDarkMode: boolean,
  syllabus: Subject[],
  results: QuizResult[]
}) {
  const completedChapters = syllabus.reduce((acc, s) => acc + s.chapters.filter(c => c.completed).length, 0);
  const totalChapters = syllabus.reduce((acc, s) => acc + s.chapters.length, 0);
  const quizCount = results.length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <button onClick={onBack} className={cn("p-2 rounded-xl transition-colors", isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black tracking-tighter">My Base</h2>
        <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      <div className={cn("p-8 rounded-[40px] border relative overflow-hidden", isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-xl shadow-slate-200")}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl relative">
            {user.name[0]}
            <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-sm border-4 border-white">
              {level}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black">{user.name}</h3>
            <p className="text-slate-400 font-bold text-sm">SSLC Warrior Rank #{Math.floor(Math.random() * 10) + 1}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <StatBox label="XP" value={points} icon={<Zap className="w-4 h-4 text-orange-500" />} isDarkMode={isDarkMode} />
          <StatBox label="Streak" value={streak} icon={<Flame className="w-4 h-4 text-orange-500" />} isDarkMode={isDarkMode} />
          <StatBox label="Chapters" value={completedChapters} icon={<BookMarked className="w-4 h-4 text-indigo-500" />} isDarkMode={isDarkMode} />
        </div>
      </div>

      <section className="space-y-4">
        <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-widest px-1">Battle Badges</h4>
        <div className="grid grid-cols-2 gap-4">
          {BADGES.map((badge, i) => {
            const isLocked = i > 1 && points < 500;
            return (
              <div 
                key={badge.id} 
                className={cn(
                  "p-5 rounded-[28px] border transition-all flex flex-col items-center text-center space-y-3",
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm",
                  isLocked && "opacity-40 grayscale"
                )}
              >
                <div className="text-4xl">{badge.icon}</div>
                <div>
                  <h5 className="font-black text-sm">{badge.name}</h5>
                  <p className="text-[10px] font-bold text-slate-400 leading-tight mt-1">{badge.description}</p>
                </div>
                {isLocked && <Lock className="w-4 h-4 text-slate-400 absolute top-2 right-2" />}
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-widest px-1">Academy Milestones</h4>
        <div className="space-y-3">
          <MilestoneItem label="Syllabus Mastery" current={completedChapters} total={totalChapters} color="bg-orange-500" isDarkMode={isDarkMode} />
          <MilestoneItem label="Quiz Participation" current={quizCount} total={20} color="bg-indigo-500" isDarkMode={isDarkMode} />
        </div>
      </section>
    </motion.div>
  );
}

function StatBox({ label, value, icon, isDarkMode }: { label: string, value: number, icon: React.ReactNode, isDarkMode: boolean }) {
  return (
    <div className={cn("p-4 rounded-3xl text-center flex flex-col items-center justify-center space-y-1 transition-colors", isDarkMode ? "bg-slate-800/50" : "bg-slate-50")}>
      {icon}
      <span className="text-lg font-black leading-none">{value}</span>
      <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider font-mono">{label}</span>
    </div>
  );
}

function MilestoneItem({ label, current, total, color, isDarkMode }: { label: string, current: number, total: number, color: string, isDarkMode: boolean }) {
  const percent = Math.min(100, Math.round((current / (total || 1)) * 100));
  return (
    <div className={cn("p-5 rounded-[28px] border shadow-sm space-y-3", isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
       <div className="flex justify-between items-center px-1">
         <span className="font-black text-sm">{label}</span>
         <span className="font-bold text-xs text-slate-400">{current} / {total}</span>
       </div>
       <div className={cn("h-2 w-full rounded-full overflow-hidden", isDarkMode ? "bg-slate-800" : "bg-slate-100")}>
         <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className={cn("h-full", color)} />
       </div>
    </div>
  );
}
