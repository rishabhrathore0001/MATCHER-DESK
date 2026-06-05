import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingUp,
  Sliders,
  ListTodo,
  BookOpen,
  ArrowLeft,
  Activity,
  FileCheck2
} from 'lucide-react';
import { ResumeEvaluation } from '../types';

interface EvaluationDashboardProps {
  evaluation: ResumeEvaluation;
  onResumeEdit: () => void;
  isLoading: boolean;
}

export default function EvaluationDashboard({ evaluation, onResumeEdit, isLoading }: EvaluationDashboardProps) {
  const {
    overall_score,
    strengths = [],
    weaknesses = [],
    skills_detected = [],
    missing_skills = [],
    experience_analysis = '',
    project_feedback = '',
    resume_tips = [],
    ats_score,
    ats_issues = [],
    final_verdict
  } = evaluation;

  // Initialize interactive checklist state for resume tips
  const [checkedTips, setCheckedTips] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Reset checked tips when a new evaluation is generated
    setCheckedTips({});
  }, [evaluation]);

  const toggleTip = (index: number) => {
    setCheckedTips(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const totalTips = resume_tips.length;
  const completedTipsCount = Object.values(checkedTips).filter(Boolean).length;
  const percentCompleted = totalTips ? Math.round((completedTipsCount / totalTips) * 100) : 0;

  // Determine colors based on final verdict selection
  const getVerdictTheme = (verdict: string) => {
    const v = (verdict || '').toLowerCase();
    if (v.includes('strong') || v.includes('hire')) {
      return {
        bg: 'bg-[#F1F0EA]/60 border-[#E5E4DE] text-[#2D2D2A]',
        text: 'text-[#5A5A40]',
        badge: 'bg-[#5A5A40] text-[#D4E09B] font-bold',
        description: 'Excellent resume showing measurable impact, targeted skills matching, and cohesive narrative.',
        color: '#5A5A40'
      };
    } else if (v.includes('consider') || v.includes('medium') || v.includes('maybe')) {
      return {
        bg: 'bg-[#F1F0EA]/30 border-[#E5E4DE] text-[#2D2D2A]',
        text: 'text-[#8B7E66]',
        badge: 'bg-[#8B7E66] text-white font-bold',
        description: 'Candidate possesses core qualifications but needs resume polishing or small skill additions.',
        color: '#8B7E66'
      };
    } else {
      return {
        bg: 'bg-[#F9F8F4] border-[#E5E4DE] text-[#7A7970]',
        text: 'text-[#A8A79A]',
        badge: 'bg-[#A8A79A] text-white font-semibold',
        description: 'Resume would benefit from significant content restructuring and metric-driven alignment.',
        color: '#A8A79A'
      };
    }
  };

  const verdictTheme = getVerdictTheme(final_verdict);

  const formatScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#5A5A40]';
    if (score >= 60) return 'text-[#8B7E66]';
    return 'text-[#A8A79A]';
  };

  const formatScoreBg = (score: number) => {
    if (score >= 80) return 'stroke-[#5A5A40]';
    if (score >= 60) return 'stroke-[#8B7E66]';
    return 'stroke-[#A8A79A]';
  };

  // SVG parameters for circular meter gauge
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const calculateOffset = (score: number) => {
    const clampedScore = Math.max(0, Math.min(100, score));
    return circumference - (clampedScore / 100) * circumference;
  };

  return (
    <div className="w-full flex flex-col gap-8" id="evaluation_dashboard">
      
      {/* Back & Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[#E5E4DE] pb-1">
        <div>
          <button
            onClick={onResumeEdit}
            id="back_to_edit_btn"
            className="flex items-center gap-1.5 text-xs text-[#7A7970] hover:text-[#1A1A17] transition font-bold uppercase tracking-wider focus:outline-none mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3 text-[#5A5A40]" />
            Back to Configuration
          </button>
        </div>

        <button
          onClick={onResumeEdit}
          id="btn_re_evaluate"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#5A5A40] hover:bg-[#1A1A17] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition cursor-pointer"
        >
          <Activity className="w-3.5 h-3.5" />
          Evaluate Another CV
        </button>
      </div>

      {/* Elegant Verdict Banner from Spec */}
      <div className="bg-[#5A5A40] rounded-2xl p-5 mb-1 flex flex-col md:flex-row justify-between items-start md:items-center text-white shadow-sm gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#D4E09B] rounded-full animate-pulse"></div>
          <span className="text-xs tracking-widest uppercase font-bold text-[#E5E4DE]">Final Verdict Recommendation</span>
          <span className="text-xl font-serif italic ml-2 text-[#D4E09B]">{final_verdict}</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-[#E5E4DE] font-bold">
          Ref ID: SV-{Math.floor(overall_score * 123)}
        </div>
      </div>

      {/* Main Grid: Row 1 - Evaluation Badges & Key Scoring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Recruiter Recommendation Card & Gauge */}
        <div className="lg:col-span-5 bg-white border border-[#E5E4DE] rounded-[2rem] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between gap-6">
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-[#A8A79A] font-extrabold uppercase tracking-widest">Aura Screening Matrix</span>
            <span className={`px-2.5 py-1 rounded-full text-[10px] ${verdictTheme.badge}`}>
              {final_verdict}
            </span>
          </div>

          {/* Double Scoring Meters (Circular Gauge widgets grid) */}
          <div className="flex justify-around items-center gap-4 py-1">
            {/* Overall Quality Meter */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Track Circle */}
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    className="stroke-[#F1F0EA]"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Active Score Circle */}
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    className={`transition-all duration-1000 ease-out ${formatScoreBg(overall_score)}`}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={(2 * Math.PI * 46) - (overall_score / 100) * (2 * Math.PI * 46)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-2xl font-serif italic ${formatScoreColor(overall_score)}`}>
                    {overall_score}
                  </span>
                  <span className="text-[8px] text-[#A8A79A] font-extrabold uppercase tracking-wider">Quality</span>
                </div>
              </div>
            </div>

            {/* ATS Score Meter */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    className="stroke-[#F1F0EA]"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    className={`transition-all duration-1000 ease-out ${formatScoreBg(ats_score)}`}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={(2 * Math.PI * 46) - (ats_score / 100) * (2 * Math.PI * 46)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-2xl font-serif italic ${formatScoreColor(ats_score)}`}>
                    {ats_score}
                  </span>
                  <span className="text-[8px] text-[#A8A79A] font-extrabold uppercase tracking-wider">ATS Score</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${verdictTheme.bg} flex flex-col gap-1.5`}>
            <span className="text-xs font-bold flex items-center gap-1.5 text-[#2D2D2A]">
              <FileCheck2 className="w-4 h-4 text-[#5A5A40]" />
              Strategic Appraisal
            </span>
            <p className="text-xs leading-relaxed text-[#2D2D2A]">{verdictTheme.description}</p>
          </div>
        </div>

        {/* Strengths & Weaknesses Side-by-Side (Col span 7) */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Key Strengths */}
          <div className="bg-white border border-[#E5E4DE] rounded-[2rem] p-6 flex flex-col gap-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-2 border-b border-[#F1F0EA] pb-2">
              <CheckCircle2 className="w-4 h-4 text-[#8B9D77] shrink-0" />
              Core Strengths
            </h3>
            {strengths.length === 0 ? (
              <p className="text-xs text-[#7A7970] italic">No explicit strengths highlighted based on criteria.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex gap-2.5 items-start text-xs text-[#2D2D2A] leading-relaxed">
                    <span className="text-[#8B9D77] mt-0.5">✦</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Key Weaknesses (Growth Areas) */}
          <div className="bg-[#F1F0EA] border border-[#E5E4DE] rounded-[2rem] p-6 flex flex-col gap-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#A8A79A] flex items-center gap-2 border-b border-[#E5E4DE]/60 pb-2">
              <XCircle className="w-4 h-4 text-[#A8A79A] shrink-0" />
              Growth Areas
            </h3>
            {weaknesses.length === 0 ? (
              <p className="text-xs text-[#7A7970] italic">No clear weaknesses. Good foundational coverage.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {weaknesses.map((weakness, index) => (
                  <li key={index} className="flex gap-2.5 items-start text-xs text-[#2D2D2A] leading-relaxed opacity-90">
                    <span className="text-[#A8A79A]">○</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>

      {/* Row 2: Skills Alignment Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Identified Skills Card */}
        <div className="bg-white border border-[#E5E4DE] rounded-[2rem] p-6 shadow-xs flex flex-col gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#8B9D77]" />
              Detected Technical Stack ({skills_detected.length})
            </h3>
            <p className="text-[11px] text-[#7A7970] mt-1">
              Languages, utilities, frameworks, and methodologies successfully extracted during analysis.
            </p>
          </div>

          {skills_detected.length === 0 ? (
            <p className="text-xs text-[#A8A79A] italic py-4">No explicit skills discovered in the current text blocks.</p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-2">
              {skills_detected.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#F1F0EA] text-[#2D2D2A] font-semibold text-[11px] rounded-full border border-[#E5E4DE]/40 transition duration-150"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Missing Skills Card */}
        <div className="bg-white border border-[#E5E4DE] rounded-[2rem] p-6 shadow-xs flex flex-col gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#8B7E66]" />
              Missing Prerequisites
            </h3>
            <p className="text-[11px] text-[#7A7970] mt-1">
              Recommended tools or expectations absent from the resume based on target role expectations.
            </p>
          </div>

          {missing_skills.length === 0 ? (
            <div className="bg-[#F1F0EA]/60 p-4 border border-[#E5E4DE] rounded-xl flex items-center gap-2 text-xs text-[#5A5A40]">
              <CheckCircle2 className="w-4 h-4 text-[#8B9D77]" />
              Fabulous match! The resume covers the major requested skill keywords.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {missing_skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 border border-[#E5E4DE] text-[#8B7E66] font-semibold text-[11px] rounded-full transition"
                >
                  + {skill}
                </span>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Row 3: Recruiter's Section Deep-Dives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Experience Section critique */}
        <div className="bg-white border border-[#E5E4DE] rounded-[2rem] p-6 shadow-xs flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-2 border-b border-[#F1F0EA] pb-3 font-serif italic">
            <BookOpen className="w-4 h-4 text-[#5A5A40]" />
            Experience Narrative Critique
          </h3>
          <p className="text-xs text-[#2D2D2A] leading-relaxed whitespace-pre-wrap">
            {experience_analysis || 'No experience evaluation provided. Ensure professional items are correctly titled.'}
          </p>
        </div>

        {/* Project Section critique */}
        <div className="bg-white border border-[#E5E4DE] rounded-[2rem] p-6 shadow-xs flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-2 border-b border-[#F1F0EA] pb-3 font-serif italic">
            <Activity className="w-4 h-4 text-[#5A5A40]" />
            Academic & Projects Appraisal
          </h3>
          <p className="text-xs text-[#2D2D2A] leading-relaxed whitespace-pre-wrap">
            {project_feedback || 'No projects evaluation provided. Highlight technologies and deliverables.'}
          </p>
        </div>

      </div>

      {/* Row 4: ATS Issues and Interactive Action checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ATS Technical Problems */}
        <div className="bg-[#F1F0EA] border border-[#E5E4DE] rounded-[2rem] p-6 flex flex-col justify-start gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#8B7E66]" />
              ATS compatibility warnings
            </h3>
            <p className="text-[11px] text-[#7A7970] mt-1">
              These issues might block automated parsers from correctly scanning education, contact details, or dates.
            </p>
          </div>

          {ats_issues.length === 0 ? (
            <div className="bg-white border border-[#E5E4DE] text-[#2D2D2A] text-xs rounded-xl p-4 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#8B9D77] shrink-0" />
              <span>Great! No format layout blockers detected by our screening rules engine.</span>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {ats_issues.map((issue, index) => (
                <li key={index} className="bg-white border border-[#E5E4DE] rounded-xl p-3.5 flex gap-2.5 items-start text-xs text-[#2D2D2A] leading-relaxed">
                  <span className="text-[#8B7E66] font-bold mt-1.5">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Beautiful Real-Time Interactive checklist */}
        <div className="bg-white border border-[#E5E4DE] rounded-[2rem] p-6 shadow-xs flex flex-col gap-4">
          <div>
            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-[#5A5A40]" />
                Student Edit Action Board
              </h3>
              {totalTips > 0 && (
                <span className="text-[10px] font-bold text-[#5A5A40] bg-[#F1F0EA] px-2 py-1 rounded-md">
                  {percentCompleted}% Addressed
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#7A7970] mt-1">
              Mark off these tailored suggestions as you refine your resume copy in real-time.
            </p>
          </div>

          {totalTips > 0 && (
            <div className="w-full bg-[#F1F0EA] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#5A5A40] h-full transition-all duration-300"
                style={{ width: `${percentCompleted}%` }}
              />
            </div>
          )}

          {resume_tips.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4">No recommendations found.</p>
          ) : (
            <div className="flex flex-col gap-2.5 pt-1" id="tips_checklist">
              {resume_tips.map((tip, index) => {
                const isChecked = !checkedTips[index];
                return (
                  <button
                    key={index}
                    onClick={() => toggleTip(index)}
                    className={`flex items-start text-left gap-3 p-3 rounded-xl border transition-all duration-150 focus:outline-none ${
                      !isChecked
                        ? 'bg-[#F1F0EA]/40 border-[#E5E4DE]/50 text-[#A8A79A] line-through'
                        : 'bg-white border-[#E5E4DE] hover:border-[#1A1A17] text-[#2D2D2A] hover:bg-[#F9F8F4]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        !isChecked
                          ? 'border-[#5A5A40] bg-[#5A5A40] text-white'
                          : 'border-[#A8A79A] bg-white '
                      }`}
                    >
                      {!isChecked && <CheckCircle2 className="w-3 h-3 stroke-[3px]" />}
                    </div>
                    <span className="text-xs leading-relaxed font-sans">{tip}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
