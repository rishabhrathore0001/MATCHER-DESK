import { SampleResume, SampleJob } from './types';

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    name: "Alex Rivera (Software Intern - No Metrics)",
    category: "Software Engineering",
    text: `ALEX RIVERA
Email: alex.rivera@university.edu | Phone: (555) 123-4567 | LinkedIn: linkedin.com/in/alexrivera

OBJECTIVE
Passionate Computer Science student looking for a Software Engineer intern role to build high-quality applications.

EDUCATION
State University - B.S. in Computer Science
Expected Graduation: May 2027
GPA: 3.4

SKILLS
- Languages: Java, Python, C++, HTML, CSS, JavaScript
- Frameworks: React, Express
- Tools: Git, VS Code, Windows

EXPERIENCE
Campus Web Assistant | State University IT (Sept 2025 - Present)
- Developed and maintained various central university website pages.
- Worked with HTML, CSS, and general JavaScript.
- Collaborated with different university departments to collect content.
- Fixed some security and performance issues on the site.

PROJECTS
Personal Blog Site
- Built a blog from scratch where users can register.
- Used React for frontend development and Node.js with Express for backend.
- Stored blogs in a database.
- Integrated auth so users could log in and sign out.

Task Manager App
- Created a task list tool in Python to organize daily work.
- Built a interface with Tkinter for desktop.
- Allowed users to add, update and delete tasks.
`
  },
  {
    name: "Samantha Chen (Data Analyst - Highly Technical)",
    category: "Data Analysis & Science",
    text: `SAMANTHA CHEN
schen@techu.edu | +1-201-999-8888 | Seattle, WA | github.com/samchen

EDUCATION
Technology University — B.S. Statistics & Data Science
GPA: 3.82 | Dean's List (All semesters) | Expected 2026

TECHNICAL SKILLS
- Programming: SQL (PostgreSQL, SQLite), Python (Pandas, NumPy, Scikit-learn, Scipy), R
- Visualization: Tableau, PowerBI, Matplotlib, Seaborn
- Infrastructure: AWS (S3, EC2), Snowflake, Git, Docker

EXPERIENCE
Data Analytics Intern | Retail Analytics Corp (May 2025 - August 2025)
- Created custom SQL scripts to query and manipulate large customer dataset of 10M+ rows, reducing report generation latency by 25%.
- Built an interactive AWS-hosted Tableau dashboard tracking weekly promotional campaign KPIs, adopted by 8 regional managers.
- Developed a Python clustering script to segment users, improving direct email campaign CTR by 14%.

Undergraduate Research Assistant | TechU Statistics Dept (Sept 2024 - Present)
- Cleans and preprocesses heavy telemetry datasets from academic physical trials with Python pandas pipelines.
- Applied parametric survival analysis models on a dataset of 5,000 observations, co-authoring a paper submitted to DS Conference.
`
  },
  {
    name: "Jordan Taylor (Creative Marketing Specialist)",
    category: "Marketing & Growth",
    text: `JORDAN TAYLOR
jordan.taylor@colorado.edu | Denver, CO | (303) 111-2222 | behance.net/jordantaylordesign

SUMMARY
Dynamic and metrics-driven Marketing senior with proven experience in end-to-end digital marketing, copywriting, and visual brand identity. Looking for a full-time position as a Growth Marketing Analyst or Assistant Brand Manager.

EDUCATION
University of Colorado Boulder
B.S. in Business Administration, Marketing Concentration (Minor in Creative Writing)
Cumulative GPA: 3.65 | Expected Graduation: December 2026

MARKETING EXPERIENCE
Social Media Lead | Campus Student Association (August 2024 - Present)
- Audited 3 inactive social channels and relaunched content, leading to a 340% increase in student engagement over 6 months on Instagram.
- Produced 40+ short-form video assets using Canva and CapCut, generating 140,000+ total impressions.
- Managed a monthly advertising budget of $250, resulting in a 4.2x ROI on ticket sales for the annual spring festival.

Product Marketing Intern | Boulder Organic Juices (June 2025 - August 2025)
- Conducted intensive competitor analysis across 15 national juice brands, presenting insights to executive leadership.
- Redesigned weekly customer newsletters using Mailchimp, boosting average email open rate from 18% to 31.5% across 12,000 subscribers.
- Partnered with 8 local Colorado micro-influencers for cross-promotion, gaining 2.1k organic Instagram followers.
`
  }
];

export const SAMPLE_JOBS: SampleJob[] = [
  {
    role: "Junior Software Engineer",
    company: "TechNexus Systems",
    description: "Seeking a passionate computer science graduate or student. Experience built in modern web stacks (TypeScript/React/Node.js or Python/Django) is a plus. Strong understanding of database engineering (SQL/ NoSQL) and version control via Git. Must be ready to write automated tests (Jest, PyTest), participate in agile sprint ceremonies, and document technical design solutions. Key soft skills include collaborative problem solving and communication."
  },
  {
    role: "Product Analyst Intern",
    company: "Innovate Labs",
    description: "Looking for an analytical mindset to assist in product research and evaluation. Strong SQL skills are crucial to extract product usage statistics. Python scripting for automatic data pipeline preprocessing and visualizing data using Tableau or PowerBI is highly desired. Will collaborate closely with Product Managers and designers to review experimental A/B testing configurations and propose roadmaps."
  },
  {
    role: "Growth Marketing Coordinator",
    company: "SaaSify Inc.",
    description: "Our marketing squad is looking for an agile execution specialist. Responsibilities include running search/social ad experiments, tracking weekly retention and acquisition, designing visual templates, managing newsletters with advanced list segmentation (e.g., Mailchimp or HubSpot), and auditing partner lists. Experience with Google Analytics, Webflow, and basic SQL or data reporting tools is highly appreciated."
  }
];
