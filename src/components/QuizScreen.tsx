import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, AlertCircle, Zap, Star, Sparkles, Award } from "lucide-react";
import { Question } from "../data";
import { motion, AnimatePresence } from "motion/react";

interface QuizScreenProps {
  questions: Question[];
  onFinishQuiz: (score: number, total: number, subjectId: string) => void;
  onBack: () => void;
  isDarkMode: boolean;
  subjectId: string;
}

export function QuizScreen({
  questions,
  onFinishQuiz,
  onBack,
  isDarkMode,
  subjectId
}: QuizScreenProps) {
  // Filter questions for this subject
  const subjectQuestions = questions.filter(q => q.subjectId === subjectId);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const currentQuestion = subjectQuestions[currentIndex];

  useEffect(() => {
    if (isQuizEnded || !currentQuestion || isSubmitted) return;

    if (timeLeft === 0) {
      handleOptionSelect(0); // auto select first option or trigger submit
      handleSubmitAnswer();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isQuizEnded, isSubmitted]);

  useEffect(() => {
    setTimeLeft(30);
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [currentIndex]);

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < subjectQuestions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsQuizEnded(true);
      onFinishQuiz(correctCount + (selectedOption === currentQuestion?.correctAnswer ? 1 : 0), subjectQuestions.length, subjectId);
    }
  };

  if (subjectQuestions.length === 0) {
    return (
      <div className={`p-10 rounded-3xl border text-center space-y-6 max-w-md mx-auto ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150"
      }`}>
        <AlertCircle className="w-12 h-12 text-orange-500 mx-auto" />
        <div>
          <h3 className="font-extrabold text-sm text-slate-400">Empty Quiz Sector</h3>
          <p className="text-xs text-slate-500 mt-1">There are no practice questions for this subject yet. Upload a notes package or inject a custom question in the Admin Panel!</p>
        </div>
        <button onClick={onBack} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all">
          Go Back
        </button>
      </div>
    );
  }

  if (isQuizEnded) {
    const total = subjectQuestions.length;
    const finalScore = correctCount;
    const pct = Math.round((finalScore / total) * 100);
    const bonusXp = finalScore * 20;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-8 rounded-[40px] border text-center space-y-6 max-w-lg mx-auto ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-xl"
      }`}>
        <div className="w-20 h-20 bg-orange-100 dark:bg-slate-850 rounded-3xl flex items-center justify-center text-orange-500 font-black text-3xl mx-auto shadow-inner">
          🏆
        </div>
        <div>
          <h3 className="text-2xl font-black text-orange-500 tracking-tight">Challenge Cleared!</h3>
          <p className="text-xs text-slate-400 font-bold mt-1">Karnataka Board-Prep Diagnostic Metrics</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-3xl border ${isDarkMode ? "bg-slate-850 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
            <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider">Score Yield</span>
            <p className="text-xl font-black text-indigo-500 mt-1">{finalScore} / {total}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{pct}% Accuracy</p>
          </div>
          <div className={`p-4 rounded-3xl border ${isDarkMode ? "bg-slate-850 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
            <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider">Loot Secured</span>
            <p className="text-xl font-black text-yellow-500 mt-1">+{bonusXp} XP</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Syllabus Boost</p>
          </div>
        </div>

        <button 
          onClick={onBack} 
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-transform active:scale-95 shadow-lg shadow-orange-100 dark:shadow-none"
        >
          Check Mission Board
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-extrabold text-sm uppercase text-slate-400">Board Mock Exam</h3>
            <p className="text-xs font-black tracking-tight">{subjectId.toUpperCase()} Core Section</p>
          </div>
        </div>

        {/* Timer countdown view */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
          timeLeft <= 10 
            ? "border-red-500/20 bg-red-500/5 text-red-500 animate-pulse" 
            : (isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-150 bg-slate-50")
        }`}>
          <span className="text-[10px] font-black uppercase tracking-wider">Clock:</span>
          <span className="text-xs font-black font-mono">{timeLeft}s</span>
        </div>
      </header>

      {/* Progress track */}
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
          <span>Formula {currentIndex + 1} of {subjectQuestions.length}</span>
          <span>{correctCount} Right</span>
        </div>
        <div className={`h-2 w-full rounded-full overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
          <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${((currentIndex + 1) / subjectQuestions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question panel card */}
      <div className={`p-8 rounded-[40px] border space-y-6 ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-xl"
      }`}>
        <p className="font-black text-lg text-slate-800 dark:text-slate-100 leading-snug">{currentQuestion.question}</p>

        <div className="space-y-3">
          {currentQuestion.options.map((opt, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = i === currentQuestion.correctAnswer;
            
            // Background classes depending on status
            let btnClass = isDarkMode ? "bg-slate-850 hover:bg-slate-800" : "bg-slate-50 hover:bg-slate-100";
            let textClass = isDarkMode ? "text-slate-200" : "text-slate-800";
            let borderClass = "border-transparent";

            if (isSelected) {
              if (isSubmitted) {
                if (isCorrect) {
                  btnClass = "bg-emerald-500/10 text-emerald-500";
                  borderClass = "border-emerald-500/30";
                  textClass = "text-emerald-500";
                } else {
                  btnClass = "bg-red-500/10 text-red-500";
                  borderClass = "border-red-500/30";
                  textClass = "text-red-500";
                }
              } else {
                btnClass = "bg-orange-500 text-white shadow-lg";
                borderClass = "border-orange-500";
                textClass = "text-white";
              }
            } else if (isSubmitted && isCorrect) {
              btnClass = "bg-emerald-500/10 text-emerald-500";
              borderClass = "border-emerald-500/30";
              textClass = "text-emerald-500";
            }

            return (
              <button
                key={i}
                onClick={() => handleOptionSelect(i)}
                className={`w-full p-5 rounded-2xl flex items-center justify-between border-2 transition-all text-left font-bold text-xs ${btnClass} ${borderClass}`}
                disabled={isSubmitted}
              >
                <span>{opt}</span>
                {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className={`p-4 rounded-2xl text-[11px] leading-relaxed font-sans ${
            selectedOption === currentQuestion.correctAnswer 
              ? (isDarkMode ? "bg-emerald-500/5 text-emerald-400" : "bg-emerald-50 text-emerald-800")
              : (isDarkMode ? "bg-red-500/5 text-red-400" : "bg-red-50 text-red-800")
          }`}>
            <span className="font-black uppercase tracking-wider block mb-1">Educational Rationale:</span>
            {selectedOption === currentQuestion.correctAnswer 
              ? "Superb! Your solution aligns perfectly with the SSLC State board methodology. Under our learning diagnostics, this is indexed as full mastery." 
              : `That choice was incorrect. The accurate solution is: "${currentQuestion.options[currentQuestion.correctAnswer]}". Double check this topic in your Mission Map.`}
          </div>
        )}

        <div className="pt-2">
          {!isSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={`w-full py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-95 ${
                selectedOption === null
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              Verify Choice
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-95"
            >
              {currentIndex + 1 < subjectQuestions.length ? "Proceed Next Formula" : "Deliver Scoreboard & Rewards"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
