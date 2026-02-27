export const siteConfig = {
  name: "Mustafa Mehmood",
  role: "Applied AI Scientist",
  title: "Applied AI Scientist",
  tagline:
    "Building intelligent systems for high-stakes domains",
  email: "mustafamehmood8998@gmail.com",
  phone: "+44 7769 504 569",
  linkedin: "https://www.linkedin.com/in/mustafa-meh",
  github: "https://github.com/mustafameh",
  location: "London, UK · Open to Relocate",
};

export interface Experience {
  title: string;
  type?: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  metric: string;
  metricLabel: string;
  highlights: string[];
}

export const experiences: Experience[] = [
  {
    title: "Applied Scientist & Applied Research Intern",
    company: "Thomson Reuters",
    location: "London, UK",
    period: "June 2025 – Present",
    current: true,
    metric: "0.88",
    metricLabel: "Pearson Correlation to Expert Grades",
    highlights: [
      "Initially hired as a 4-month intern; extended based on performance to take on full-time Applied Scientist responsibilities.",
      "Building tool-augmented multi-agent systems for cross-document risk assessment and extraction over high-stakes legal documents, supporting due diligence in M&A transactions.",
      "Designed an adversarial multi-agent evaluation pipeline that reverse-engineered expert grading criteria from audit sheets, achieving 90%+ failure detection with 0.88 Pearson correlation to expert grades to reducing the evaluation feedback loop from days to hours and enabling rapid iteration on solution development.",
      "Fine-tuned LLMs for specialized legal use cases including long-form contract drafting, customization, and summarization.",
    ],
  },
  {
    title: "LLM Data Integrity Specialist",
    company: "Outlier AI",
    location: "Nottingham, UK",
    period: "May 2024 – May 2025",
    metric: "20%",
    metricLabel: "Instruction Adherence Improvement",
    highlights: [
      "Improved tool usage and function-calling capabilities of advanced reasoning LLMs through RLHF training pipelines, enabling models to infer, chain, and autonomously execute multi-step complex actions from high-level user intent, powering AI solutions for tech firms including Google and Meta.",
      "Curated and cleaned training datasets in collaboration with domain experts, achieving a 20% improvement in instruction adherence.",
    ],
  },
  {
    title: "Data Scientist Intern",
    company: "Department of Neuroscience, University of Nottingham Malaysia",
    location: "Selangor, Malaysia",
    period: "June 2021 – Aug 2023",
    metric: "92%",
    metricLabel: "Autism Detection Accuracy",
    highlights: [
      "Engineered feature extraction pipelines to transform raw EEG and eye-tracking clinical data into structured features: coherence, Hjorth parameters, and spectral power bands for EEG; gaze patterns and fixation analysis for eye-tracking.",
      "Trained predictive models for neurological and mental health disorder diagnosis, achieving 80% accuracy for Parkinson's and 82% for Schizophrenia from EEG signals, and 92% for Autism from eye-tracking data.",
    ],
  },
];

export interface Project {
  slug: string;
  title: string;
  problem: string;
  approach: string;
  techStack: string[];
  metrics: { value: string; label: string }[];
  highlights: string[];
  links: { label: string; url: string }[];
}

export const projects: Project[] = [
  {
    slug: "sherlock-ai",
    title: "Sherlock-AI: Character Emulation with LLMs",
    problem:
      "Can a fine-tuned LLM authentically emulate a literary character's personality, reasoning style, and speech patterns?",
    approach:
      "Designed a resource-efficient, transferable character emulation pipeline: fine-tuned a quantized LLaMA model with LoRA for Sherlock Holmes emulation, automating dialogue extraction from public domain texts and deploying on RunPod.",
    techStack: [
      "Hugging Face Transformers",
      "LoRA",
      "Flask",
      "RunPod",
      "OpenRouter",
      "PostgreSQL",
    ],
    metrics: [
      { value: "72.4%", label: "User Preference over Baseline" },
      { value: "100%", label: "Usability Score" },
    ],
    highlights: [
      "Built a web chat application for Sherlock role-play with text-to-speech, character customisability, and PostgreSQL-based chat management.",
      "In A/B testing, 72.4% of users favoured the fine-tuned model over the baseline for authenticity.",
    ],
    links: [
      {
        label: "Repository",
        url: "https://github.com/mustafameh/Sherlock-LLM",
      },
    ],
  },
  {
    slug: "course-companion",
    title: "CourseCompanion: RAG-Powered Course Assistant",
    problem:
      "How can professors instantly create AI teaching assistants from their existing course materials?",
    approach:
      "Developed an educational platform enabling professors to create AI teaching assistants that auto-generate knowledge bases from course materials, with chat interfaces, FAQ system, and management dashboards.",
    techStack: [
      "LangChain",
      "OAuth",
      "Flask",
      "PostgreSQL",
      "Flair",
      "DigitalOcean",
      "OpenRouter",
    ],
    metrics: [{ value: "RAG", label: "Retrieval-Augmented Generation" }],
    highlights: [
      "Built a scalable backend with LangChain and Flair for context-aware responses, deployed on DigitalOcean with Google Drive integration.",
      "Professors can create AI assistants from their own materials with zero ML knowledge required.",
    ],
    links: [
      {
        label: "Repository",
        url: "https://github.com/mustafameh/Course-Content-Q-A",
      },
    ],
  },
  {
    slug: "deepgaze",
    title: "DeepGaze: Autism Diagnosis via Webcam Eye-Tracking",
    problem:
      "Can affordable webcam-based eye-tracking replace expensive clinical equipment for early autism screening?",
    approach:
      "Designed approaches for early autism detection using eye-tracking data visualized as images: implemented PCA with traditional classifiers and developed a custom CNN with transfer learning, achieving 92% accuracy.",
    techStack: [
      "Python",
      "Keras",
      "OpenCV",
      "WebGazer.js",
      "Flask",
      "sklearn",
      "JavaScript",
    ],
    metrics: [
      { value: "92%", label: "Detection Accuracy" },
      { value: "CNN", label: "Custom Architecture + Transfer Learning" },
    ],
    highlights: [
      "Developed a modular web app combining webcam eye-tracking data collection, preprocessing, and visualization with autism prediction.",
      "Supports model retraining, custom uploads, adjustable parameters — enhancing clinical accessibility.",
    ],
    links: [
      {
        label: "Demo Video",
        url: "https://youtu.be/c82RrlJVLvo",
      },
      {
        label: "Repository",
        url: "https://github.com/mustafameh/Automatic-Autism-Diagnosis-Eyetracking-Machinelearning-Research-Webapplication",
      },
    ],
  },
];

