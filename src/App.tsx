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
  BookMarked
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from "recharts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { INITIAL_SYLLABUS, MOCK_QUESTIONS, Subject, Question } from "./data";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
type Screen = "LOGIN" | "DASHBOARD" | "SYLLABUS" | "QUIZ" | "STRENGTH" | "TUTOR";

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
  const [isLoading, setIsLoading] = useState(false);

  // Recovery from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedSyllabus = localStorage.getItem("syllabus");
    const savedResults = localStorage.getItem("quizResults");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setScreen("DASHBOARD");
    }
    if (savedSyllabus) setSyllabus(JSON.parse(savedSyllabus));
    if (savedResults) setQuizResults(JSON.parse(savedResults));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("syllabus", JSON.stringify(syllabus));
    localStorage.setItem("quizResults", JSON.stringify(quizResults));
  }, [user, syllabus, quizResults]);

  const toggleChapter = (subjectId: string, chapterId: string) => {
    setSyllabus(prev => prev.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          chapters: s.chapters.map(c => c.id === chapterId ? { ...c, completed: !c.completed } : c)
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
    localStorage.removeItem("user");
    setUser(null);
    setScreen("LOGIN");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      <AnimatePresence mode="wait">
        {screen === "LOGIN" && <LoginScreen onLogin={(name) => { setUser({ name }); setScreen("DASHBOARD"); }} />}
        {screen === "DASHBOARD" && <DashboardScreen user={user!} onNavigate={setScreen} progress={calculateProgress()} onLogout={handleLogout} />}
        {screen === "SYLLABUS" && <SyllabusScreen syllabus={syllabus} onToggle={toggleChapter} onBack={() => setScreen("DASHBOARD")} />}
        {screen === "QUIZ" && <QuizScreen onBack={() => setScreen("DASHBOARD")} onComplete={(res) => setQuizResults(prev => [...prev, res])} />}
        {screen === "STRENGTH" && <StrengthMapScreen results={quizResults} syllabus={syllabus} onBack={() => setScreen("DASHBOARD")} />}
        {screen === "TUTOR" && <TutorScreen chatHistory={chatHistory} setChatHistory={setChatHistory} onBack={() => setScreen("DASHBOARD")} />}
      </AnimatePresence>
    </div>
  );
}

// --- Screens ---

