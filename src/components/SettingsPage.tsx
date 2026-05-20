import React, { useState } from "react";
import { ArrowLeft, Volume2, Calendar, Target, Award, Users, Trash2, Check, RefreshCw } from "lucide-react";
import { UserSettings } from "../types";
import { motion } from "motion/react";

interface SettingsPageProps {
  onBack: () => void;
  isDarkMode: boolean;
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
  onClearData: () => void;
}

export function SettingsPage({
  onBack,
  isDarkMode,
  settings,
  onUpdateSettings,
  onClearData
}: SettingsPageProps) {
  const [goal, setGoal] = useState(settings.studyGoalMinutes);
  const [voice, setVoice] = useState(settings.voiceName);
  const [sounds, setSounds] = useState(settings.soundEffects);
  const [reminder, setReminder] = useState(settings.dailyReminder);
  const [examDate, setExamDate] = useState(settings.examDate);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = () => {
    onUpdateSettings({
      studyGoalMinutes: Number(goal),
      voiceName: voice,
      soundEffects: sounds,
      dailyReminder: reminder,
      reminderTime: settings.reminderTime,
      examDate: examDate
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-slate-800 text-slate-100" : "hover:bg-slate-100 text-slate-800"}`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-black tracking-tighter">Control Center</h2>
        </div>
        <button 
          onClick={handleSave} 
          className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 dark:shadow-none"
        >
          Save Changes
        </button>
      </header>

      {savedMsg && (
        <div className="p-4 bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl animate-bounce text-center">
          Preferences Secured! 🚀
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Study Goals */}
        <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}>
          <h3 className="font-black text-lg mb-2 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" /> Study Quest Scope
          </h3>
          <p className="text-slate-400 text-xs mb-6">Setup study indicators to benchmark your syllabus and diagnostic checklists.</p>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Daily Study Goal (Minutes)</label>
              <div className="flex items-center gap-3 mt-1.5">
                {[15, 30, 45, 60].map(mins => (
                  <button
                    key={mins}
                    onClick={() => setGoal(mins)}
                    className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${
                      goal === mins 
                        ? "bg-slate-900 text-white font-black dark:bg-orange-500" 
                        : (isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">10th Board Exam Target</label>
              <input 
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className={`w-full tracking-wide py-3.5 px-4 mt-1.5 border-2 border-transparent rounded-xl font-bold text-xs outline-none ${
                  isDarkMode ? "bg-slate-800 text-white focus:border-orange-500" : "bg-slate-100 text-slate-800 focus:border-orange-500"
                }`}
              />
            </div>
          </div>
        </div>

        {/* AI Voice Configuration */}
        <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}>
          <h3 className="font-black text-lg mb-2 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-indigo-500" /> Audio Synthesizer
          </h3>
          <p className="text-slate-400 text-xs mb-6">Modify system voice feedback settings for the AI tutor Text-to-Speech (TTS) feature.</p>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tutor Voice Type</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {["Kore", "Zephyr", "Puck", "Charon"].map(vName => (
                  <button
                    key={vName}
                    onClick={() => setVoice(vName)}
                    className={`py-3 rounded-xl font-black text-xs transition-all ${
                      voice === vName
                        ? "bg-indigo-500 text-white"
                        : (isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600 hover:bg-slate-150")
                    }`}
                  >
                    {vName}
                  </button>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-xl flex items-center justify-between border mt-2 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-150"
            }`}>
              <div>
                <span className="text-xs font-black block">App Sound Effects</span>
                <span className="text-[10px] text-slate-400 font-medium font-sans">Trigger alerts for milestones and quest completes</span>
              </div>
              <input 
                type="checkbox"
                checked={sounds}
                onChange={e => setSounds(e.target.checked)}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Reset Storage & Storage telemetry */}
        <div className={`md:col-span-2 p-6 rounded-3xl border border-red-500/10 bg-red-500/5`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="font-black text-lg text-red-500 flex items-center gap-2">Reset Database</h3>
              <p className="text-[11px] font-medium text-slate-400">This action clears local progress, mock leaderboards, study goals history, and uploaded PDF files completely.</p>
            </div>
            
            <button
              onClick={() => {
                if (confirm("Are you positive you wish to clear all local data? Your current XP levels will reset.")) {
                  onClearData();
                }
              }}
              className="py-3 px-5 bg-red-500 hover:bg-red-650 text-white text-xs tracking-widest font-black uppercase rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 active:scale-95"
            >
              <Trash2 className="w-4 h-4" /> Hard Reset App Data
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
