import React, { useState } from "react";
import { ArrowLeft, CheckCircle2, Zap, Search, HelpCircle, GraduationCap } from "lucide-react";
import { Subject } from "../data";
import { motion, AnimatePresence } from "motion/react";

interface SyllabusScreenProps {
  syllabus: Subject[];
  onToggle: (subjectId: string, chapterId: string) => void;
  onBack: () => void;
  isDarkMode: boolean;
}

export function SyllabusScreen({
  syllabus,
  onToggle,
  onBack,
  isDarkMode
}: SyllabusScreenProps) {
  const [activeTab, setActiveTab] = useState(syllabus[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [completionFilter, setCompletionFilter] = useState<"all" | "completed" | "pending">("all");

  const currentSubject = syllabus.find(s => s.id === activeTab);
  
  // Find chapters on current subject matching keyword and status filter
  const filteredChapters = currentSubject?.chapters.filter(chapter => {
    const matchesSearch = chapter.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (completionFilter === "completed") {
      return matchesSearch && chapter.completed;
    }
    if (completionFilter === "pending") {
      return matchesSearch && !chapter.completed;
    }
    return matchesSearch;
  }) || [];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest font-mono">10th Grade SSLC</span>
            <h2 className="text-3xl font-black tracking-tighter">Mission Map</h2>
          </div>
        </div>

        {/* Action badges */}
        <div className="flex items-center gap-2">
          <div className={`px-4 py-2 rounded-full border text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
            isDarkMode ? "bg-slate-900 border-slate-800 text-orange-400" : "bg-orange-55 border-orange-100 text-orange-600 shadow-sm"
          }`}>
            <GraduationCap className="w-4 h-4 text-orange-500" />
            Karnataka SSLC Syllabus Core
          </div>
        </div>
      </header>

      {/* Subject Filter Tabs */}
      <div className={`flex gap-1.5 p-1.5 rounded-[24px] border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
        {syllabus.map(s => (
          <button 
            key={s.id}
            onClick={() => {
              setActiveTab(s.id);
              setSearchQuery("");
            }}
            className={`flex-1 py-3.5 rounded-[18px] font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === s.id 
                ? (isDarkMode ? "bg-orange-500 text-white shadow-xl shadow-orange-500/10" : "bg-white text-orange-655 shadow-sm") 
                : (isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-650")
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search chapters (e.g. Life, Equations, Triangle)..."
            className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all text-xs font-bold outline-none ${
              isDarkMode 
                ? "bg-slate-900 border-slate-800 focus:border-orange-500 text-white" 
                : "bg-white border-slate-150 focus:border-orange-500 shadow-sm text-slate-850"
            }`}
          />
        </div>

        {/* Completion Toggle selector */}
        <div className={`flex p-1 rounded-xl border self-start ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-150 shadow-sm"
        }`}>
          {["all", "completed", "pending"].map((cFilter) => (
            <button
              key={cFilter}
              onClick={() => setCompletionFilter(cFilter as any)}
              className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-colors ${
                completionFilter === cFilter
                  ? "bg-slate-900 text-white dark:bg-orange-500"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {cFilter}
            </button>
          ))}
        </div>
      </div>

      {/* Chapters content list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredChapters.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className={`p-10 rounded-3xl border text-center ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
              }`}
            >
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-sm text-slate-400">No chapters match your parameters</p>
              <p className="text-xs text-slate-500 mt-1">Try searching another term or resetting filters.</p>
            </motion.div>
          ) : (
            filteredChapters.map(chapter => (
              <motion.div 
                key={chapter.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => onToggle(activeTab, chapter.id)}
                className={`p-5 rounded-[28px] border transition-all cursor-pointer flex items-center justify-between group ${
                  chapter.completed 
                    ? (isDarkMode ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-100") 
                    : (isDarkMode ? "bg-slate-900 border-slate-800 hover:border-orange-500/50" : "bg-white border-slate-100 hover:border-orange-200 shadow-sm")
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                    chapter.completed 
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-sm" 
                      : (isDarkMode ? "border-slate-800 group-hover:border-orange-500" : "border-slate-250 group-hover:border-orange-500")
                  }`}>
                    {chapter.completed && <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <span className={`font-black text-sm ${
                    chapter.completed 
                      ? (isDarkMode ? "text-emerald-400 line-through opacity-50" : "text-emerald-800 line-through opacity-60") 
                      : (isDarkMode ? "text-slate-200" : "text-slate-800")
                  }`}>{chapter.title}</span>
                </div>
                {chapter.completed && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-full">
                    <Zap className="w-3 h-3 text-emerald-500 fill-current" />
                    <span className="text-[10px] font-black text-emerald-500">+50 XP</span>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
