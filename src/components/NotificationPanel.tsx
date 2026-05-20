import React from "react";
import { AppNotification } from "../types";
import { Bell, Check, Trash2, ShieldAlert, Award, Flame, Upload, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NotificationPanelProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
  onMarkRead: (id: string) => void;
  isDarkMode: boolean;
}

export function NotificationPanel({
  notifications,
  isOpen,
  onClose,
  onClearAll,
  onMarkRead,
  isDarkMode
}: NotificationPanelProps) {
  const getIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "achievement":
        return <Award className="w-5 h-5 text-yellow-500" />;
      case "streak":
        return <Flame className="w-5 h-5 text-orange-500" />;
      case "upload":
        return <Upload className="w-5 h-5 text-indigo-500" />;
      case "study_goal":
        return <Check className="w-5 h-5 text-emerald-500" />;
      default:
        return <Info className="w-5 h-5 text-sky-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-xs"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            className={`fixed top-4 right-4 bottom-4 w-96 max-w-[calc(100vw-32px)] z-50 rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-colors duration-300 ${
              isDarkMode 
                ? "bg-slate-900 border-slate-800 text-slate-100" 
                : "bg-white border-slate-100 text-slate-800"
            }`}
          >
            {/* Header */}
            <div className={`p-6 border-b flex items-center justify-between ${
              isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-50 bg-slate-50/50"
            }`}>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" />
                <h3 className="font-black tracking-tight text-lg">Activity Feed</h3>
                {unreadCount > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button 
                    onClick={onClearAll}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-xl transition-colors"
                    title="Clear All"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="px-3 py-1 bg-slate-150 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs font-black"
                >
                  Close
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-40 p-8 space-y-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <Bell className="w-8 h-8 text-slate-450" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Quiet in the Base</p>
                    <p className="text-xs">Notifications on your study streaks, awards, and AI uploads appear here.</p>
                  </div>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onMarkRead(n.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                      n.read 
                        ? (isDarkMode ? "bg-slate-900/30 border-slate-900/50 opacity-60" : "bg-slate-50/50 border-slate-50 opacity-70") 
                        : (isDarkMode ? "bg-slate-800 border-slate-700 hover:border-orange-500/20" : "bg-white border-slate-150 hover:border-orange-200 shadow-sm")
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="shrink-0 mt-1">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-bold text-xs truncate">{n.title}</h4>
                          <span className="text-[9px] text-slate-400 font-mono shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-400 mt-1">{n.message}</p>
                      </div>
                    </div>
                    {!n.read && (
                      <div className="absolute right-3 bottom-3 w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
