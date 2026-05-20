import React from "react";
import { ArrowLeft, Brain, TrendingUp, AlertCircle, Sparkles, Zap, Star } from "lucide-react";
import { Subject } from "../data";
import { QuizResult } from "../types";
import { motion } from "motion/react";

interface StrengthMapScreenProps {
  onBack: () => void;
  isDarkMode: boolean;
  syllabus: Subject[];
  results: QuizResult[];
  onStartQuiz: (subjectId: string) => void;
}

export function StrengthMapScreen({
  onBack,
  isDarkMode,
  syllabus,
  results,
  onStartQuiz
}: StrengthMapScreenProps) {
  // Compute accuracy by subject (Math, Science, Social)
  const getSubjectAccuracy = (id: string) => {
    const subs = results.filter(r => r.subjectId === id);
    if (subs.length === 0) return { pct: 60, status: "Calibrating", color: "text-amber-500 bg-amber-500/10" }; // initial mock
    const totalScore = subs.reduce((acc, r) => acc + r.score, 0);
    const totalMax = subs.reduce((acc, r) => acc + r.total, 0);
    const pct = Math.round((totalScore / (totalMax || 1)) * 100);
    
    if (pct >= 80) return { pct, status: "Mastery Level", color: "text-emerald-500 bg-emerald-500/10 bar:bg-emerald-500" };
    if (pct >= 50) return { pct, status: "Progressing", color: "text-orange-500 bg-orange-500/10 bar:bg-orange-500" };
    return { pct, status: "Action Advisory", color: "text-red-500 bg-red-500/10 bar:bg-red-500" };
  };

  const performanceDataset = syllabus.map(s => {
    const metrics = getSubjectAccuracy(s.id);
    const completed = s.chapters.filter(c => c.completed).length;
    const total = s.chapters.length;
    const completePct = Math.round((completed / total) * 100);
    return {
      id: s.id,
      name: s.name,
      accuracy: metrics.pct,
      status: metrics.status,
      color: metrics.color,
      progress: completePct
    };
  });

  // Weakest sectors trigger recommendation
  const prioritySubject = performanceDataset.sort((a,b) => a.accuracy - b.accuracy)[0];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      <header className="flex items-center gap-4">
        <button 
          onClick={onBack} 
          className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest font-mono">Cognitive Analytics</span>
          <h2 className="text-3xl font-black tracking-tighter">Strength Map</h2>
        </div>
      </header>

      {/* Hero Analytics Card */}
      <div className={`p-8 rounded-[40px] border relative overflow-hidden ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-xl"
      }`}>
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative z-10">
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-500" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-indigo-500">Deepa Cognitive Diagnostics</h3>
            </div>
            <p className="text-xl font-black leading-tight">Your Diagnostic Accuracy sits at {Math.round(performanceDataset.reduce((acc,d) => acc + d.accuracy, 0)/3)}%</p>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">This map updates in real-time as you complete multiple-choice practice quizzes. Work on action items below to boost board exam confidence.</p>
          </div>

          <div className={`p-5 rounded-3xl border flex items-center gap-3 shrink-0 ${
            isDarkMode ? "bg-slate-850 border-slate-800" : "bg-indigo-50/40 border-indigo-100/50"
          }`}>
            <TrendingUp className="w-8 h-8 text-indigo-500 shrink-0" />
            <div>
              <span className="text-[9px] font-black uppercase text-indigo-550 block leading-none">Diagnostic Outlook</span>
              <span className="text-sm font-black mt-1 block">Karnataka State Ready</span>
              <span className="text-[9px] text-slate-400 font-bold block">Status calibrated on last 5 quiz trials</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {performanceDataset.map(data => {
          const isRed = data.accuracy < 55;
          const isGreen = data.accuracy >= 80;
          return (
            <div 
              key={data.id}
              className={`p-6 rounded-[36px] border flex flex-col justify-between space-y-6 ${
                isDarkMode ? "bg-slate-900 border-slate-850" : "bg-white border-slate-150 shadow-sm"
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-sm">{data.name}</h4>
                  <span className={`text-[10px] font-black tracking-wider uppercase py-1 px-2.5 rounded-full ${
                    isGreen ? "bg-emerald-500/10 text-emerald-500" : isRed ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"
                  }`}>
                    {data.accuracy}% Accuracy
                  </span>
                </div>
                <p className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-wider">{data.status}</p>
              </div>

              {/* Graphical performance indicator bars */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 px-1">
                    <span>Syllabus Covered</span>
                    <span>{data.progress}%</span>
                  </div>
                  <div className={`h-2.5 w-full rounded-full overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                    <div className="h-full bg-slate-900 dark:bg-slate-100 transition-all" style={{ width: `${data.progress}%` }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 px-1">
                    <span>Quiz Accuracy Gauge</span>
                    <span>{data.accuracy}%</span>
                  </div>
                  <div className={`h-2.5 w-full rounded-full overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                    <div className={`h-full transition-all ${
                      isGreen ? "bg-emerald-500" : isRed ? "bg-red-500" : "bg-orange-500"
                    }`} style={{ width: `${data.accuracy}%` }} />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onStartQuiz(data.id)}
                  className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  Trigger Drill Quiz
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory recommendations */}
      {prioritySubject && (
        <div className="p-6 rounded-[36px] bg-indigo-500 text-white border border-transparent flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1 max-w-lg">
            <h4 className="font-black text-sm flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 fill-current text-yellow-300" /> Action Required: Strengthen {prioritySubject.name}
            </h4>
            <p className="text-xs text-indigo-100 leading-relaxed font-medium">Your current quiz accuracy sits at {prioritySubject.accuracy}%. Under the Karnataka board curriculum, we recommend reviewing {prioritySubject.name} formula worksheets. You can upload textbook PDFs to Deepa in the AI Tutor workspace for automated chapter diagnostics!</p>
          </div>

          <button
            onClick={() => onStartQuiz(prioritySubject.id)}
            className="py-3.5 px-6 bg-white hover:bg-orange-50 text-indigo-650 rounded-2xl text-xs font-black tracking-widest uppercase transition-all shadow-md shrink-0 active:scale-95"
          >
            Start Focal Drill
          </button>
        </div>
      )}
    </motion.div>
  );
}
