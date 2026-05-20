import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Upload, 
  FileText, 
  CheckCircle, 
  Mic, 
  MicOff, 
  BookOpen, 
  Volume2, 
  Download, 
  Calendar, 
  Search, 
  CheckCircle2, 
  Compass, 
  Sparkle
} from "lucide-react";
import { ChatMessage, UploadedFile } from "../types";
import { Subject, Question } from "../data";
import { motion, AnimatePresence } from "motion/react";

interface TutorScreenProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
  isDarkMode: boolean;
  syllabus: Subject[];
  onInjectUploadedQuestions: (questions: Question[]) => void;
  onAddNotification: (title: string, msg: string, type: "upload" | "achievement") => void;
}

export function TutorScreen({
  messages,
  onSendMessage,
  onBack,
  isDarkMode,
  syllabus,
  onInjectUploadedQuestions,
  onAddNotification
}: TutorScreenProps) {
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "planner" | "uploader">("chat");
  const [activeSubject, setActiveSubject] = useState("science");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceInputState, setVoiceInputState] = useState<"idle" | "listening" | "processing">("idle");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [planSubject, setPlanSubject] = useState("math");
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  // Analyze files
  const processFileAnalysis = async (fileName: string, content: string) => {
    const fileId = Math.random().toString(36).substr(2, 9);
    
    const newFile: UploadedFile = {
      id: fileId,
      name: fileName,
      size: `${(content.length / 1024).toFixed(1)} KB`,
      subjectId: activeSubject,
      status: "analyzing",
      questionsExtracted: 0,
      uploadedAt: new Date().toLocaleTimeString()
    };

    setUploadedFiles(prev => [newFile, ...prev]);

    try {
      const response = await fetch("/api/tutor/analyze-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: fileName,
          fileContent: content,
          subjectId: activeSubject
        })
      });

      if (!response.ok) throw new Error("Analysis failed");
      const result = await response.json();

      setUploadedFiles(prev => prev.map(f => f.id === fileId ? {
        ...f,
        status: "completed",
        questionsExtracted: result.questions?.length || 0,
        summary: result.summary
      } : f));

      if (result.questions && result.questions.length > 0) {
        const mappedQuestions: Question[] = result.questions.map((q: any, idx: number) => ({
          id: `extracted-${fileId}-${idx}`,
          subjectId: activeSubject,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        }));

        onInjectUploadedQuestions(mappedQuestions);
        onAddNotification(
          "Study Guide Parsed!", 
          `Extracted ${mappedQuestions.length} practice formulas for your syllabus.`,
          "upload"
        );
      }
    } catch (err) {
      console.error(err);
      setUploadedFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: "failed" } : f));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string || "Sample Syllabus Note Text";
        processFileAnalysis(file.name, text);
      };
      reader.readAsText(file);
    }
  };

  const handleDemoDocTrigger = (docType: string) => {
    let mockTitle = "";
    let mockText = "";
    
    if (docType === "science") {
      mockTitle = "Acid-Base_Neutralization_Notes.txt";
      mockText = "Neutralization is a chemical reaction in which acid and a base react quantitatively with each other. In a reaction in water, neutralization results in there being no excess of hydrogen or hydroxide ions in the solution. Examples include HCl + NaOH -> NaCl + H2O. Key indicators like phenolphthalein turn pink in basic solutions and colorless in acidic solutions.";
    } else if (docType === "math") {
      mockTitle = "Quadratic_Theorem_Guide.txt";
      mockText = "The quadratic formula is x = (-b +- sqrt(b^2 - 4ac)) / (2a). Under the discriminant D = b^2 - 4ac, we assess roots classification. If D > 0, roots are real and distinct. If D = 0, roots are equal. If D < 0, roots are complex. Useful for standard Karnataka 10th grade Mathematics board preparations.";
    } else {
      mockTitle = "French_Revolution_Summary.txt";
      mockText = "The French Revolution began in 1789, leading to the collapse of the monarchy and deep social reforms. The storming of the Bastille on July 14, 1789 is celebrated as a major civil landmark. Ideas of Liberty, Equality, and Fraternity flourished across European continents.";
    }

    processFileAnalysis(mockTitle, mockText);
  };

  // Generate Personalized AI Study Plan
  const handleGenerateStudyPlan = async (subject: string) => {
    setIsGeneratingPlan(true);
    setGeneratedPlan(null);
    try {
      const response = await fetch("/api/tutor/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Create a comprehensive day-by-day study plan specifically designed for scoring 100% on the Grade 10 SSLC State Board exam in "${subject}". Structure the response clearly with bullet points, active revision exercises, and time guidelines.`,
          chatHistory: []
        })
      });

      if (!response.ok) throw new Error("Plan generation failed");
      const result = await response.json();
      if (result.response) {
        setGeneratedPlan(result.response);
        onAddNotification(
          "Personalized Study Scheme Ready!",
          `A specialized revision roadmap for ${subject} has been loaded!`,
          "upload"
        );
      }
    } catch (e) {
      console.error(e);
      setGeneratedPlan("We encountered an issue preparing your roadmap. Please check your network and try again.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Trigger simulated voice recognition
  const toggleVoiceMode = () => {
    if (!isVoiceMode) {
      setIsVoiceMode(true);
      setVoiceInputState("listening");
      
      setTimeout(() => {
        setVoiceInputState("processing");
        setTimeout(() => {
          const samplePrompts = [
            "Explain the difference between strong acids and weak bases with examples.",
            "Explain standard deviations in Grade 10 math syllabus.",
            "Can you write a short summary of chemical equations?"
          ];
          const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
          setInputText(randomPrompt);
          setIsVoiceMode(false);
          setVoiceInputState("idle");
        }, 1500);
      }, 3000);
    } else {
      setIsVoiceMode(false);
      setVoiceInputState("idle");
    }
  };

  // Browser download of generated roadmap/summary notes
  const handleDownloadPlan = (title: string, text: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s+/g, "_")}_Revision_Sheet.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[85vh]">
      {/* Col 1 & 2: Dynamic main panel containing Tabs */}
      <div className={`md:col-span-2 rounded-[36px] border flex flex-col h-[75vh] relative overflow-hidden ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150"
      }`}>
        {/* Tutor Screen Header */}
        <div className={`p-5 border-b flex items-center justify-between z-10 ${
          isDarkMode ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50/40"
        }`}>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className={`p-2 rounded-xl border ${
              isDarkMode ? "bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-750" : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
            }`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="font-black text-sm flex items-center gap-1.5">
                Akshara-Deepa AI <Sparkles className="w-4 h-4 text-orange-500 fill-current animate-pulse shrink-0" />
              </h3>
              <p className="text-[10px] text-slate-400 font-bold">10th Grade SSLC Adaptive Tutor</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleVoiceMode}
              className={`p-2 rounded-xl transition-all flex items-center gap-1.5 font-black text-[10px] uppercase tracking-wider ${
                voiceInputState === "listening"
                  ? "bg-red-500 text-white animate-pulse"
                  : (isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-150 text-slate-700")
              }`}
            >
              <Mic className="w-4 h-4" /> 
              {voiceInputState === "listening" ? "Listening..." : "Study Voice"}
            </button>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className={`flex px-6 py-2 border-b gap-4 text-xs font-black uppercase tracking-wider ${
          isDarkMode ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-slate-50/20"
        }`}>
          <button 
            onClick={() => setActiveTab("chat")}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === "chat" ? "border-orange-500 text-orange-500" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Chat Lounge
          </button>
          <button 
            onClick={() => setActiveTab("planner")}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-1 ${
              activeTab === "planner" ? "border-orange-500 text-orange-500" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> AI Planner
          </button>
          <button 
            onClick={() => setActiveTab("uploader")}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-1 ${
              activeTab === "uploader" ? "border-orange-500 text-orange-500" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Note Diagnostics
          </button>
        </div>

        {/* Dynamic Inner Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          
          {/* Visual Simulated Waveform when listening */}
          {voiceInputState === "listening" && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6 text-white space-y-4">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-ping absolute opacity-25" />
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center relative shadow-lg">
                <Mic className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <p className="font-extrabold text-sm uppercase tracking-widest text-red-400">Microphone Input Active</p>
                <p className="text-xs text-slate-400 mt-1">Speak clearly. We are capturing your SSLC preparatory doubt...</p>
              </div>

              {/* Fake animated audio waveforms */}
              <div className="flex items-center gap-1 pt-4 h-12">
                {[2, 5, 8, 3, 7, 4, 9, 3, 6, 2, 8, 4, 6, 9].map((val, idx) => (
                  <motion.div 
                    key={idx}
                    animate={{ height: ["10px", `${val * 4}px`, "10px"] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: idx * 0.05 }}
                    className="w-1.5 bg-orange-500 rounded-full"
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 1: Chat Lounge */}
          {activeTab === "chat" && (
            <div className="space-y-4 h-full flex flex-col justify-between">
              <div className="flex-1 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 max-w-sm mx-auto opacity-85 py-12">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 dark:bg-slate-850 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md">
                      🤖
                    </div>
                    <div>
                      <p className="font-extrabold text-sm mb-1 text-slate-800 dark:text-slate-100">Welcome SSLC Aspirant!</p>
                      <p className="text-xs text-slate-405 leading-relaxed">Ask Deepa AI regarding Chemical Equations, Pythagoras rules, Indian History, or state board test guides.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full pt-4">
                      {["Identify Acid indicators", "Derive standard mean formulas"].map(txt => (
                        <button 
                          key={txt}
                          onClick={() => onSendMessage(txt)}
                          className={`p-3 rounded-xl border text-[11px] font-bold text-left transition-colors ${
                            isDarkMode ? "bg-slate-850 hover:bg-slate-800 border-slate-800" : "bg-slate-50 hover:bg-slate-100 border-slate-150"
                          }`}
                        >
                          "{txt}"
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                      <div className={`p-4 rounded-[24px] max-w-[85%] text-xs leading-relaxed font-sans ${
                        m.role === "user"
                          ? "bg-slate-900 text-slate-100 rounded-br-none"
                          : (isDarkMode ? "bg-slate-800 text-white rounded-bl-none" : "bg-slate-100 text-slate-805 rounded-bl-none border border-slate-200/40")
                      }`}>
                        <div className="flex items-center gap-1.5 mb-1.5 text-[9px] font-black uppercase text-slate-400">
                          <span>{m.role === "user" ? "You" : "Deepa AI Tutor"}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{m.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AI Planner */}
          {activeTab === "planner" && (
            <div className="space-y-6 animate-fade-in">
              <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-950/20 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
                <h4 className="font-extrabold text-sm mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-orange-500" /> Personalized AI Study Plans
                </h4>
                <p className="text-xs text-slate-404 leading-relaxed">
                  Generate a targeted revision schedule mapped directly to Grade 10 SSLC State specifications. Select a sector to calibrate:
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[
                    { id: "science", label: "Science Formulas" },
                    { id: "math", label: "Mathematics Core" },
                    { id: "social", label: "History & Civics" }
                  ].map(sec => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setPlanSubject(sec.id);
                        handleGenerateStudyPlan(sec.label);
                      }}
                      disabled={isGeneratingPlan}
                      className={`p-3 rounded-xl border font-black text-[10px] uppercase text-center transition-all flex items-center justify-center gap-1 ${
                        planSubject === sec.id
                          ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                          : (isDarkMode ? "bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-300" : "bg-white hover:bg-slate-100 border-slate-200 text-slate-600")
                      }`}
                    >
                      {isGeneratingPlan && planSubject === sec.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        "📂"
                      )}
                      {sec.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loader Skeleton for Planner */}
              {isGeneratingPlan && (
                <div className="space-y-3 pt-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-1/3 animate-pulse" />
                  <div className="h-2.5 bg-slate-250 dark:bg-slate-800 rounded w-full animate-pulse" />
                  <div className="h-2.5 bg-slate-250 dark:bg-slate-800 rounded w-5/6 animate-pulse" />
                  <div className="h-2.5 bg-slate-250 dark:bg-slate-800 rounded w-full animate-pulse" />
                  <div className="h-2.5 bg-slate-250 dark:bg-slate-800 rounded w-2/3 animate-pulse" />
                </div>
              )}

              {/* Plans content output */}
              {generatedPlan && !isGeneratingPlan && (
                <div className={`p-6 rounded-3xl border space-y-4 animate-fade-in ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-orange-500 font-mono">Calibrated Roadmap</span>
                      <h5 className="font-extrabold text-sm uppercase">{planSubject.toUpperCase()} Study calendar</h5>
                    </div>
                    <button 
                      onClick={() => handleDownloadPlan(`${planSubject}_Study_Plan`, generatedPlan)}
                      className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg flex items-center gap-1 text-[11px] font-bold"
                      title="Export plan to txt file"
                    >
                      <Download className="w-4 h-4" /> Download Plan
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl text-xs leading-relaxed font-sans whitespace-pre-wrap ${
                    isDarkMode ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-700"
                  }`}>
                    {generatedPlan}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: note diagnostics \& uploader */}
          {activeTab === "uploader" && (
            <div className="space-y-6 animate-fade-in">
              <div
                onDragOver={handleDrag}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`p-8 rounded-[36px] border-2 border-dashed transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                  isDragActive
                    ? "border-orange-500 bg-orange-500/5 scale-95"
                    : (isDarkMode ? "border-slate-800 bg-slate-900/40 hover:bg-slate-900/80" : "border-slate-200 bg-slate-50 hover:bg-white")
                }`}
              >
                <Upload className="w-10 h-10 text-indigo-500 mb-3 animate-bounce" />
                <h4 className="font-black text-sm">Syllabus Text diagnostic</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                  Drop secondary notes text files here. Gemini AI parses the topic, drafts bullet summaries, and extracts exactly 3 mock board exam questions.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full max-w-xs">
                  <select
                    value={activeSubject}
                    onChange={e => setActiveSubject(e.target.value)}
                    className={`w-full text-xs font-bold p-2.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
                    }`}
                  >
                    {syllabus.map(s => (
                      <option key={s.id} value={s.id}>{s.name} Subject</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-4 justify-center flex-wrap">
                  <button 
                    onClick={() => handleDemoDocTrigger("science")}
                    className="text-[9px] font-black uppercase tracking-wider py-2 px-3 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-lg hover:opacity-80"
                  >
                    🧪 Mock Science txt
                  </button>
                  <button 
                    onClick={() => handleDemoDocTrigger("math")}
                    className="text-[9px] font-black uppercase tracking-wider py-2 px-3 bg-orange-50 dark:bg-slate-800 text-orange-600 dark:text-orange-400 rounded-lg hover:opacity-80"
                  >
                    📐 Mock Math txt
                  </button>
                </div>
              </div>

              {/* Registry of uploaded files */}
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Processed Documents</span>
                {uploadedFiles.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">No notes processed this session.</p>
                ) : (
                  <div className="space-y-4">
                    {uploadedFiles.map(file => (
                      <div 
                        key={file.id} 
                        className={`p-5 rounded-3xl border space-y-3 ${
                          isDarkMode ? "bg-slate-900 border-slate-850" : "bg-white border-slate-200 shadow-sm animate-fade-in"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            <div>
                              <p className="font-extrabold text-xs">{file.name}</p>
                              <p className="text-[9px] text-slate-400 font-mono">{file.size} • {file.uploadedAt}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {file.status === "analyzing" ? (
                              <span className="text-[10px] font-black text-indigo-500 animate-pulse flex items-center gap-1">
                                <RefreshCw className="w-3 h-3 animate-spin" /> Analyzing notes...
                              </span>
                            ) : file.status === "completed" ? (
                              <span className="text-[10px] font-black text-emerald-500 text-right">
                                ✔ Done (+{file.questionsExtracted} MCQs)
                              </span>
                            ) : (
                              <span className="text-[10px] font-black text-red-500">Analysis Error</span>
                            )}
                          </div>
                        </div>

                        {file.summary && (
                          <div className={`p-4 rounded-xl text-xs space-y-2 leading-relaxed ${
                            isDarkMode ? "bg-slate-950 text-slate-350" : "bg-slate-50 text-slate-700"
                          }`}>
                            <div className="flex justify-between items-center pb-1 border-b border-dashed border-slate-200 dark:border-slate-800">
                              <span className="font-black text-[9px] uppercase text-orange-500">Notebook Summary Outline:</span>
                              <button 
                                onClick={() => handleDownloadPlan(`${file.name}_Summary`, file.summary || "")}
                                className="text-[9px] font-bold text-indigo-500 flex items-center gap-0.5"
                                title="Export chapter file summary"
                              >
                                <Download className="w-3 h-3" /> Export Summary
                              </button>
                            </div>
                            <p>{file.summary}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Global Tab Input Bar (Active only when in "chat" tab) */}
        {activeTab === "chat" && (
          <div className={`p-5 border-t flex gap-2 z-10 ${
            isDarkMode ? "border-slate-800 bg-slate-950/25" : "border-slate-100 bg-white"
          }`}>
            <input 
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Ask an academic doubt or demand standard syllabus summaries..."
              className={`flex-1 px-4 py-3 rounded-xl text-xs font-bold border-2 border-transparent outline-none transition-all ${
                isDarkMode 
                  ? "bg-slate-800 text-white focus:border-orange-500" 
                  : "bg-slate-100 text-slate-800 focus:border-orange-400"
              }`}
            />
            <button 
              onClick={handleSend}
              className="px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-transform active:scale-95 flex items-center justify-center shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Col 3: Side Diagnostic dashboard widgets */}
      <div className="space-y-4">
        {/* Rapid Search Index Widget */}
        <div className={`p-5 rounded-[36px] border ${
          isDarkMode ? "bg-slate-900 border-slate-850" : "bg-white border-slate-150"
        }`}>
          <h5 className="font-black text-xs uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1">
            <Search className="w-3.5 h-3.5" /> Rapid Syllabi Search
          </h5>
          <p className="text-[10px] text-slate-400 mb-3 leading-normal">
            Look up any state board syllabus chapter instantly:
          </p>

          <div className="space-y-2">
            {[
              { title: "Metals & Non-metals", tag: "Science Core" },
              { title: "Arithmetic Progressions", tag: "Mathematics" },
              { title: "Advent of Europeans", tag: "History Sector" }
            ].map((it, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveTab("chat");
                  onSendMessage(`Tell me about the Grade 10 SSLC chapter titled: "${it.title}"`);
                }}
                className={`w-full p-2.5 rounded-xl border text-left transition-all hover:translate-x-1 flex justify-between items-center ${
                  isDarkMode ? "bg-slate-850 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
                }`}
              >
                <div>
                  <p className="font-bold text-[10px] leading-tight block">{it.title}</p>
                  <span className="text-[8px] font-black text-orange-500 tracking-wider hidden xs:inline">{it.tag}</span>
                </div>
                <span className="text-[10px] opacity-70">⚡ Ask AI</span>
              </button>
            ))}
          </div>
        </div>

        {/* Global Study Streak Calendar widget */}
        <div className={`p-5 rounded-[36px] border ${
          isDarkMode ? "bg-slate-900 border-slate-850" : "bg-white border-slate-150"
        }`}>
          <h5 className="font-black text-xs uppercase text-slate-400 tracking-wider mb-3">Streak Calendar Milestones</h5>
          
          <div className="grid grid-cols-7 gap-1 border-b border-dashed border-slate-200 dark:border-slate-800 pb-3 mb-3">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => {
              const matchesStreak = i <= 4;
              return (
                <div key={i} className="text-center space-y-1">
                  <span className="text-[8px] font-black text-slate-450 uppercase">{d}</span>
                  <div className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center text-[10px] font-black ${
                    matchesStreak
                      ? "bg-orange-500 text-white shadow-sm"
                      : (isDarkMode ? "bg-slate-800 text-slate-600" : "bg-slate-100 text-slate-350")
                  }`}>
                    {matchesStreak ? "🔥" : i + 10}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[18px]">🎖</span>
            <div>
              <p className="font-extrabold text-[11px] leading-tight text-slate-800 dark:text-slate-150">Perfect Attendance!</p>
              <p className="text-[9px] text-slate-400 font-medium">Maintained 5 consecutive days of diagnostic review</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