function LoginScreen({ onLogin }: { onLogin: (name: string) => void }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-screen p-6"
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-orange-500 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-orange-100 mb-6"
          >
            <BookOpen className="text-white w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Akshara-Deepa</h1>
          <p className="text-slate-500 font-medium italic">Your SSLC Learning Companion</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Student Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                  placeholder="Enter your name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            disabled={!name}
            onClick={() => onLogin(name)}
            className="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 hover:bg-slate-800 shadow-lg shadow-slate-200"
          >
            Start Learning
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardScreen({ user, onNavigate, progress, onLogout }: { 
  user: { name: string }, 
  onNavigate: (s: Screen) => void,
  progress: number,
  onLogout: () => void
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      <header className="flex items-center justify-between pt-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Namaste, {user.name}! 👋</h2>
          <p className="text-slate-500">Ready for today's mission?</p>
        </div>
        <button onClick={onLogout} className="p-3 bg-slate-100 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-colors">
          <Settings className="w-6 h-6" />
        </button>
      </header>

      <div className="bg-orange-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-orange-200">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest opacity-80">Today's Goal</span>
          </div>
          <h3 className="text-2xl font-bold max-w-sm">Complete at least one chapter or take a daily quiz!</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium opacity-80">Syllabus Completion</span>
              <span className="text-2xl font-black">{progress}%</span>
            </div>
            <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              />
            </div>
          </div>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12">
          <Awards className="w-64 h-64" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MenuCard 
          title="Syllabus" 
          icon={<BookMarked className="w-7 h-7" />} 
          color="bg-blue-500" 
          onClick={() => onNavigate("SYLLABUS")} 
        />
        <MenuCard 
          title="Daily Quiz" 
          icon={<Timer className="w-7 h-7" />} 
          color="bg-purple-500" 
          onClick={() => onNavigate("QUIZ")} 
        />
        <MenuCard 
          title="Strength" 
          icon={<BarChart3 className="w-7 h-7" />} 
          color="bg-teal-500" 
          onClick={() => onNavigate("STRENGTH")} 
        />
        <MenuCard 
          title="AI Tutor" 
          icon={<MessageSquare className="w-7 h-7" />} 
          color="bg-indigo-500" 
          onClick={() => onNavigate("TUTOR")} 
        />
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-orange-500" />
          Recent Achievements
        </h4>
        <div className="space-y-3">
          <AchievementItem title="First Step" desc="Completed your first logic quiz" date="Yesterday" />
          <AchievementItem title="Science Geek" desc="Mastered 2 science chapters" date="2 days ago" />
        </div>
      </div>
    </motion.div>
  );
}

function MenuCard({ title, icon, color, onClick }: { title: string, icon: React.ReactNode, color: string, onClick: () => void }) {
  return (
    <motion.button 
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-4 group transition-all hover:bg-slate-50"
    >
      <div className={cn("p-4 rounded-2xl text-white shadow-lg", color)}>
        {icon}
      </div>
      <span className="font-bold text-slate-700">{title}</span>
    </motion.button>
  );
}

function AchievementItem({ title, desc, date }: { title: string, desc: string, date: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
        <Trophy className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h5 className="font-bold text-sm leading-tight">{title}</h5>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <span className="text-[10px] uppercase tracking-tighter font-bold text-slate-300 group-hover:text-slate-400">{date}</span>
    </div>
  );
}

function SyllabusScreen({ syllabus, onToggle, onBack }: { 
  syllabus: Subject[], 
  onToggle: (s: string, c: string) => void,
  onBack: () => void 
}) {
  const [activeTab, setActiveTab] = useState(syllabus[0].id);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto p-6 space-y-6"
    >
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">Syllabus Tracker</h2>
      </header>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
        {syllabus.map(s => (
          <button 
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={cn(
              "flex-1 py-2 rounded-xl font-bold text-sm transition-all",
              activeTab === s.id ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {syllabus.find(s => s.id === activeTab)?.chapters.map(chapter => (
          <motion.div 
            key={chapter.id}
            layout
            onClick={() => onToggle(activeTab, chapter.id)}
            className={cn(
              "p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group",
              chapter.completed 
                ? "bg-emerald-50 border-emerald-100" 
                : "bg-white border-slate-100 hover:border-orange-200"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                chapter.completed 
                  ? "bg-emerald-500 border-emerald-500 text-white" 
                  : "border-slate-200 group-hover:border-orange-500"
              )}>
                {chapter.completed && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <span className={cn(
                "font-medium",
                chapter.completed ? "text-emerald-800 line-through opacity-60" : "text-slate-700"
              )}>{chapter.title}</span>
            </div>
            <ChevronRight className={cn(
              "w-5 h-5",
              chapter.completed ? "text-emerald-300" : "text-slate-300 group-hover:text-orange-300"
            )} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function QuizScreen({ onBack, onComplete }: { onBack: () => void, onComplete: (r: QuizResult) => void }) {
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
      setIsFinished(true);
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
    onComplete({
      date: new Date().toISOString(),
      subjectId: questions[0].subjectId, // Simplified
      score: score + (selectedOption === questions[currentIdx].correctAnswer ? 1 : 0),
      total: questions.length
    });
  };

  if (isFinished) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto p-6 text-center space-y-8 pt-20">
        <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-16 h-16 text-orange-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Quiz Complete!</h2>
          <p className="text-slate-500">You scored {score}/{questions.length}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onBack} className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform">
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full flex items-center gap-2 font-bold">
            <Timer className="w-4 h-4" />
            0:{timeLeft.toString().padStart(2, '0')}
          </div>
          <span className="font-bold text-slate-400">Question {currentIdx + 1}/{questions.length}</span>
        </div>
      </header>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold leading-tight">{questions[currentIdx].question}</h3>
        <div className="space-y-3">
          {questions[currentIdx].options.map((opt, i) => (
            <button 
              key={i}
              onClick={() => setSelectedOption(i)}
              className={cn(
                "w-full p-6 bg-white border-2 rounded-2xl text-left font-semibold transition-all active:scale-[0.98]",
                selectedOption === i ? "border-orange-500 bg-orange-50 text-orange-900" : "border-slate-100 hover:border-slate-200"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-black",
                  selectedOption === i ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  {String.fromCharCode(65 + i)}
                </div>
                {opt}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button 
        disabled={selectedOption === null}
        onClick={handleNext}
        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all disabled:opacity-50"
      >
        {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
      </button>
    </motion.div>
  );
}

function StrengthMapScreen({ results, syllabus, onBack }: { results: QuizResult[], syllabus: Subject[], onBack: () => void }) {
  const chartData = syllabus.map(s => {
    const subjectResults = results.filter(r => r.subjectId === s.id);
    const totalQuestions = subjectResults.reduce((acc, r) => acc + r.total, 0);
    const correctAnswers = subjectResults.reduce((acc, r) => acc + r.score, 0);
    const strength = totalQuestions === 0 ? 0 : Math.round((correctAnswers / totalQuestions) * 100);
    return { subject: s.name, strength, full: 100 };
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto p-6 space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">Strength Map</h2>
      </header>

      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 13, fontWeight: 700 }} />
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
        
        <div className="grid grid-cols-1 gap-4 mt-4">
          {chartData.map(d => (
            <div key={d.subject} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="font-bold text-slate-600">{d.subject}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${d.strength}%` }} />
                </div>
                <span className="font-black text-slate-800 w-10 text-right">{d.strength}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TutorScreen({ chatHistory, setChatHistory, onBack }: { 
  chatHistory: ChatMessage[], 
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  onBack: () => void 
}) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
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
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { role: "model", text: "Sorry, I'm having trouble connecting to the brain. Please try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-screen max-w-2xl mx-auto border-x border-slate-100 bg-white shadow-2xl">
      <header className="p-4 border-bottom bg-white z-10 flex items-center gap-4 shrink-0 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 leading-none">Akshara-Deepa AI</h2>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Always Learning</span>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-8 py-10 opacity-50">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                <BookOpen className="w-8 h-8 text-slate-400" />
             </div>
             <p className="font-medium">Ask me anything about Science, Math, or Social Studies!</p>
             <div className="flex flex-wrap justify-center gap-2">
                {["Newton's Laws", "Photosynthesis", "Triangles"].map(t => (
                  <button key={t} onClick={() => setInput(t)} className="text-xs font-bold px-3 py-2 bg-slate-100 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-colors">
                    Explain {t}
                  </button>
                ))}
             </div>
          </div>
        )}
        {chatHistory.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={cn(
              "max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed",
              msg.role === "user" 
                ? "ml-auto bg-slate-900 text-white rounded-tr-none" 
                : "bg-slate-100 text-slate-800 rounded-tl-none font-medium"
            )}
          >
            {msg.text}
          </motion.div>
        ))}
        {isLoading && (
          <div className="max-w-[85%] p-4 rounded-3xl bg-slate-100 text-slate-400 rounded-tl-none animate-pulse">
            Thinking...
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="relative flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Type your question..."
            className="w-full pl-4 pr-14 py-4 bg-slate-100 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-3 bg-indigo-500 text-white rounded-xl shadow-lg hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Icons
function Awards(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
