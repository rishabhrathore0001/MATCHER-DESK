var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_mammoth = __toESM(require("mammoth"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_pdf_parse = require("pdf-parse");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "35mb" }));
app.use(import_express.default.urlencoded({ limit: "35mb", extended: true }));
function cleanApiKey(key) {
  if (!key) return "";
  let cleaned = key.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }
  if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
    cleaned = cleaned.slice(1, -1);
  }
  return cleaned.trim();
}
function getGroqApiKey() {
  let apiKey = cleanApiKey(process.env.GROQ_API_KEY);
  const isValidGroqKey = (k) => k && k.startsWith("gsk_") && k.length > 10;
  if (!isValidGroqKey(apiKey)) {
    try {
      const envExamplePath = import_path.default.join(process.cwd(), ".env.example");
      if (import_fs.default.existsSync(envExamplePath)) {
        const content = import_fs.default.readFileSync(envExamplePath, "utf8");
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const match = line.match(/^\s*GROQ_API_KEY\s*=\s*(.*)$/);
          if (match) {
            const parsedValue = cleanApiKey(match[1]);
            if (isValidGroqKey(parsedValue)) {
              apiKey = parsedValue;
              break;
            }
          }
        }
      }
    } catch (e) {
      console.error("[Diagnostics] Failed manual parse of .env.example:", e);
    }
  }
  if (!isValidGroqKey(apiKey)) {
    throw new Error(
      'GROQ_API_KEY is not defined, invalid, or is a placeholder. Please make sure either your settings Secrets panel has GROQ_API_KEY set correctly, or change GROQ_API_KEY in .env.example with a valid key starting with "gsk_".'
    );
  }
  return apiKey;
}
app.post("/api/analyze-resume", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
      res.status(400).json({ error: "Resume text is required for evaluation." });
      return;
    }
    const groqApiKey = getGroqApiKey();
    console.log(`[Diagnostic] Using GROQ_API_KEY of length: ${groqApiKey.length}, prefix: ${groqApiKey.substring(0, 7)}... and suffix: ...${groqApiKey.substring(groqApiKey.length - 5)}`);
    const systemPrompt = `You are an expert HR recruiter and student resume screening specialist.
Analyze the provided student resume content and optional job description/target role. Return a comprehensive, constructive structured review.

Your entire response MUST be a valid JSON object matching the following structure:
{
  "overall_score": 85, // integer 0-100 reflecting resume style, presentation, and content quality.
  "strengths": ["standout point 1", "standout point 2"], // array of strings
  "weaknesses": ["vague statement or missing elements"], // array of strings
  "skills_detected": ["skill 1", "skill 2"], // array of strings matching technical and soft skills identified
  "missing_skills": ["relevant skill 1"], // array of skills relevant to target role or domain that are missing
  "experience_analysis": "Constructive review of the professional or internship experiences section.",
  "project_feedback": "Detailed feedback on projects listed, suggestions for scoping/metrics.",
  "resume_tips": ["Actionable advice 1", "Actionable advice 2"], // array of strings for how the student should edit the resume next
  "ats_score": 75, // integer 0-100 based on standard parsing suitability
  "ats_issues": ["e.g. multi-column layouts, lack of action verbs"], // array of strings
  "final_verdict": "Consider" // strictly one of: "Reject", "Consider", or "Strong Hire"
}

Ensure the response satisfies:
1. Provide realistic, student-focused, encouraging yet highly constructive feedback.
2. If a job description or role is provided, assess the specific match. Identify tools, libraries, or concepts that are specified in the job description but missing or weak in the resume, and list them in missing_skills.
3. If no job description is provided, analyze the resume for general professional fit based on discovered skills (e.g. Software Engineering, UX Design, Marketing). Highlight essential skills typically missing from entry-level resumes in that domain in "missing_skills".
4. Determine realistic numbers from 0 to 100 for overall_score and ats_score. Explain major formatting, keyword, parsing issues (e.g., multi-column, icon graphics, tables, lack of action verbs) in "ats_issues".
5. Select a hiring recommendation for "final_verdict" strictly as one of: "Reject", "Consider", or "Strong Hire".`;
    const userPrompt = `Resume Text:
"""
${resumeText}
"""

Target Job Role / Description (Optional):
"""
${jobDescription || "None provided. Evaluate the resume generally for suitability in the candidate's apparent specialization."}
"""`;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API responded with status ${response.status}: ${errorText}`);
    }
    const responseData = await response.json();
    const content = responseData.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Received empty response content from Groq.");
    }
    const parsedResponse = JSON.parse(content);
    res.json(parsedResponse);
  } catch (error) {
    console.error("Error during resume evaluation:", error);
    res.status(500).json({
      error: error.message || "An internal error occurred during evaluation."
    });
  }
});
app.post("/api/extract-text", async (req, res) => {
  try {
    const { base64Data, mimeType, fileName } = req.body;
    if (!base64Data) {
      res.status(400).json({ error: "No file data received." });
      return;
    }
    const buffer = Buffer.from(base64Data, "base64");
    let extractedText = "";
    if (mimeType === "application/pdf" || fileName?.toLowerCase().endsWith(".pdf")) {
      const parser = new import_pdf_parse.PDFParse({ data: buffer });
      const parsed = await parser.getText();
      extractedText = parsed.text || "";
    } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || fileName?.toLowerCase().endsWith(".docx")) {
      const parsed = await import_mammoth.default.extractRawText({ buffer });
      extractedText = parsed.value || "";
    } else {
      res.status(400).json({ error: "Unsupported file type. We only read PDF, Word (.docx), TXT, and Markdown files." });
      return;
    }
    res.json({ text: extractedText });
  } catch (error) {
    console.error("Error extracting text:", error);
    res.status(500).json({
      error: `Could not parse file structure: ${error.message || error}`
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Application successfully listening on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