export const publication = {
  authors: "Mehmood, M., Amin, H. U.",
  year: 2024,
  title:
    "Pre-diagnosis for Autism Spectrum Disorder Using Eye-Tracking and Machine Learning Techniques",
  journal: "Advances in Brain Inspired Cognitive Systems",
  publisher: "Springer Nature Singapore",
  doi: "https://doi.org/10.1007/978-981-97-1417-9_23",
  summary:
    "This work presents a novel approach to early autism spectrum disorder screening using commodity webcam eye-tracking combined with machine learning. By converting gaze patterns into visual representations and applying both classical ML and deep learning classifiers, we achieved 92% detection accuracy — demonstrating that affordable, accessible tools can support clinical pre-diagnosis.",
};

export interface SkillNode {
  name: string;
  domain: string;
  size: number;
  projects?: string[];
}

export const skillDomains = [
  { id: "ml", label: "ML / Deep Learning", color: "#3b82f6" },
  { id: "nlp", label: "NLP / LLMs", color: "#8b5cf6" },
  { id: "infra", label: "Infrastructure", color: "#10b981" },
  { id: "web", label: "Web / Visualization", color: "#f59e0b" },
];

export const skills: SkillNode[] = [
  { name: "PyTorch", domain: "ml", size: 3, projects: ["sherlock-ai"] },
  { name: "TensorFlow", domain: "ml", size: 3, projects: ["deepgaze"] },
  { name: "scikit-learn", domain: "ml", size: 3, projects: ["deepgaze"] },
  { name: "Keras", domain: "ml", size: 2, projects: ["deepgaze"] },
  { name: "OpenCV", domain: "ml", size: 2, projects: ["deepgaze"] },

  {
    name: "Hugging Face",
    domain: "nlp",
    size: 3,
    projects: ["sherlock-ai"],
  },
  {
    name: "LangChain",
    domain: "nlp",
    size: 3,
    projects: ["course-companion"],
  },
  { name: "LoRA / PEFT", domain: "nlp", size: 3, projects: ["sherlock-ai"] },
  { name: "spaCy", domain: "nlp", size: 2 },
  { name: "NLTK", domain: "nlp", size: 2 },
  { name: "Pydantic AI", domain: "nlp", size: 2 },
  { name: "Claude SDK", domain: "nlp", size: 2 },

  { name: "Docker", domain: "infra", size: 3 },
  { name: "AWS", domain: "infra", size: 3 },
  {
    name: "PostgreSQL",
    domain: "infra",
    size: 3,
    projects: ["sherlock-ai", "course-companion"],
  },
  { name: "Git / CI/CD", domain: "infra", size: 3 },
  { name: "Spark / Databricks", domain: "infra", size: 2 },
  { name: "RunPod", domain: "infra", size: 2, projects: ["sherlock-ai"] },

  {
    name: "Flask",
    domain: "web",
    size: 3,
    projects: ["sherlock-ai", "course-companion", "deepgaze"],
  },
  { name: "JavaScript", domain: "web", size: 3, projects: ["deepgaze"] },
  { name: "D3.js", domain: "web", size: 2 },
  { name: "REST APIs", domain: "web", size: 3 },
  { name: "HTML/CSS", domain: "web", size: 2 },
  { name: "Python", domain: "web", size: 3 },
];

export const education = {
  university: "University of Nottingham",
  degrees: [
    {
      level: "MSc",
      field: "Artificial Intelligence",
      grade: "Distinction",
      period: "Sept 2023 – Dec 2024",
    },
    {
      level: "BSc (Hons)",
      field: "Computer Science",
      period: "Sept 2020 – Aug 2023",
    },
  ],
  location: "Nottingham, UK",
  modules: [
    "Machine Learning",
    "Computer Vision",
    "Natural Language Processing",
    "Big Data",
    "Information Visualisation",
  ],
};
