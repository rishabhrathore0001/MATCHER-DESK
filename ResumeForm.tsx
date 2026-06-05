import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, AlertCircle, Trash2, Briefcase, User, RefreshCw } from 'lucide-react';
import { SAMPLE_RESUMES, SAMPLE_JOBS } from '../samples';

interface ResumeFormProps {
  onSubmit: (resumeText: string, jobDescription: string) => void;
  isLoading: boolean;
}

export default function ResumeForm({ onSubmit, isLoading }: ResumeFormProps) {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    // Up to 20MB constraint check
    const maxSizeBytes = 20 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setFileError('Selected file exceeds the maximum permitted size limit of 20MB.');
      setUploadedFileName(null);
      return;
    }

    const nameLower = file.name.toLowerCase();
    const isPlain = nameLower.endsWith('.txt') || nameLower.endsWith('.md') || file.type === 'text/plain';
    const isPdf = nameLower.endsWith('.pdf') || file.type === 'application/pdf';
    const isDocx = nameLower.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isPlain && !isPdf && !isDocx) {
      setFileError('Unsupported document format. Please upload a PDF, Word (.docx), TXT, or Markdown study file.');
      setUploadedFileName(null);
      return;
    }

    setFileError(null);
    setUploadedFileName(file.name);

    if (isPlain) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          setResumeText(content);
        }
      };
      reader.onerror = () => {
        setFileError('Could not process the text file representation.');
      };
      reader.readAsText(file);
    } else {
      // PDF or Word - binary read & server extraction
      setIsExtracting(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const base64Data = result.substring(result.indexOf(',') + 1);
            
            const response = await fetch('/api/extract-text', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                base64Data,
                mimeType: file.type,
                fileName: file.name,
              }),
            });

            if (!response.ok) {
              const errPayload = await response.json().catch(() => ({}));
              throw new Error(errPayload.error || `Failed text parsing with status ${response.status}`);
            }

            const data = await response.json();
            if (data.text) {
              setResumeText(data.text);
            } else {
              throw new Error('No characters could be read. Ensure the document is unencrypted and has standard content layers.');
            }
          }
        } catch (err: any) {
          console.error(err);
          setFileError(err.message || 'Error parsing document. Please copy and paste contents directly.');
          setUploadedFileName(null);
        } finally {
          setIsExtracting(false);
        }
      };
      reader.onerror = () => {
        setFileError('Could not decode local file binary.');
        setIsExtracting(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    onSubmit(resumeText, jobDescription);
  };

  const clearResume = () => {
    setResumeText('');
    setUploadedFileName(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full flex flex-col gap-8" id="resume_form_container">
      {/* Intro and Quick Fill Header */}
      <div className="bg-[#F1F0EA] border border-[#E5E4DE] rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h2 className="text-lg font-semibold text-[#1A1A17] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#5A5A40] fill-[#D4E09B]/40" />
            Quick Start Demo profiles
          </h2>
          <p className="text-[#7A7970] text-xs mt-1 max-w-xl leading-relaxed">
            Select one of our realistic student profiles and target job postings below to pre-fill the criteria and test the screening engine immediately.
          </p>
        </div>

        {/* Quick Select Buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {SAMPLE_RESUMES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              id={`quick_fill_btn_${idx}`}
              onClick={() => {
                setResumeText(sample.text);
                setUploadedFileName(`Sample: ${sample.name}`);
                // Attempt matching a logical job description template
                if (idx === 0) setJobDescription(SAMPLE_JOBS[0].description); // Soft eng intern
                if (idx === 1) setJobDescription(SAMPLE_JOBS[1].description); // Data intern
                if (idx === 2) setJobDescription(SAMPLE_JOBS[2].description); // Mark intern
              }}
              className="px-3.5 py-2 text-xs font-semibold bg-white hover:bg-[#F9F8F4] text-[#2D2D2A] border border-[#E5E4DE] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition duration-150 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/10 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#5A5A40]" />
              {sample.category}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input panel: Resume Text and Upload */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white border border-[#E5E4DE] rounded-[2rem] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label htmlFor="resume_textarea" className="text-sm font-semibold text-[#1A1A17] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5A5A40]" />
                Resume Content <span className="text-rose-500 font-normal">*</span>
              </label>
              {resumeText && (
                <button
                  type="button"
                  onClick={clearResume}
                  id="btn_clear_resume"
                  className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors focus:outline-none"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>

            {/* Drag & Drop File Upload Field */}
            <div
              id="resume_dropzone_container"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-[#5A5A40] bg-[#F1F0EA]'
                  : isExtracting
                  ? 'border-[#8B9D77] bg-[#F9F8F4] animate-pulse'
                  : uploadedFileName
                  ? 'border-[#A8A79A] bg-[#F1F0EA]/40'
                  : 'border-[#E5E4DE] hover:border-[#A8A79A] bg-[#F9F8F4]/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt,.md,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                id="file_uploader"
              />
              {isExtracting ? (
                <div className="flex flex-col items-center justify-center gap-2" id="extraction_spinner_view">
                  <RefreshCw className="w-8 h-8 text-[#5A5A40] animate-spin" />
                  <span className="text-xs font-semibold text-[#5A5A40]">Processing document...</span>
                  <p className="text-[10px] text-[#A8A79A] uppercase tracking-wider font-semibold">Extracting structural text data from file</p>
                </div>
              ) : (
                <>
                  <UploadCloud className={`w-8 h-8 ${uploadedFileName ? 'text-[#8B9D77]' : 'text-[#A8A79A]'}`} />
                  {uploadedFileName ? (
                    <div className="text-[#2D2D2A] text-xs font-semibold">
                      Loaded:{' '}
                      <span className="font-bold text-[#5A5A40] max-w-xs truncate inline-block align-bottom">
                        {uploadedFileName}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-[#7A7970] leading-relaxed">
                      <span className="font-semibold text-[#5A5A40] hover:underline">Click to browse</span> or drag & drop standard resumes
                    </div>
                  )}
                  <div className="text-[10px] text-[#A8A79A]">PDF, Word (.docx), TXT, or Markdown documents up to 20MB are fully supported</div>
                </>
              )}
            </div>

            {/* Textarea for actual resume content */}
            <div className="flex flex-col gap-1">
              <textarea
                id="resume_textarea"
                rows={12}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the student's full resume text here..."
                className="w-full bg-[#F9F8F4] border border-[#E5E4DE] rounded-2xl px-4 py-3.5 text-[13px] text-[#2D2D2A] placeholder-[#A8A79A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#5A5A40]/5 focus:border-[#5A5A40] transition duration-150 font-mono"
                required
              />
              <div className="flex justify-between items-center text-[10px] text-[#A8A79A] px-1 mt-1 uppercase font-semibold tracking-wider">
                <span>Supports layout & spacing preservation</span>
                <span>{resumeText.length} characters</span>
              </div>
            </div>

            {fileError && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{fileError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Input panel: Job Description and Submit */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-[#E5E4DE] rounded-[2rem] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-5">
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="job_desc_textarea" className="text-sm font-semibold text-[#1A1A17] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#5A5A40]" />
                  Target Post / Role <span className="text-[#A8A79A] font-normal text-xs">(Optional)</span>
                </label>
              </div>
              <p className="text-xs text-[#7A7970] mt-1.5 leading-relaxed">
                Paste the target job requirements to generate role-suitability and core missing skill predictions.
              </p>
            </div>

            {/* Selector for samples */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] text-[#A8A79A] uppercase tracking-wider font-extrabold">Quick-select Target roles</span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_JOBS.map((job, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setJobDescription(job.description)}
                    className="px-2.5 py-1.5 text-[10px] font-bold bg-[#F1F0EA] border hover:bg-[#E5E4DE] border-[#E5E4DE] text-[#2D2D2A] rounded-xl transition cursor-pointer"
                  >
                    {job.role}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              id="job_desc_textarea"
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="E.g., Looking for a Frontend Developer with 1+ years experience in React, TypeScript, Tailwind, who writes clean tests and values great UI design."
              className="w-full bg-[#F9F8F4] border border-[#E5E4DE] rounded-2xl px-4 py-3.5 text-xs text-[#2D2D2A] placeholder-[#A8A79A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#5A5A40]/5 focus:border-[#5A5A40] transition duration-150"
            />

            {/* Sticky Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !resumeText.trim()}
              id="submit_evaluation_btn"
              className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                isLoading || !resumeText.trim()
                  ? 'bg-[#F1F0EA] border border-[#E5E4DE] text-[#A8A79A] cursor-not-allowed shadow-none'
                  : 'bg-[#5A5A40] hover:bg-[#1A1A17] text-white shadow-md active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running Screening Evaluation...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Expert HR Review
                </>
              )}
            </button>
          </div>

          {/* Quick Guide Tips Card */}
          <div className="bg-[#5A5A40] text-white rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
            <span className="text-[10px] text-[#D4E09B] tracking-widest font-extrabold uppercase">Recruiting Audit Standard</span>
            <h3 className="text-sm font-semibold text-[#F9F8F4] font-serif italic">What we screen for under the hood:</h3>
            <ul className="text-xs text-[#E5E4DE] flex flex-col gap-3">
              <li className="flex items-start gap-2.5">
                <span className="text-[#D4E09B] mt-0.5">✦</span>
                <span><strong>ATS Parser Suitability</strong>: Checks for tabular formats or excessive columns which usually fail standard ATS pipelines.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#D4E09B] mt-0.5">✦</span>
                <span><strong>Quantified Outcomes</strong>: Verifies if impact is backed by measurable indices (%), dollar values ($), or units.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#D4E09B] mt-0.5">✦</span>
                <span><strong>Role Alignment Gaps</strong>: Flags critical missed developer tools outlined in descriptions.</span>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
