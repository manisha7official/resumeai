from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import AsyncGroq
from dotenv import load_dotenv
import os, json

load_dotenv()
router = APIRouter()
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str

SYSTEM_PROMPT = """You are an expert ATS resume analyzer. Analyze the resume against the job description.
Respond ONLY with valid JSON, no extra text, using exactly this structure:
{
  "ats_score": <number 0-100>,
  "match_percentage": <number 0-100>,
  "matched_keywords": [<list of strings>],
  "missing_keywords": [<list of strings>],
  "strengths": [<list of 4 strings>],
  "weaknesses": [<list of 3 strings>],
  "rewritten_bullets": [{"original": "<string>", "improved": "<string>"}, {"original": "<string>", "improved": "<string>"}, {"original": "<string>", "improved": "<string>"}],
  "cover_letter": "<full cover letter text>",
  "overall_feedback": "<2-3 sentence summary>",
  "sections_score": {"experience": <number>, "skills": <number>, "education": <number>, "format": <number>}
}"""

@router.post("/analyze")
async def analyze(request: AnalyzeRequest):
    if len(request.resume_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Resume too short")
    if len(request.job_description.strip()) < 50:
        raise HTTPException(status_code=400, detail="Job description too short")
    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"RESUME:\n{request.resume_text[:4000]}\n\nJOB DESCRIPTION:\n{request.job_description[:3000]}\n\nReturn JSON only."}
            ],
            temperature=0.3,
            max_tokens=2500,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content
        result = json.loads(raw)
        return result
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid response. Please try again.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))