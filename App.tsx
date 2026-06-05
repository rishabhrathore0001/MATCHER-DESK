import { useState } from 'react';
import { Sparkles, AlertCircle, RefreshCw, FileText, Compass } from 'lucide-react';
import ResumeForm from './components/ResumeForm';
import EvaluationDashboard from './components/EvaluationDashboard';
import { ResumeEvaluation } from './types';

export default function App() {
  const [evaluation, setEvaluation] = useState<ResumeEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async (resumeText: string, jobDescription: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status code ${response.status}`);
      }

      const data = await response.json();
      setEvaluation(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while analyzing the resume. Please check your system secrets and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-[#2D2D2A] font-sans antialiased selection:bg-[#5A5A40]/10 selection:text-[#1A1A17]">
      {/* Outer elegant container wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col min-h-screen">
        
        {/* Brand Header */}
        <header className="border-b border-[#E5E4DE] pb-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4" id="main_header">
          <div>
            <span className="text-[#5A5A40] text-xs font-bold tracking-widest uppercase mb-2.5 block">
              Automated Applicant Talent System
            </span>
            <h1 className="text-3xl md:text-4xl font-light text-[#1A1A17] tracking-tight">
              Resume Evaluation <span className="text-[#A8A79A] mx-1 md:mx-2">/</span> <span className="text-2xl md:text-3xl italic font-serif text-[#5A5A40]">Matcher Desk</span>
            </h1>
          </div>
          
          <div className="flex gap-6 text-[#2D2D2A]">
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-[#A8A79A] font-extrabold">Active Suite</div>
              <div className="text-sm font-serif italic text-[#5A5A40] flex items-center gap-1 mt-0.5 justify-end">
                <Compass className="w-3.5 h-3.5" />
                Groq LLaMA 3.3
              </div>
            </div>
          </div>
        </header>

        {/* Informational Alerts */}
        {error && (
          <div className="mb-8 bg-red-50/60 border border-red-200/80 rounded-2xl p-5 flex items-start gap-4 text-sm text-red-800" id="global_error_box">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 flex flex-col gap-1">
              <span className="font-bold">Evaluation Obstacle Encountered</span>
              <p className="text-xs text-red-700/90 leading-relaxed">{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="text-xs font-bold underline text-red-800 hover:text-red-900 mt-1.5 self-start text-left"
              >
                Dismiss error and edit inputs
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Area: Form Input vs Active Feedback Portfolio */}
        <main className="flex-1" id="main_content_area">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-[#E5E4DE] rounded-[2rem]" id="app_loading_state">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-[#F1F0EA] border-t-[#5A5A40] animate-spin" />
                <Sparkles className="w-6 h-6 text-[#8B9D77] absolute inset-0 m-auto animate-pulse" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-[#A8A79A] font-bold">Deep Talent Analytics</span>
              <h2 className="text-xl font-serif italic text-[#1A1A17] mt-2 mb-3">Parsing credentials & mapping prerequisites...</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Groq is currently cross-referencing experience metrics, rating ATS layout warnings, and selecting actionable resume improvement feedback. This takes about 3 to 5 seconds.
              </p>
            </div>
          ) : !evaluation ? (
            <ResumeForm onSubmit={handleEvaluate} isLoading={isLoading} />
          ) : (
            <EvaluationDashboard 
              evaluation={evaluation} 
              onResumeEdit={() => setEvaluation(null)}
              isLoading={isLoading}
            />
          )}
        </main>

        {/* Footer Navigation */}
        <footer className="mt-12 pt-6 border-t border-[#E5E4DE] flex flex-col md:flex-row justify-between items-center text-[#A8A79A] text-[10px] tracking-widest uppercase gap-4" id="main_footer">
          <div className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start">
            <span>Portfolio Code: HR-STUDENT-FLASH</span>
            <span>Analyzed on: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex gap-2.5 items-center">
            <span className="text-[#5A5A40] font-bold">Natural Tones Theme Enabled</span>
            <div className="w-2.5 h-2.5 bg-[#8B9D77] rounded-full" />
          </div>
        </footer>

      </div>
    </div>
  );
}
