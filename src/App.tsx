import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  MessageSquare, 
  Settings, 
  Trophy, 
  ArrowLeft, 
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
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
  Sparkles,
  ShieldCheck,
  Bell,
  Sliders,
  CheckCircle,
  GraduationCap,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";

import { 
  INITIAL_SYLLABUS, 
  MOCK_QUESTIONS, 
  LEADERBOARD, 
  BADGES,
  Subject, 
  Question 
} from "./data";

import { 
  Screen, 
  ChatMessage, 
  QuizResult, 
  UploadedFile, 
  AppNotification, 
  UserSettings, 
  ActiveUserSession 
} from "./types";

// Import custom modular components
import { SyllabusScreen } from "./components/SyllabusScreen";
import { QuizScreen } from "./components/QuizScreen";
import { TutorScreen } from "./components/TutorScreen";
import { StrengthMapScreen } from "./components/StrengthMapScreen";
import { SettingsPage } from "./components/SettingsPage";
import { AdminPanel } from "./components/AdminPanel";
import { NotificationPanel } from "./components/NotificationPanel";

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("LOGIN");
  const [user, setUser] = useState<{ name: string; focusZone?: string } | null>(null);
  const [syllabus, setSyllabus] = useState<Subject[]>(INITIAL_SYLLABUS);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(1);
  const [level, setLevel] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Custom user preferences state
  const [settings, setSettings] = useState<UserSettings>({
    studyGoalMinutes: 30,
    voiceName: "Kore",
    soundEffects: true,
    dailyReminder: true,
    reminderTime: "18:00",
    examDate: "2026-06-15"
  });

  // Custom user notifications array
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "welcome",
      title: "Board Preparation Calibrated",
      message: "Akshara-Deepa has synchronized on state syllabus guidelines. Welcome!",
      type: "system",
      timestamp: "Just Now",
      read: false
    }
  ]);

  // Active simulated students in cohort
  const [activeUsersInCohort, setActiveUsersInCohort] = useState<ActiveUserSession[]>([
    { id: "u2", name: "Ramesh Gowda", level: 3, points: 1450, activeNow: true, avatarSeed: "ramesh", streak: 5 },
    { id: "u3", name: "Priya Hegde", level: 4, points: 2100, activeNow: true, avatarSeed: "priya", streak: 8 },
    { id: "u4", name: "Anil Kulkarni", level: 2, points: 820, activeNow: false, avatarSeed: "anil", streak: 2 },
    { id: "u5", name: "Sneha Patil", level: 5, points: 2600, activeNow: true, avatarSeed: "sneha", streak: 12 }
  ]);

  // Load state from localStorage on init
  useEffect(() => {
    const savedUser = localStorage.getItem("user_profile");
    const savedSyllabus = localStorage.getItem("syllabus_tracker");
    const savedResults = localStorage.getItem("quiz_records");
    const savedQuestions = localStorage.getItem("questions_database");
    const savedPoints = localStorage.getItem("user_points");
    const savedStreak = localStorage.getItem("user_streak");
    const savedLevel = localStorage.getItem("user_level");
    const savedTheme = localStorage.getItem("user_theme");
    const savedSettings = localStorage.getItem("user_settings");
    const savedNotifications = localStorage.getItem("user_notifications");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setScreen("DASHBOARD");
    }
    if (savedSyllabus) setSyllabus(JSON.parse(savedSyllabus));
    if (savedResults) setQuizResults(JSON.parse(savedResults));
    if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
    if (savedPoints) setPoints(Number(savedPoints));
    if (savedStreak) setStreak(Number(savedStreak));
    if (savedLevel) setLevel(Number(savedLevel));
    if (savedTheme) setIsDarkMode(savedTheme === "dark");
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, []);

  // Sync state to localStorage on modify
  useEffect(() => {
    if (user) localStorage.setItem("user_profile", JSON.stringify(user));
    localStorage.setItem("syllabus_tracker", JSON.stringify(syllabus));
    localStorage.setItem("quiz_records", JSON.stringify(quizResults));
    localStorage.setItem("questions_database", JSON.stringify(questions));
    localStorage.setItem("user_points", points.toString());
    localStorage.setItem("user_streak", streak.toString());
    localStorage.setItem("user_level", level.toString());
    localStorage.setItem("user_theme", isDarkMode ? "dark" : "light");
    localStorage.setItem("user_settings", JSON.stringify(settings));
    localStorage.setItem("user_notifications", JSON.stringify(notifications));
  }, [user, syllabus, quizResults, questions, points, streak, level, isDarkMode, settings, notifications]);

  // Simulated live event updater
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      // Small chance of active users updating their points or active status
      setActiveUsersInCohort(prev => prev.map(u => {
        if (Math.random() > 0.7) {
          const addedXp = Math.floor(Math.random() * 4) * 20;
          const nextPoints = u.points + addedXp;
          const nextLvl = Math.floor(nextPoints / 500) + 1;
          return {
            ...u,
            points: nextPoints,
            level: nextLvl,
            activeNow: Math.random() > 0.4
          };
        }
        return u;
      }));
    }, 20000);

    return () => clearInterval(interval);
  }, [user]);

  const addNotification = (title: string, message: string, type: AppNotification["type"]) => {
    const newNote: AppNotification = {
      id: Math.random().toString(),
      title,
      message,
      type,
      timestamp: "Just Now",
      read: false
    };
    setNotifications(prev => [newNote, ...prev]);
    if (settings.soundEffects) {
      // Gentle notification tone if native audio context works
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // fail-silent
      }
    }
  };

  const addPoints = (amount: number) => {
    setPoints(prev => {
      const nextPoints = prev + amount;
      const nextLevel = Math.floor(nextPoints / 500) + 1;
      if (nextLevel > level) {
        setLevel(nextLevel);
        addNotification("Level Up Secured! 🌟", `Congratulations! You climbed to Rank Level ${nextLevel}.`, "achievement");
      }
      return nextPoints;
    });
  };

  // Manage custom quiz completions
  const handleQuizFinished = (score: number, total: number, subjectId: string) => {
    const earnedXp = score * 20;
    const newResult: QuizResult = {
      date: new Date().toLocaleDateString(),
      subjectId,
      score,
      total
    };

    setQuizResults(prev => [...prev, newResult]);
    addPoints(earnedXp);

    if (score === total) {
      addNotification("Perfect Quiz Score! 🎯", `You secured full marks on your ${subjectId} board drill!`, "achievement");
    } else {
      addNotification("Quiz Board Uploaded", `Practice drill completed. Logged accuracy is ${Math.round((score/total)*100)}%.`, "study_goal");
    }
  };

  // Appending custom questions from uploads or admin injections
  const handleAddQuestion = (q: Omit<Question, "id">) => {
    const newQ: Question = {
      ...q,
      id: `custom-question-${Math.random().toString(36).substr(2, 9)}`
    };
    setQuestions(prev => [newQ, ...prev]);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleInjectUploadedQuestions = (extractedQuestions: Question[]) => {
    setQuestions(prev => [...extractedQuestions, ...prev]);
  };

  // Manage check list completions
  const handleToggleChapter = (subjectId: string, chapterId: string) => {
    setSyllabus(prev => prev.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          chapters: s.chapters.map(c => {
            if (c.id === chapterId) {
              const nextState = !c.completed;
              if (nextState) {
                addPoints(50);
                addNotification("Syllabus Target Secured Check", `Marked ${c.title} as cleared (+50 XP)`, "study_goal");
              }
              return { ...c, completed: nextState };
            }
            return c;
          })
        };
      }
      return s;
    }));
  };

  // Calculate master progress percent
  const getMasterProgress = () => {
    let total = 0;
    let completed = 0;
    syllabus.forEach(s => {
      total += s.chapters.length;
      completed += s.chapters.filter(c => c.completed).length;
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  // Chat request AI
  const handleSendChatMessage = async (userPrompt: string) => {
    const updatedHistory: ChatMessage[] = [...chatHistory, { role: "user", text: userPrompt }];
    setChatHistory(updatedHistory);

    try {
      const response = await fetch("/api/tutor/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userPrompt,
          chatHistory: chatHistory.map(m => ({ 
            role: m.role, 
            parts: [{ text: m.text }] 
          }))
        })
      });

      if (!response.ok) throw new Error("Connection failed");
      const result = await response.json();

      if (result.response) {
        setChatHistory(prev => [...prev, { role: "model", text: result.response }]);
        
        // Dynamic Text-to-Speech synthesizer playback if enabled
        if (settings.voiceName) {
          try {
            const utter = new SpeechSynthesisUtterance(result.response);
            utter.rate = 1.05;
            window.speechSynthesis.speak(utter);
          } catch (speakErr) {
            // fail-silent
          }
        }
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: "model", text: "Deepa AI had a slight delay. Please retry asking your SSLC academic issue." }]);
    }
  };

  const handleClearAllData = () => {
    localStorage.clear();
    setUser(null);
    setSyllabus(INITIAL_SYLLABUS);
    setQuizResults([]);
    setQuestions(MOCK_QUESTIONS);
    setChatHistory([]);
    setPoints(0);
    setStreak(1);
    setLevel(1);
    setNotifications([
      {
        id: "reset_notif",
        title: "All Progress Rebuilt",
        message: "Your local learning metrics have been cleared.",
        type: "system",
        timestamp: "Just Now",
        read: false
      }
    ]);
    setScreen("LOGIN");
  };

  const handleMarkCollectionRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAllNotes = () => {
    setNotifications([]);
  };

  // Award mock XP manually in admin
  const handleRewardXPAction = (userId: string, xpAmount: number) => {
    if (userId === "current-user") {
      addPoints(xpAmount);
    } else {
      setActiveUsersInCohort(prev => prev.map(usr => {
        if (usr.id === userId) {
          const nextPoints = usr.points + xpAmount;
          return {
            ...usr,
            points: nextPoints,
            level: Math.floor(nextPoints / 500) + 1
          };
        }
        return usr;
      }));
    }
  };

  const combinedActiveStudentsList: ActiveUserSession[] = [
    { id: "current-user", name: user?.name || "Student Warrior", level, points, activeNow: true, avatarSeed: "user", streak },
    ...activeUsersInCohort
  ];

  return (
    <div className={cn(
      "min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900 transition-colors duration-300 pb-20",
      isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-905"
    )}>
      {/* Top Brand Header Bar */}
      {screen !== "LOGIN" && (
        <header className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl ${
          isDarkMode ? "bg-slate-950/80 border-slate-900" : "bg-white/80 border-slate-150"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-sm shadow-md">
              A
            </div>
            <div>
              <h1 className="font-black text-sm tracking-tight leading-none">Akshara-Deepa</h1>
              <span className="text-[9px] text-slate-400 font-bold block mt-0.5">SSLC STUDY PLATFORM</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification triggers */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className={`p-2.5 rounded-xl border relative transition-all ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white" : "bg-slate-50 border-slate-150 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Bell className="w-4 h-4" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce" />
              )}
            </button>

            {/* Admin entry button */}
            <button
              onClick={() => setScreen("ADMIN")}
              className={`p-2.5 rounded-xl border transition-all ${
                isDarkMode ? "bg-slate-900 border-slate-850 text-orange-400 hover:text-orange-300" : "bg-orange-55 border-orange-100 text-orange-600 hover:bg-orange-100 shadow-sm"
              }`}
              title="VM System Console"
            >
              <Sliders className="w-4 h-4 text-orange-500" />
            </button>

            {/* Dark mode toggler */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl border transition-all ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-yellow-400" : "bg-white border-slate-150 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="text-xs font-black select-none">{isDarkMode ? "🌙" : "☀️"}</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Workspace Frame */}
      <main className="max-w-md mx-auto md:max-w-5xl px-4 pt-6">
        <AnimatePresence mode="wait">
          {screen === "LOGIN" && (
            <LoginScreen 
              onLogin={(username, focusZone) => {
                setUser({ name: username, focusZone });
                setScreen("DASHBOARD");
                addNotification("Student Profile Activated", `Synchronized on study stream (${focusZone || "General"}). Good luck!`, "system");
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {user && (
            <div className="space-y-6">
              {screen === "DASHBOARD" && (
                <DashboardScreen 
                  user={user}
                  progress={getMasterProgress()}
                  points={points}
                  streak={streak}
                  level={level}
                  onNavigate={setScreen}
                  isDarkMode={isDarkMode}
                  results={quizResults}
                />
              )}

              {screen === "SYLLABUS" && (
                <SyllabusScreen 
                  syllabus={syllabus} 
                  onToggle={handleToggleChapter} 
                  onBack={() => setScreen("DASHBOARD")} 
                  isDarkMode={isDarkMode} 
                />
              )}

              {screen === "QUIZ" && (
                <QuizScreen 
                  questions={questions}
                  onFinishQuiz={handleQuizFinished}
                  onBack={() => setScreen("DASHBOARD")}
                  isDarkMode={isDarkMode}
                  subjectId={user.focusZone || "science"}
                />
              )}

              {screen === "STRENGTH" && (
                <StrengthMapScreen 
                  onBack={() => setScreen("DASHBOARD")}
                  isDarkMode={isDarkMode}
                  syllabus={syllabus}
                  results={quizResults}
                  onStartQuiz={(subId) => {
                    // Update user focus zone temporary on current test scope
                    setUser(prev => prev ? { ...prev, focusZone: subId } : null);
                    setScreen("QUIZ");
                  }}
                />
              )}

              {screen === "TUTOR" && (
                <TutorScreen 
                  messages={chatHistory}
                  onSendMessage={handleSendChatMessage}
                  onBack={() => setScreen("DASHBOARD")}
                  isDarkMode={isDarkMode}
                  syllabus={syllabus}
                  onInjectUploadedQuestions={handleInjectUploadedQuestions}
                  onAddNotification={addNotification}
                />
              )}

              {screen === "LEADERBOARD" && (
                <LeaderboardScreen 
                  onBack={() => setScreen("DASHBOARD")} 
                  isDarkMode={isDarkMode} 
                  cohortUsers={combinedActiveStudentsList}
                />
              )}

              {screen === "PROFILE" && (
                <ProfileScreen 
                  user={user} 
                  points={points} 
                  streak={streak} 
                  level={level} 
                  onLogout={handleClearAllData} 
                  onBack={() => setScreen("DASHBOARD")} 
                  isDarkMode={isDarkMode} 
                  syllabus={syllabus} 
                  results={quizResults} 
                />
              )}

              {screen === "SETTINGS" && (
                <SettingsPage 
                  onBack={() => setScreen("DASHBOARD")}
                  isDarkMode={isDarkMode}
                  settings={settings}
                  onUpdateSettings={setSettings}
                  onClearData={handleClearAllData}
                />
              )}

              {screen === "ADMIN" && (
                <AdminPanel 
                  onBack={() => setScreen("DASHBOARD")}
                  isDarkMode={isDarkMode}
                  questions={questions}
                  onAddQuestion={handleAddQuestion}
                  onDeleteQuestion={handleDeleteQuestion}
                  subjects={syllabus}
                  activeUsers={combinedActiveStudentsList}
                  onRewardXP={handleRewardXPAction}
                />
              )}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Bottom Floating Navigation Dock */}
      {screen !== "LOGIN" && (
        <nav className={cn(
          "fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-lg h-16 rounded-2xl flex items-center justify-around px-2 z-40 border shadow-2xl transition-all",
          isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/95 border-slate-150"
        )}>
          <NavButton icon={<LayoutDashboard className="w-5 h-5" />} active={screen === "DASHBOARD"} onClick={() => setScreen("DASHBOARD")} label="Dashboard" />
          <NavButton icon={<BookMarked className="w-5 h-5" />} active={screen === "SYLLABUS"} onClick={() => setScreen("SYLLABUS")} label="Syllabus" />
          <NavButton icon={<MessageSquare className="w-5 h-5" />} active={screen === "TUTOR"} onClick={() => setScreen("TUTOR")} label="AI Tutor" />
          <NavButton icon={<Trophy className="w-5 h-5" />} active={screen === "LEADERBOARD"} onClick={() => setScreen("LEADERBOARD")} label="Ranks" />
          <NavButton icon={<User className="w-5 h-5" />} active={screen === "PROFILE"} onClick={() => setScreen("PROFILE")} label="Base" />
          <NavButton icon={<Settings className="w-5 h-5" />} active={screen === "SETTINGS"} onClick={() => setScreen("SETTINGS")} label="Settings" />
        </nav>
      )}

      {/* Floating Side notification Hub */}
      <NotificationPanel 
        notifications={notifications}
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onClearAll={handleClearAllNotes}
        onMarkRead={handleMarkCollectionRead}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

// Sub-compo: Navigation button
function NavButton({ icon, active, onClick, label }: { icon: React.ReactNode; active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="relative flex flex-col items-center justify-center p-1.5 group select-none flex-1">
      <div className={cn(
        "transition-all duration-300",
        active ? "text-orange-500 scale-110 -translate-y-1" : "text-slate-400 group-hover:text-slate-500"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-[8px] tracking-wide font-black uppercase mt-0.5 transition-all text-center leading-none",
        active ? "text-orange-500 opacity-100" : "text-slate-400 group-hover:text-slate-500 opacity-60"
      )}>{label}</span>
      {active && <motion.div layoutId="nav-glow-bar" className="absolute -bottom-1.5 w-6 h-1 bg-orange-500 rounded-full" />}
    </button>
  );
}

// Authentication Screen Component
function LoginScreen({ onLogin, isDarkMode }: { onLogin: (username: string, focusZone: string) => void; isDarkMode: boolean }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [focusZone, setFocusZone] = useState("science");

  const [signupStep, setSignupStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [authError, setAuthError] = useState("");

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const handleRequestOtp = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpCode(code);
    setOtpSent(true);
    setAuthError("");
    
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch {
      // fail-silent
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    if (isSignUp) {
      if (signupStep < 3) {
        setSignupStep(3);
        handleRequestOtp();
        return;
      }
      if (enteredOtp !== otpCode) {
        setAuthError("Incorrect verification OTP. Match the simulated dispatch key.");
        return;
      }
    }
    onLogin(username.trim(), focusZone);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(`Diagnostic reset guide dispatched to ${forgotEmail}. Password reset to: "sslcscholar"`);
    setSecretKey("sslcscholar");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[85vh] p-4 relative overflow-hidden"
    >
      {/* Visual background lights */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-200/40 dark:bg-orange-950/15 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-200/40 dark:bg-indigo-950/10 blur-[120px] rounded-full animate-pulse" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
            <BookOpen className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-350">
            Akshara-Deepa
          </h1>
          <p className="text-sm font-black text-orange-500 uppercase tracking-widest -mt-1">AI BOARD COMPANION</p>
          <p className="text-xs text-slate-400 font-bold max-w-xs mx-auto">Mastering Karnataka SSLC guidelines, equations, and chapter summaries.</p>
        </div>

        {/* Toggle between In and Up */}
        <div className={`p-6 sm:p-8 rounded-[40px] border shadow-2xl space-y-6 ${
          isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white/80 border-slate-100 backdrop-blur-xl"
        }`}>
          {/* Tabs */}
          {!isForgotPassword && (
            <div className={`flex gap-1 p-1 rounded-2xl border ${
              isDarkMode ? "bg-slate-950 border-slate-850" : "bg-slate-100 border-slate-200/50"
            }`}>
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setSignupStep(1); setOtpSent(false); setAuthError(""); }}
                className={`flex-1 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-colors ${
                  !isSignUp 
                    ? (isDarkMode ? "bg-orange-500 text-white" : "bg-white text-orange-650 shadow-sm") 
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setAuthError(""); }}
                className={`flex-1 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-colors ${
                  isSignUp 
                    ? (isDarkMode ? "bg-orange-500 text-white" : "bg-white text-orange-655 shadow-sm") 
                    : "text-slate-400 hover:text-slate-705"
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {authError && (
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-red-500/20">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" /> {authError}
            </div>
          )}

          {isForgotPassword ? (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-orange-500">Reset Scholar Passkey</h3>
                <p className="text-[11px] text-slate-400 mt-1 pb-1">Provide your credentials email address to retrieve simulated passkeys.</p>
              </div>

              {forgotSuccess ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 rounded-2xl text-xs font-bold leading-normal text-center">
                    {forgotSuccess}
                  </div>
                  <button 
                    type="button"
                    onClick={() => { setIsForgotPassword(false); setForgotSuccess(""); }}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md"
                  >
                    Proceed to Sign In
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Student Registered Email</label>
                    <input 
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      className={`w-full px-4 py-3 border-2 border-transparent rounded-xl outline-none font-bold text-xs ${
                        isDarkMode ? "bg-slate-850 text-white focus:border-orange-500" : "bg-slate-50 focus:border-orange-500 text-slate-850"
                      }`}
                      placeholder="e.g. scholarship@sslchub.in"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl border ${
                        isDarkMode ? "bg-slate-850 border-slate-800 text-white" : "bg-slate-100 border-slate-150 text-slate-605"
                      }`}
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md animate-pulse"
                    >
                      Request Key
                    </button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isSignUp ? (
                // Login form
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Syllabus Warrior Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                      <input 
                        type="text" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 border-2 border-transparent rounded-xl outline-none font-bold text-xs transition-colors ${
                          isDarkMode ? "bg-slate-850 text-white focus:border-orange-500" : "bg-slate-50 focus:border-orange-500 text-slate-850"
                        }`}
                        placeholder="e.g. Anand Gowda"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pass-key</label>
                      <button 
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-[9px] font-black uppercase tracking-wider text-orange-500 hover:underline"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="password" 
                        value={secretKey}
                        onChange={e => setSecretKey(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 border-2 border-transparent rounded-xl outline-none font-bold text-xs transition-colors ${
                          isDarkMode ? "bg-slate-850 text-white focus:border-orange-500" : "bg-slate-50 focus:border-orange-500 text-slate-800"
                        }`}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-xs tracking-widest font-black uppercase rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    <ShieldCheck className="w-4 h-4" /> Initialize Core Study Map
                  </button>
                </div>
              ) : (
                // SignUp flow with choices
                <div className="space-y-4">
                  {signupStep === 1 ? (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Full Name</label>
                        <input 
                          type="text" 
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          className={`w-full px-4 py-3 border-2 border-transparent rounded-xl outline-none font-bold text-xs transition-colors ${
                            isDarkMode ? "bg-slate-805 text-white focus:border-orange-500" : "bg-slate-50 focus:border-orange-500 text-slate-800"
                          }`}
                          placeholder="Anand Gowda"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">School Board Grade</label>
                        <input 
                          type="text" 
                          value="Karnataka Grade 10 (SSLC)"
                          disabled
                          className={`w-full px-4 py-3 border-2 border-transparent rounded-xl cursor-not-allowed font-bold text-xs opacity-60 ${
                            isDarkMode ? "bg-slate-850 text-slate-400" : "bg-slate-50 text-slate-450"
                          }`}
                        />
                      </div>
                      <button
                        type="button"
                        disabled={!username.trim()}
                        onClick={() => setSignupStep(2)}
                        className="w-full py-3.5 bg-orange-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                      >
                        Choose Board Stream &rarr;
                      </button>
                    </div>
                  ) : signupStep === 2 ? (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Primary Practice Focus</span>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1">This configures which subject drill questions appear during challenge modes.</p>
                        
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          {[
                            { id: "science", label: "Science Core" },
                            { id: "math", label: "Mathematics" },
                            { id: "social", label: "Hist & Civics" }
                          ].map(st => (
                            <button
                              type="button"
                              key={st.id}
                              onClick={() => setFocusZone(st.id)}
                              className={`p-3.5 rounded-xl border-2 transition-all font-black text-[10px] uppercase text-center ${
                                focusZone === st.id
                                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-500"
                                  : (isDarkMode ? "border-slate-800 text-slate-400 hover:text-white" : "border-slate-150 text-slate-600 hover:bg-slate-100")
                              }`}
                            >
                              {st.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSignupStep(1)}
                          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl border ${
                            isDarkMode ? "bg-slate-850 border-slate-800" : "bg-slate-100 border-slate-150 text-slate-605"
                          }`}
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                          Proceed & Verification &rarr;
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Step 3 OTP Verification UI
                    <div className="space-y-4 animate-fade-in text-center">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-orange-500">Security Check</h4>
                        <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-normal">
                          For test compliance, we simulated sending a mobile verification code:
                        </p>
                      </div>

                      {otpSent && (
                        <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-black rounded-xl">
                          💌 Verification Key: <span className="font-mono text-base tracking-wider">{otpCode}</span>
                        </div>
                      )}

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Verification OTP</label>
                        <input 
                          type="text"
                          maxLength={4}
                          value={enteredOtp}
                          onChange={e => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                          className={`w-full py-3 text-center font-black text-lg tracking-[0.5em] border-2 border-transparent rounded-xl outline-none transition-colors ${
                            isDarkMode ? "bg-slate-850 text-orange-500 focus:border-orange-500" : "bg-slate-50 focus:border-orange-500 text-slate-800"
                          }`}
                          placeholder="0000"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSignupStep(2)}
                          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl border ${
                            isDarkMode ? "bg-slate-850 border-slate-800 text-white" : "bg-slate-100 border-slate-150 text-slate-605"
                          }`}
                        >
                          Stream Setup
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                          Activate Profile
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="text-[10px] font-black text-indigo-500 tracking-wider hover:underline"
                      >
                        Resend Code (Simulated)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}

          {/* Social Demo Google Login */}
          <div className="border-t border-slate-100 dark:border-slate-850 pt-4 text-center space-y-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Classroom Credentials Mode</span>
            <button
              onClick={() => {
                setUsername("Sanjay Hegde");
                setFocusZone("math");
                onLogin("Sanjay Hegde", "math");
              }}
              className={`w-full py-3.5 border-2 rounded-2xl text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:bg-red-500/5 ${
                isDarkMode ? "bg-slate-855 border-slate-800 hover:border-red-500/30" : "bg-slate-50 hover:bg-white border-slate-150"
              }`}
            >
              <svg className="w-4 h-4 text-red-500 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.922 1 1 5.922 1 12s4.922 11 11.24 11c6.59 0 10.97-4.63 10.97-11.16 0-.75-.08-1.32-.177-1.84H12.24z"/>
              </svg>
              Sign In with Google Portal
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// SaaS Layout DashboardScreen Component
function DashboardScreen({
  user,
  progress,
  points,
  streak,
  level,
  onNavigate,
  isDarkMode,
  results
}: { 
  user: { name: string; focusZone?: string }, 
  progress: number, 
  points: number, 
  streak: number, 
  level: number,
  onNavigate: (s: Screen) => void,
  isDarkMode: boolean,
  results: QuizResult[]
}) {
  const currentLevelBound = level * 500;
  const currentThreshold = (level - 1) * 500;
  const currentProgressXp = points - currentThreshold;
  const xpPercentage = Math.round((currentProgressXp / 500) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      {/* Top Welcome Card */}
      <section className={`p-6 sm:p-8 rounded-[40px] border relative overflow-hidden ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-xl shadow-slate-100/50"
      }`}>
        {/* Background ambient lighting */}
        <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-orange-400/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-md">
              {user.name[0]}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest font-mono">Warrior Base</span>
              <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
              
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1 bg-orange-50 dark:bg-slate-800 text-orange-600 dark:text-orange-400 py-0.5 px-2.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                  🔥 {streak} Day Streak
                </div>
                <div className="flex items-center gap-1 bg-indigo-50 dark:bg-slate-805 text-indigo-650 dark:text-indigo-400 py-0.5 px-2.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                  ⚡ {points} total xp
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-mono">Current Grade Rank</span>
              <p className="font-extrabold text-sm mt-0.5 text-indigo-500">SSLC Level {level}</p>
            </div>
          </div>
        </div>

        {/* XP Level progression indicator */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-850 space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-450 tracking-wider">
            <span>Next Level Milestone</span>
            <span>{currentProgressXp} / 500 XP to Level {level + 1}</span>
          </div>
          <div className={`h-2 w-full rounded-full overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
            <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${xpPercentage}%` }} />
          </div>
        </div>
      </section>

      {/* Modern Bento Sizing Cards layout */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Progress gauge card */}
        <div className={`col-span-2 p-6 rounded-[36px] border flex flex-col justify-between h-48 relative overflow-hidden group ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-900 text-white"
        }`}>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Quest Progress</span>
              <h3 className="text-xl font-black leading-tight mt-1">Syllabus Completion</h3>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                <span className="opacity-70">{progress}% Completed</span>
                <span className="opacity-90">Level {level}</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
          <BookMarked className="absolute top-[-20px] right-[-20px] w-40 h-40 opacity-[0.04] rotate-12" />
        </div>

        {/* AI Tutor shortcut */}
        <button
          onClick={() => onNavigate("TUTOR")}
          className="col-span-1 p-6 bg-gradient-to-br from-indigo-500 to-indigo-650 hover:to-indigo-700 text-white rounded-[36px] flex flex-col justify-between text-left transition-transform active:scale-95 group shadow-lg"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-115 transition-transform shrink-0 shadow-inner">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[8px] font-black uppercase tracking-[0.15em] opacity-75">AI Companion</span>
            <p className="font-black text-sm leading-tight mt-1">Academics<br />Support</p>
          </div>
        </button>

        {/* Quick Quiz Shortcut */}
        <button
          onClick={() => onNavigate("QUIZ")}
          className={`col-span-1 p-6 border rounded-[36px] flex flex-col justify-between text-left transition-transform active:scale-95 group shadow-sm ${
            isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-150 text-slate-850"
          }`}
        >
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-115 transition-transform shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">Board prep</span>
            <p className="font-black text-sm leading-tight mt-1 block">Quick<br />Quiz</p>
          </div>
        </button>
      </section>

      {/* Middle Analytical chart row */}
      <section className={`p-6 rounded-[36px] border ${
        isDarkMode ? "bg-slate-900/50 border-slate-850" : "bg-white border-slate-150 shadow-sm"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-black text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-orange-500 animate-pulse" /> Weekly Study Activity
            </h4>
            <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Caliber output based on daily XP achievements</span>
          </div>
          <span className="bg-indigo-50 dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 text-[8px] font-black uppercase px-2.5 py-1 rounded-full border border-indigo-100 dark:border-slate-800">
             7 Days active
          </span>
        </div>

        {/* Area statistics charts */}
        <div className="h-32 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { name: "Mon", xp: 120 },
              { name: "Tue", xp: 220 },
              { name: "Wed", xp: 90 },
              { name: "Thu", xp: 340 },
              { name: "Fri", xp: 200 },
              { name: "Sat", xp: 480 },
              { name: "Sun", xp: commentsXPCount(results) }
            ]}>
              <defs>
                <linearGradient id="chartGlowUp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip contentStyle={{ borderRadius: "16px", fontWeight: "bold", fontSize: "10px", outline: "none" }} />
              <Area type="monotone" dataKey="xp" stroke="#f97316" strokeWidth={3} fill="url(#chartGlowUp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Suggested Focus and actionable study goals */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Board Prep Action Targets</h4>
          <button 
            onClick={() => onNavigate("STRENGTH")}
            className="text-[10px] font-black text-indigo-500 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-1"
          >
             Analyze metrics &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FocusItem 
            title="Science Sectors Review" 
            desc="Examine high probability Board formulas on Acids & Bases" 
            metric="50 XP reward"
            onClick={() => onNavigate("SYLLABUS")} 
            isDarkMode={isDarkMode} 
          />
          <FocusItem 
            title="Quiz Diagnostic Test" 
            desc="Engage in standard practice board layout challenges." 
            metric="20 XP per MCQ"
            onClick={() => onNavigate("QUIZ")} 
            isDarkMode={isDarkMode} 
          />
        </div>
      </section>
    </motion.div>
  );
}

// Helper calculation
function commentsXPCount(res: QuizResult[]) {
  if (res.length === 0) return 250;
  return Math.min(600, res.reduce((acc, r) => acc + r.score * 20, 0));
}

// Quick action items for dashboard
function FocusItem({ title, desc, metric, onClick, isDarkMode }: { title: string; desc: string; metric: string; onClick: () => void; isDarkMode: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`p-5 rounded-3xl border text-left transition-all active:scale-[0.98] group flex items-center justify-between gap-4 w-full ${
        isDarkMode ? "bg-slate-900 border-slate-850 hover:border-orange-500/20" : "bg-white border-slate-150 hover:border-orange-200 shadow-sm"
      }`}
    >
      <div className="space-y-1">
        <h5 className="font-extrabold text-sm">{title}</h5>
        <p className="text-xs text-slate-450 leading-snug">{desc}</p>
        <span className="text-[10px] font-black uppercase text-orange-500 block font-mono">{metric}</span>
      </div>

      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
        isDarkMode ? "bg-slate-800" : "bg-slate-50 group-hover:bg-orange-50"
      }`}>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
      </div>
    </button>
  );
}

// Cohort Leaderboard screen
function LeaderboardScreen({ onBack, isDarkMode, cohortUsers }: { onBack: () => void; isDarkMode: boolean; cohortUsers: ActiveUserSession[] }) {
  const sorted = [...cohortUsers].sort((a,b) => b.points - a.points);
  const podium = [sorted[1], sorted[0], sorted[2]];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest font-mono">Cohort Rankings</span>
          <h2 className="text-3xl font-black tracking-tighter">Leaderboard</h2>
        </div>
      </header>

      <div className={`p-8 rounded-[40px] border shadow-xl ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-white"
      }`}>
        {/* Podium visualization */}
        <div className="flex items-end justify-around mb-12 xs:px-4">
          {podium[0] && <PodiumPlace rank={2} name={podium[0].name} points={podium[0].points} isDarkMode={isDarkMode} />}
          {podium[1] && <PodiumPlace rank={1} name={podium[1].name} points={podium[1].points} isDarkMode={isDarkMode} />}
          {podium[2] && <PodiumPlace rank={3} name={podium[2].name} points={podium[2].points} isDarkMode={isDarkMode} />}
        </div>

        {/* Scroll list */}
        <div className="space-y-3">
          {sorted.slice(3).map((usr, i) => (
            <div 
              key={usr.id} 
              className={`p-4 rounded-3xl flex items-center justify-between border ${
                usr.id === "current-user"
                  ? "bg-orange-500/10 border-orange-500/20 shadow-sm"
                  : (isDarkMode ? "bg-slate-800/40 border-slate-800" : "bg-slate-50 border-slate-100")
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-slate-500 dark:text-slate-400">
                  {i + 4}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm">{usr.name}</span>
                    {usr.activeNow && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active on platform" />
                    )}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 font-mono">Level {usr.level} • 🔥 {usr.streak} day streak</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-orange-500 fill-current shrink-0" />
                <span className="font-black text-xs">{usr.points}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Podium component item
function PodiumPlace({ rank, name, points, isDarkMode }: { rank: number; name: string; points: number; isDarkMode: boolean }) {
  const isWinner = rank === 1;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div className={cn(
          "rounded-3xl flex items-center justify-center text-white font-black shadow-lg relative z-10 select-none",
          isWinner ? "w-20 h-20 bg-orange-500 text-2xl" : "w-14 h-14 bg-slate-700 text-lg"
        )}>
          {name[0]}
        </div>
        <div className={cn(
          "absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] text-white z-20 border-2",
          rank === 1 ? "bg-yellow-400 border-white" : rank === 2 ? "bg-slate-300 border-white" : "bg-orange-800 border-white"
        )}>
          {rank}
        </div>
        {isWinner && <Star className="absolute -top-3.5 -left-3.5 w-8 h-8 text-yellow-400 fill-current animate-bounce" />}
      </div>
      <div className="text-center mt-2">
        <p className="font-black text-xs truncate w-20">{name.split(' ')[0]}</p>
        <span className="text-[8px] font-black text-orange-500 tracking-wider font-mono">{points} XP</span>
      </div>
    </div>
  );
}

// Profile and achievement checklist Screen
function ProfileScreen({ 
  user, 
  points, 
  streak, 
  level, 
  onLogout, 
  onBack, 
  isDarkMode, 
  syllabus, 
  results 
}: { 
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
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-black tracking-tighter">Milestone Center</h2>
        </div>
        <button 
          onClick={onLogout} 
          className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Hard Reset
        </button>
      </header>

      {/* Main Base Card */}
      <div className={`p-8 rounded-[40px] border relative overflow-hidden ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-xl"
      }`}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-black relative shadow-lg">
            {user.name[0]}
            <span className="absolute -bottom-2 -right-2 bg-slate-950 text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border-4 border-white dark:border-slate-900">
              {level}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-black">{user.name}</h3>
            <p className="text-xs text-slate-400 font-bold font-sans">Syllabus Warrior • Level {level} Candidate</p>
          </div>
        </div>

        {/* Stats counter row */}
        <div className="grid grid-cols-3 gap-3 mt-8">
          <StatBox label="Earned XP" value={points} icon={<Zap className="w-4 h-4 text-orange-500" />} isDarkMode={isDarkMode} />
          <StatBox label="Streak" value={streak} icon={<Flame className="w-4 h-4 text-orange-500 animate-pulse" />} isDarkMode={isDarkMode} />
          <StatBox label="Chapters Clear" value={completedChapters} icon={<BookMarked className="w-4 h-4 text-indigo-500" />} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Badges system */}
      <section className="space-y-3">
        <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-widest px-1">Board prep certificates</h4>
        <div className="grid grid-cols-2 gap-4">
          {BADGES.map((badge, i) => {
            const isLocked = i > 1 && points < 500;
            return (
              <div 
                key={badge.id} 
                className={`p-5 rounded-[28px] border transition-all flex flex-col items-center text-center space-y-2 relative ${
                  isDarkMode ? "bg-slate-900 border-slate-850" : "bg-white border-slate-100 shadow-sm"
                } ${isLocked ? "opacity-40 grayscale" : ""}`}
              >
                <div className="text-3xl">{badge.icon}</div>
                <div>
                  <h5 className="font-extrabold text-xs">{badge.name}</h5>
                  <p className="text-[9px] text-slate-400 font-bold leading-normal mt-1">{badge.description}</p>
                </div>
                {isLocked && (
                  <span className="absolute top-2 right-2 text-xs opacity-60">🔒</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Progress milestones */}
      <section className="space-y-3">
        <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-widest px-1">Syllabus Milestones</h4>
        <div className="space-y-4">
          <MilestoneItem label="Syllabus Core Coverage" current={completedChapters} total={totalChapters} color="bg-orange-500" isDarkMode={isDarkMode} />
          <MilestoneItem label="Board Mock Trials Triggered" current={quizCount} total={10} color="bg-indigo-500" isDarkMode={isDarkMode} />
        </div>
      </section>
    </motion.div>
  );
}

// Helper: Stat counter box
function StatBox({ label, value, icon, isDarkMode }: { label: string; value: number; icon: React.ReactNode; isDarkMode: boolean }) {
  return (
    <div className={`p-4 rounded-3xl text-center flex flex-col items-center justify-center space-y-1 transition-colors ${
      isDarkMode ? "bg-slate-800/40" : "bg-slate-50"
    }`}>
      {icon}
      <span className="text-base font-black leading-none">{value}</span>
      <span className="text-[7.5px] font-black uppercase text-slate-450 tracking-wider font-mono">{label}</span>
    </div>
  );
}

// Milestone progress bars
function MilestoneItem({ label, current, total, color, isDarkMode }: { label: string; current: number; total: number; color: string; isDarkMode: boolean }) {
  const percent = Math.min(100, Math.round((current / (total || 1)) * 100));
  return (
    <div className={`p-5 rounded-[28px] border ${
      isDarkMode ? "bg-slate-900 border-slate-850" : "bg-white border-slate-100 shadow-sm"
    }`}>
      <div className="flex justify-between items-center px-1 mb-2">
        <span className="font-black text-xs">{label}</span>
        <span className="font-bold text-[10px] text-slate-400 font-mono">{current} / {total}</span>
      </div>
      <div className={`h-2.5 w-full rounded-full overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
        <div className={cn("h-full", color)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
