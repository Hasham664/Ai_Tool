// lib/groqClient.js
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export class GroqClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    if (!apiKey) {
      console.error('[v0] GROQ_API_KEY is missing!');
    }
  }

  async generateText(messages, options = {}) {
    const {
      model = 'llama-3.3-70b-versatile',
      temperature = 0.7,
      maxTokens = 1500,
      stream = false,
    } = options;

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content ?? '';
      return {
        success: true,
        content,
        usage: data.usage,
      };
    } catch (error) {
      console.error('[v0] Groq API Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async generateCoverLetter(
    jobDescription,
    resumeText,
    tone = 'Professional',
    variant = 'General'
  ) {
    const systemPrompt = `You are an expert career coach and cover letter writer. Generate a compelling cover letter based on the provided job description and resume. Keep it concise (3-4 paragraphs), use the requested tone, and format professionally.`;
    const userPrompt = `Job Description:\n${jobDescription}\n\nResume Content:\n${resumeText}\n\nPlease generate a ${tone} cover letter with ${variant} focus.`;

    return this.generateText([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
  }

  async analyzeResume(resumeText, jobDescription = '') {
    // Strict JSON-only response required.
    const systemPrompt = `You are an expert resume reviewer and career coach. You MUST respond with valid JSON ONLY and NOTHING ELSE. Do NOT include any narrative, explanation, or text outside the JSON object. The JSON must exactly follow this schema:

{
  "strengths": ["strength 1", "strength 2", "..."],
  "improvements": ["improvement 1", "improvement 2", "..."],
  "grammar": ["grammar issue 1", "..."],
  "missingSkills": ["skill 1", "skill 2", "..."],
  "atsRecommendations": {
    "add": ["item1", "item2", "..."],
    "remove": ["item1", "item2", "..."]
  },
  "score": 0,
  "summary": "short one-line summary"
}

Rules:
- Provide concise arrays (3-7 items where appropriate).
- Score must be a number between 0 and 100.
- summary must be a single short sentence (no paragraphs).
- Do NOT include any commentary outside the JSON.`;

    const userPrompt =
      `Resume to analyze:\n${resumeText}` +
      (jobDescription
        ? `\n\nJob Description for comparison:\n${jobDescription}`
        : '') +
      `\n\nReturn EXACTLY the JSON object described above.`;

    return this.generateText(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { temperature: 0.25, maxTokens: 1200 }
    );
  }

  async generateChatResponse(message, conversationHistory = []) {
    // AI Career Pro Assistant - Created by Full Stack Developer Hasham
    const systemPrompt = `You are the **AI Career Pro assistant**, created by **Full Stack Developer Hasham**. 
Your role is to guide users using the 4 tools of **AI Career Pro**:

1. **Cover Letter Generator** → Tailored cover letters from resume + job description  
2. **Resume Analyzer** → ATS score + improvement feedback  
3. **AI Mock Interviewer** → Practice interviews with real-time feedback  
4. **AI Tutor (English Speaking)** → Improve spoken English with corrections & practice  

**Response Rules:**
- For the **first reply**, always begin with: "Hi! I'm your **AI Career Pro assistant**..."  
- For **next replies**, do NOT repeat the greeting.  
- Start responses with the relevant **tool name** (e.g., "**Resume Analyzer:** …").  
- Keep answers **short (2–3 sentences)**, **professional**, and **highlight tool names & creator name (Hasham)** in bold.  
- If asked non-career things → politely redirect:  
  "I focus on career guidance through **AI Career Pro**. Try asking about **resume analysis**, **cover letter writing**, **mock interviews**, or **English practice**."  
`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10),
      { role: 'user', content: message },
    ];

    return this.generateText(messages, {
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      maxTokens: 400,
    });
  }
}

export const groqClient = new GroqClient(process.env.GROQ_API_KEY);
