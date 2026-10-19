export const siteConfig = {
  name: "Mustafa Mehmood",
  role: "Applied Scientist",
  title: "Applied Scientist",
  tagline:
    "Designing, evaluating and fine-tuning agentic systems for high-stakes domains",
  email: "mustafamehmood8998@gmail.com",
  phone: "+44 7769 504 569",
  linkedin: "https://www.linkedin.com/in/mustafa-meh",
  github: "https://github.com/mustafameh",
  location: "",
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
    title: "Applied Scientist",
    company: "Thomson Reuters",
    location: "London, UK",
    period: "June 2025 – Present",
    current: true,
    metric: "0.78",
    metricLabel: "Cohen's κ vs. Expert Grades",
    highlights: [
      "Developed core agentic workflows for M&A due-diligence review in CoCounsel, TR's AI legal assistant, across hundreds of documents per deal, grounding agents via tools in expert-curated legal sources; achieves 90%+ recall of lawyer-flagged material risks.",
      "Own evaluation methodology: defined grading criteria with lawyers and designed LLM-as-judge strategies calibrated to expert scores (0.78 Cohen's κ), detecting 87.6% of human-flagged errors; cut eval cycles from days to hours.",
      "Built an orchestrator agent harness and skill library encoding lawyers' review methodology, plus MCP tools for citation verification, cross-reference resolution and redline comparison.",
      "Compared context-engineering strategies for long documents (retrieval-then-reason, progressive summarization, sub-agent state passing), yielding up to 4× fewer orchestrator compactions without loss in recall.",
      "Fine-tuned Qwen-32B for clause customization with QLoRA (SFT, then DPO on lawyer preference rankings), matching GPT-4o in lawyer review at 5×+ lower per-token cost.",
    ],
  },
  {
    title: "LLM Training Data Specialist",
    type: "Contract",
    company: "Outlier AI",
    location: "Remote, UK",
    period: "May 2024 – May 2025",
    metric: "20%",
    metricLabel: "Instruction Adherence Gain",
    highlights: [
      "Wrote multi-step tool-use trajectories that teach models to chain actions from high-level user intent, plus ideal responses and preference rankings on expert computer science and ML tasks for frontier AI labs.",
      "Reviewed expert submissions and curated datasets, contributing to a 20% gain in model instruction adherence.",
    ],
  },
  {
    title: "Data Scientist Intern",
    type: "Part-Time",
    company: "University of Nottingham",
    location: "Malaysia",
    period: "June 2021 – Aug 2023",
    metric: "92%",
    metricLabel: "Autism Detection Accuracy",
    highlights: [
      "Built feature-extraction pipelines for clinical EEG and eye-tracking data (spectral power, coherence, gaze fixations).",
      "Trained diagnostic classifiers reaching 80% accuracy for Parkinson's and 82% for schizophrenia from EEG, and 92% for autism by encoding gaze scanpaths as images for a transfer-learning vision model.",
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
      "Designed a reusable character-emulation pipeline that auto-extracts dialogue and generates synthetic training data from public-domain texts, used to fine-tune Llama 3.1 8B with QLoRA as Sherlock Holmes.",
    techStack: [
      "Llama 3.1 8B",
      "QLoRA",
      "Unsloth",
      "Hugging Face trl",
      "OpenRouter",
      "llama.cpp (GGUF)",
      "Next.js",
    ],
    metrics: [
      { value: "72.4%", label: "User Preference over Base Model" },
      { value: "QLoRA", label: "Llama 3.1 8B Fine-Tune" },
    ],
    highlights: [
      "In A/B testing, 72.4% of users preferred the fine-tuned model over the base model for character authenticity.",
      "Added ReAct-style deductive reasoning, served via OpenRouter API or local GGUF to trade off cost and latency.",
      "Created an interactive story mode where players shape branching mysteries through choices and free-form actions, with streamed structured output for real-time scene generation and auto-summarized context.",
    ],
    links: [
      {
        label: "Live Demo",
        url: "https://agentic-sherlock.vercel.app/",
      },
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
      "Built a platform for professors to spin up AI teaching assistants that answer student queries over knowledge bases auto-generated from course materials, using FAISS-backed RAG with LangChain, Flask and PostgreSQL.",
    techStack: [
      "LangChain",
      "FAISS",
      "Flair",
      "Flask",
      "PostgreSQL",
      "OAuth",
      "DigitalOcean",
    ],
    metrics: [{ value: "RAG", label: "Retrieval-Augmented Generation" }],
    highlights: [
      "Professors create AI assistants from their own materials with zero ML knowledge required, with chat interfaces, an FAQ system and management dashboards.",
      "Deployed on DigitalOcean with Google Drive integration for course material ingestion.",
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
      "scikit-learn",
      "JavaScript",
    ],
    metrics: [
      { value: "92%", label: "Detection Accuracy" },
      { value: "CNN", label: "Custom Architecture + Transfer Learning" },
    ],
    highlights: [
      "Built a modular Flask web app for webcam-based eye-tracking data collection, visualization, real-time prediction, and model retraining, operationalizing the autism-detection method from the publication.",
      "Supports custom uploads and adjustable parameters, improving clinical accessibility.",
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
  { id: "agents", label: "LLMs & Agents", color: "#8b5cf6" },
  { id: "training", label: "Training & Evaluation", color: "#3b82f6" },
  { id: "ml", label: "ML & Data", color: "#f59e0b" },
  { id: "infra", label: "Infrastructure", color: "#10b981" },
];

export const skills: SkillNode[] = [
  { name: "LangGraph", domain: "agents", size: 3 },
  {
    name: "LangChain",
    domain: "agents",
    size: 3,
    projects: ["course-companion"],
  },
  { name: "Pydantic AI", domain: "agents", size: 3 },
  { name: "Claude Agent SDK", domain: "agents", size: 3 },
  { name: "MCP", domain: "agents", size: 3 },
  { name: "Tool Calling", domain: "agents", size: 3, projects: ["sherlock-ai"] },
  {
    name: "Structured Output",
    domain: "agents",
    size: 2,
    projects: ["sherlock-ai"],
  },
  {
    name: "RAG (BM25, FAISS, Pinecone)",
    domain: "agents",
    size: 3,
    projects: ["course-companion"],
  },
  { name: "Context Engineering", domain: "agents", size: 3 },
  { name: "Agent Harness Design", domain: "agents", size: 3 },
  { name: "Claude Code", domain: "agents", size: 2 },

  { name: "PyTorch", domain: "training", size: 3, projects: ["sherlock-ai"] },
  {
    name: "Hugging Face (Transformers, trl, PEFT)",
    domain: "training",
    size: 3,
    projects: ["sherlock-ai"],
  },
  { name: "Unsloth", domain: "training", size: 2, projects: ["sherlock-ai"] },
  { name: "QLoRA", domain: "training", size: 3, projects: ["sherlock-ai"] },
  { name: "SFT", domain: "training", size: 3 },
  { name: "DPO", domain: "training", size: 3 },
  {
    name: "Synthetic Data",
    domain: "training",
    size: 2,
    projects: ["sherlock-ai"],
  },
  { name: "LLM-as-Judge Evals", domain: "training", size: 3 },
  { name: "A/B Testing", domain: "training", size: 2, projects: ["sherlock-ai"] },
  { name: "Langfuse", domain: "training", size: 2 },
  { name: "Weights & Biases", domain: "training", size: 2 },

  { name: "scikit-learn", domain: "ml", size: 3, projects: ["deepgaze"] },
  { name: "TensorFlow / Keras", domain: "ml", size: 2, projects: ["deepgaze"] },
  { name: "spaCy", domain: "ml", size: 2 },
  {
    name: "Computer Vision (CNNs)",
    domain: "ml",
    size: 2,
    projects: ["deepgaze"],
  },
  { name: "Speech (ASR, Coqui TTS)", domain: "ml", size: 2 },
  { name: "Spark / Databricks", domain: "ml", size: 2 },

  { name: "AWS (SageMaker, Bedrock)", domain: "infra", size: 3 },
  { name: "vLLM", domain: "infra", size: 2 },
  {
    name: "llama.cpp / Ollama",
    domain: "infra",
    size: 2,
    projects: ["sherlock-ai"],
  },
  { name: "OpenRouter", domain: "infra", size: 2, projects: ["sherlock-ai"] },
  { name: "FastAPI", domain: "infra", size: 3 },
  {
    name: "Flask",
    domain: "infra",
    size: 2,
    projects: ["course-companion", "deepgaze"],
  },
  { name: "Next.js", domain: "infra", size: 2, projects: ["sherlock-ai"] },
  { name: "Docker", domain: "infra", size: 3 },
  { name: "Git / GitLab CI", domain: "infra", size: 3 },
  {
    name: "PostgreSQL",
    domain: "infra",
    size: 2,
    projects: ["course-companion"],
  },
  { name: "Python", domain: "infra", size: 3 },
  { name: "TypeScript", domain: "infra", size: 2 },
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
