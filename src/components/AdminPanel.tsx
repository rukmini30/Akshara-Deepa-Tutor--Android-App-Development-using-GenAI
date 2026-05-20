import React, { useState } from "react";
import { ArrowLeft, Plus, Trash, Users, BookOpen, AlertCircle, Sparkles, CheckCircle, Database } from "lucide-react";
import { Question, Subject } from "../data";
import { ActiveUserSession } from "../types";
import { motion } from "motion/react";

interface AdminPanelProps {
  onBack: () => void;
  isDarkMode: boolean;
  questions: Question[];
  onAddQuestion: (q: Omit<Question, "id">) => void;
  onDeleteQuestion: (id: string) => void;
  subjects: Subject[];
  activeUsers: ActiveUserSession[];
  onRewardXP: (userId: string, xpAmount: number) => void;
}

export function AdminPanel({
  onBack,
  isDarkMode,
  questions,
  onAddQuestion,
  onDeleteQuestion,
  subjects,
  activeUsers,
  onRewardXP
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"users" | "curriculum" | "logs">("users");

  // Add question state
  const [newQuestion, setNewQuestion] = useState("");
  const [subjectId, setSubjectId] = useState("science");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      alert("Please fill in all options!");
      return;
    }

    onAddQuestion({
      subjectId,
      question: newQuestion.trim(),
      options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
      correctAnswer
    });

    setNewQuestion("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer(0);

    setSuccessMsg("Practice question injected successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const logs = [
    { id: "1", time: "12:12:04", event: "Vite dev server established successfully", status: "ok" },
    { id: "2", time: "12:15:30", event: "Gemini 3.5 AI Core connection authenticated", status: "success" },
    { id: "3", time: "12:20:10", event: "Document parsing engine calibrated on SSLC Standards", status: "info" },
    { id: "4", time: "12:24:45", event: "Streak diagnostics updated", status: "info" }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <button 
          onClick={onBack} 
          className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-slate-800 text-slate-100" : "hover:bg-slate-100 text-slate-800"}`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest font-mono">System Console</span>
          <h2 className="text-3xl font-black tracking-tighter">Admin Panel</h2>
        </div>
      </header>

      {/* Admin Tabs */}
      <div className={`flex gap-2 p-1 rounded-[24px] border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 py-3 rounded-[18px] font-black text-xs uppercase tracking-widest transition-all gap-2 flex items-center justify-center ${
            activeTab === "users"
              ? (isDarkMode ? "bg-orange-500 text-white shadow-lg" : "bg-white text-orange-600 shadow-sm")
              : (isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600")
          }`}
        >
          <Users className="w-4 h-4" /> Users List
        </button>
        <button
          onClick={() => setActiveTab("curriculum")}
          className={`flex-1 py-3 rounded-[18px] font-black text-xs uppercase tracking-widest transition-all gap-2 flex items-center justify-center ${
            activeTab === "curriculum"
              ? (isDarkMode ? "bg-orange-500 text-white shadow-lg" : "bg-white text-orange-600 shadow-sm")
              : (isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600")
          }`}
        >
          <BookOpen className="w-4 h-4" /> Syllabus MCQs
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex-1 py-3 rounded-[18px] font-black text-xs uppercase tracking-widest transition-all gap-2 flex items-center justify-center ${
            activeTab === "logs"
              ? (isDarkMode ? "bg-orange-500 text-white shadow-lg" : "bg-white text-orange-600 shadow-sm")
              : (isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600")
          }`}
        >
          <Database className="w-4 h-4" /> System Logs
        </button>
      </div>

      {/* Tab: Users */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className={`rounded-3xl border p-6 ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}>
            <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-orange-500">
               <Sparkles className="w-5 h-5 fill-current" /> Active SSLC Warriors
            </h3>
            <p className="text-slate-400 text-xs mb-6 font-medium">Click on quick reward buttons to award bonus experience points (XP) to mock classroom participants.</p>
            
            <div className="space-y-4">
              {activeUsers.map(usr => (
                <div 
                  key={usr.id} 
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-md">
                      {usr.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm">{usr.name}</span>
                        {usr.activeNow && (
                          <span className="bg-emerald-500/10 text-emerald-500 py-0.5 px-2 rounded-full text-[8px] font-black uppercase tracking-wider animate-pulse border border-emerald-500/10">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-bold font-mono">Level {usr.level} • {usr.points} XP • 🔥 {usr.streak} Streak</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button 
                      onClick={() => onRewardXP(usr.id, 50)} 
                      className={`text-[10px] font-black tracking-widest uppercase px-3 py-2 rounded-xl border transition-colors ${
                        isDarkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-650" : "bg-white hover:bg-slate-100"
                      }`}
                    >
                      +50 XP
                    </button>
                    <button 
                      onClick={() => onRewardXP(usr.id, 200)} 
                      className="text-[10px] font-black tracking-widest uppercase px-3 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-md transition-colors"
                    >
                      +200 XP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Quiz manager */}
      {activeTab === "curriculum" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Creator form */}
          <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}>
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">Inject Practice Question</h3>
            <p className="text-slate-400 text-xs mb-6">Create multiple-choice questions that instantly append to student test quizzes.</p>

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl mb-4 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> {successMsg}
              </div>
            )}

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Target Subject</label>
                <select 
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                  className={`w-full tracking-wide p-3.5 mt-1 border-2 border-transparent rounded-xl font-bold text-xs outline-none ${
                    isDarkMode ? "bg-slate-800 text-white focus:border-orange-500" : "bg-slate-100 text-slate-800 focus:border-orange-500"
                  }`}
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Question Statement</label>
                <textarea 
                  rows={2}
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  placeholder="e.g. Under normal conditions, which compound represents an active base?"
                  className={`w-full p-3.5 mt-1 border-2 border-transparent rounded-xl text-xs font-bold outline-none resize-none ${
                    isDarkMode ? "bg-slate-800 text-white focus:border-orange-500" : "bg-slate-100 text-slate-800 focus:border-orange-500"
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Option A</label>
                  <input 
                    type="text"
                    value={optionA}
                    onChange={e => setOptionA(e.target.value)}
                    placeholder="Option A"
                    className={`w-full p-3 mt-1 border-2 border-transparent rounded-xl text-xs font-bold outline-none ${
                      isDarkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Option B</label>
                  <input 
                    type="text"
                    value={optionB}
                    onChange={e => setOptionB(e.target.value)}
                    placeholder="Option B"
                    className={`w-full p-3 mt-1 border-2 border-transparent rounded-xl text-xs font-bold outline-none ${
                      isDarkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Option C</label>
                  <input 
                    type="text"
                    value={optionC}
                    onChange={e => setOptionC(e.target.value)}
                    placeholder="Option C"
                    className={`w-full p-3 mt-1 border-2 border-transparent rounded-xl text-xs font-bold outline-none ${
                      isDarkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Option D</label>
                  <input 
                    type="text"
                    value={optionD}
                    onChange={e => setOptionD(e.target.value)}
                    placeholder="Option D"
                    className={`w-full p-3 mt-1 border-2 border-transparent rounded-xl text-xs font-bold outline-none ${
                      isDarkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800"
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Correct Option Index (0-3)</label>
                <div className="flex gap-2 mt-1">
                  {[0, 1, 2, 3].map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setCorrectAnswer(val)}
                      className={`flex-1 py-2 rounded-lg font-black text-xs ${
                        correctAnswer === val
                          ? "bg-indigo-500 text-white shadow-md shadow-indigo-100 dark:shadow-none"
                          : (isDarkMode ? "bg-slate-850 text-slate-400 hover:text-white" : "bg-slate-105 text-slate-500 hover:bg-slate-200")
                      }`}
                    >
                      {String.fromCharCode(65 + val)} ({val})
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black tracking-widest uppercase rounded-2xl flex items-center justify-center gap-2 mt-2 transition-all shadow-lg active:scale-95"
              >
                <Plus className="w-4 h-4" /> Inject to Quiz Database
              </button>
            </form>
          </div>

          {/* List existing */}
          <div className={`p-6 rounded-3xl border flex flex-col max-h-[640px] overflow-hidden ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}>
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">Database Registry ({questions.length} Questions)</h3>
            <p className="text-slate-400 text-xs mb-4">View questions currently in practice circulation or clear any customized duplicates.</p>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {questions.map(q => (
                <div 
                  key={q.id} 
                  className={`p-4 rounded-2xl border space-y-2 relative group ${
                    isDarkMode ? "bg-slate-900 border-slate-850" : "bg-slate-50 border-slate-100/80"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[8px] font-black uppercase bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md">
                      {q.subjectId}
                    </span>
                    <button 
                      onClick={() => onDeleteQuestion(q.id)}
                      className="p-1 px-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-xs flex items-center gap-1 font-bold"
                      title="Delete Question"
                    >
                      <Trash className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 leading-snug">{q.question}</h4>
                  <p className="text-[10px] font-black text-orange-500 font-mono">Correct: {q.options[q.correctAnswer]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: System Logs */}
      {activeTab === "logs" && (
        <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}>
          <h3 className="font-black text-lg mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-indigo-500" /> VM Node Telemetry
          </h3>
          <p className="text-slate-400 text-xs mb-6">Real-time status stream monitoring of local services, Vite asset hotloads, and API routes.</p>
          
          <div className="bg-slate-950 text-emerald-400 font-mono p-5 rounded-2xl border border-slate-800 space-y-4 text-xs leading-relaxed max-h-[400px] overflow-y-auto">
            {logs.map(log => (
              <div key={log.id} className="flex gap-4">
                <span className="text-slate-500 shrink-0 select-none">[{log.time}]</span>
                <div>
                  <span className="text-indigo-400 font-black">SYSTEM_DIAG_OK: </span>
                  <span className="text-slate-200">{log.event}</span>
                </div>
              </div>
            ))}
            <div className="flex gap-4 animate-pulse">
              <span className="text-slate-600">[{new Date().toTimeString().split(' ')[0]}]</span>
              <span className="text-emerald-500 font-bold">● CLOUD_NODE_STABLE_HEARTBEAT_OK - Ready for student ingress</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
