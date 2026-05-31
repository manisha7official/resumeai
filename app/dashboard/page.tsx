
export default function Dashboard() {
  const [resume, setResume] = useState('')
  const [job, setJob] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [tab, setTab] = useState('analysis')

  const analyze = async () => {
    if (!resume.trim() || !job.trim()) return alert('Please fill both fields!')
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: resume, job_description: job }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      setResult(data)
      setTab('analysis')
    } catch (e: any) {
      alert('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (s: number) => s >= 80 ? '#16a34a' : s >= 60 ? '#d97706' : '#dc2626'
  const scoreBg = (s: number) => s >= 80 ? '#f0fdf4' : s >= 60 ? '#fffbeb' : '#fef2f2'

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'sans-serif'}}>
      {/* Header */}
      <div style={{background:'white', borderBottom:'1px solid #e2e8f0', padding:'16px 32px', display:'flex', alignItems:'center', gap:'12px'}}>
        <div style={{background:'#7c3aed', borderRadius:'10px', padding:'8px', fontSize:'20px'}}>🧠</div>
        <span style={{fontSize:'20px', fontWeight:'700', color:'#1a1a2e'}}>ResumeAI</span>
        <span style={{marginLeft:'auto', fontSize:'13px', color:'#94a3b8'}}>Powered by GPT-4o</span>
      </div>

      <div style={{maxWidth:'1100px', margin:'0 auto', padding:'32px 16px'}}>
        {/* Input Cards */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'24px'}}>
          <div style={{background:'white', borderRadius:'16px', border:'1px solid #e2e8f0', padding:'24px'}}>
            <div style={{fontSize:'15px', fontWeight:'600', color:'#374151', marginBottom:'12px'}}>📄 Your Resume</div>
            <textarea
              value={resume}
              onChange={e => setResume(e.target.value)}
              placeholder="Paste your full resume text here...&#10;&#10;Include your experience, skills, education, projects etc."
              style={{width:'100%', height:'220px', border:'none', outline:'none', resize:'none', fontSize:'13px', color:'#374151', lineHeight:'1.6', boxSizing:'border-box'}}
            />
          </div>
          <div style={{background:'white', borderRadius:'16px', border:'1px solid #e2e8f0', padding:'24px'}}>
            <div style={{fontSize:'15px', fontWeight:'600', color:'#374151', marginBottom:'12px'}}>💼 Job Description</div>
            <textarea
              value={job}
              onChange={e => setJob(e.target.value)}
              placeholder="Paste the job description here...&#10;&#10;Include requirements, responsibilities, tech stack etc."
              style={{width:'100%', height:'220px', border:'none', outline:'none', resize:'none', fontSize:'13px', color:'#374151', lineHeight:'1.6', boxSizing:'border-box'}}
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div style={{textAlign:'center', marginBottom:'32px'}}>
          <button
            onClick={analyze}
            disabled={loading || !resume.trim() || !job.trim()}
            style={{background: loading ? '#a78bfa' : '#7c3aed', color:'white', border:'none', padding:'16px 48px', borderRadius:'12px', fontSize:'18px', fontWeight:'600', cursor: loading ? 'not-allowed' : 'pointer', boxShadow:'0 4px 24px rgba(124,58,237,0.3)'}}
          >
            {loading ? '⏳ Analyzing with AI...' : '✨ Analyze My Resume'}
          </button>
          {loading && <div style={{marginTop:'12px', fontSize:'13px', color:'#94a3b8'}}>This takes 10-15 seconds — GPT-4o is working...</div>}
        </div>

        {/* Results */}
        {result && (
          <div>
            {/* Score Cards */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'12px', marginBottom:'24px'}}>
              {[
                {label:'ATS Score', value: result.ats_score},
                {label:'Experience', value: result.sections_score?.experience},
                {label:'Skills', value: result.sections_score?.skills},
                {label:'Education', value: result.sections_score?.education},
                {label:'Format', value: result.sections_score?.format},
              ].map(({label, value}) => (
                <div key={label} style={{background: scoreBg(value), border:`1px solid ${scoreColor(value)}33`, borderRadius:'12px', padding:'16px', textAlign:'center'}}>
                  <div style={{fontSize:'28px', fontWeight:'800', color: scoreColor(value)}}>{value}%</div>
                  <div style={{fontSize:'12px', color:'#64748b', marginTop:'4px'}}>{label}</div>
                </div>
              ))}
            </div>

            {/* Overall Feedback */}
            <div style={{background:'#f0f4ff', border:'1px solid #c7d2fe', borderRadius:'12px', padding:'16px', marginBottom:'24px', fontSize:'14px', color:'#374151', lineHeight:'1.6'}}>
              <strong>📊 Overall Feedback: </strong>{result.overall_feedback}
            </div>

            {/* Tabs */}
            <div style={{background:'white', borderRadius:'16px', border:'1px solid #e2e8f0', overflow:'hidden'}}>
              <div style={{display:'flex', borderBottom:'1px solid #e2e8f0'}}>
                {[['analysis','🔍 Keywords'],['bullets','✍️ Rewritten Bullets'],['cover','📝 Cover Letter']].map(([id,label])=>(
                  <button key={id} onClick={()=>setTab(id)} style={{padding:'14px 24px', border:'none', background:'none', cursor:'pointer', fontSize:'14px', fontWeight: tab===id ? '600' : '400', color: tab===id ? '#7c3aed' : '#64748b', borderBottom: tab===id ? '2px solid #7c3aed' : '2px solid transparent'}}>
                    {label}
                  </button>
                ))}
              </div>

              <div style={{padding:'24px'}}>
                {/* Keywords Tab */}
                {tab === 'analysis' && (
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px'}}>
                    <div>
                      <div style={{fontSize:'14px', fontWeight:'600', color:'#16a34a', marginBottom:'12px'}}>✅ Matched Keywords ({result.matched_keywords?.length})</div>
                      <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                        {result.matched_keywords?.map((k:string) => (
                          <span key={k} style={{background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0', borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:'500'}}>✓ {k}</span>
                        ))}
                      </div>
                      <div style={{marginTop:'20px', fontSize:'14px', fontWeight:'600', color:'#374151', marginBottom:'8px'}}>💪 Strengths</div>
                      {result.strengths?.map((s:string,i:number) => (
                        <div key={i} style={{fontSize:'13px', color:'#475569', padding:'6px 0', borderBottom:'1px solid #f1f5f9'}}>• {s}</div>
                      ))}
                    </div>
                    <div>
                      <div style={{fontSize:'14px', fontWeight:'600', color:'#dc2626', marginBottom:'12px'}}>❌ Missing Keywords ({result.missing_keywords?.length})</div>
                      <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                        {result.missing_keywords?.map((k:string) => (
                          <span key={k} style={{background:'#fef2f2', color:'#dc2626', border:'1px solid #fecaca', borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:'500'}}>✗ {k}</span>
                        ))}
                      </div>
                      <div style={{marginTop:'20px', fontSize:'14px', fontWeight:'600', color:'#374151', marginBottom:'8px'}}>⚠️ Weaknesses</div>
                      {result.weaknesses?.map((w:string,i:number) => (
                        <div key={i} style={{fontSize:'13px', color:'#475569', padding:'6px 0', borderBottom:'1px solid #f1f5f9'}}>• {w}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bullets Tab */}
                {tab === 'bullets' && (
                  <div>
                    <p style={{fontSize:'13px', color:'#94a3b8', marginBottom:'16px'}}>AI rewrote your weakest bullets using STAR format with quantified impact 👇</p>
                    {result.rewritten_bullets?.map((b:any, i:number) => (
                      <div key={i} style={{marginBottom:'16px', borderRadius:'12px', overflow:'hidden', border:'1px solid #e2e8f0'}}>
                        <div style={{background:'#fef2f2', padding:'12px 16px'}}>
                          <div style={{fontSize:'11px', fontWeight:'700', color:'#dc2626', marginBottom:'4px'}}>BEFORE</div>
                          <div style={{fontSize:'13px', color:'#64748b'}}>{b.original}</div>
                        </div>
                        <div style={{background:'#f0fdf4', padding:'12px 16px'}}>
                          <div style={{fontSize:'11px', fontWeight:'700', color:'#16a34a', marginBottom:'4px'}}>AFTER (AI-Improved)</div>
                          <div style={{fontSize:'13px', color:'#166534', fontWeight:'500'}}>{b.improved}</div>
                          <button onClick={()=>{navigator.clipboard.writeText(b.improved)}} style={{marginTop:'8px', background:'none', border:'1px solid #16a34a', color:'#16a34a', borderRadius:'6px', padding:'4px 10px', fontSize:'11px', cursor:'pointer'}}>Copy</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cover Letter Tab */}
                {tab === 'cover' && (
                  <div>
                    <div style={{display:'flex', justifyContent:'flex-end', marginBottom:'12px'}}>
                      <button onClick={()=>navigator.clipboard.writeText(result.cover_letter)} style={{background:'#7c3aed', color:'white', border:'none', borderRadius:'8px', padding:'8px 16px', fontSize:'13px', cursor:'pointer'}}>📋 Copy Cover Letter</button>
                    </div>
                    <div style={{background:'#f8fafc', borderRadius:'12px', padding:'24px', fontSize:'14px', color:'#374151', lineHeight:'1.8', whiteSpace:'pre-line', fontFamily:'Georgia, serif'}}>
                      {result.cover_letter}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!result && !loading && (
          <div style={{textAlign:'center', padding:'48px', color:'#94a3b8'}}>
            <div style={{fontSize:'48px', marginBottom:'12px'}}>🧠</div>
            <div>Paste your resume and job description above, then click Analyze</div>
          </div>
        )}
      </div>
    </div>
  )
}