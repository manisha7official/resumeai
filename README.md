# 🧠 ResumeAI — AI Resume Screener

> AI-powered resume analyzer built with Next.js, FastAPI and LLaMA 3.3

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-7c3aed?style=for-the-badge)](https://resumeai-two-tan.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Code-black?style=for-the-badge&logo=github)](https://github.com/manisha7official/resumeai)

## 🌐 Live Demo
👉 https://resumeai-two-tan.vercel.app

## ✨ What it does
Paste your resume + any job description and get in under 10 seconds:
- ✅ ATS compatibility score (0-100)
- 🔍 Missing keywords detected
- ✍️ Weak bullets rewritten by AI in STAR format
- 📝 Tailored cover letter generated instantly

## 🛠 Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 14, Tailwind CSS, TypeScript |
| Backend | FastAPI, Python 3.12 |
| AI Engine | LLaMA 3.3-70B via Groq API |
| Deployment | Vercel (frontend) |

## 🚀 Run Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Create .env file with: GROQ_API_KEY=your_key
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
# Create .env.local with: NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

## 📸 Screenshot
![ResumeAI Dashboard](screenshot.png)