// Health check endpoint for monitoring
export async function GET() {
  try {
    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY not configured")
    }

    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not configured")
    }

    // Test Groq API connection
    const groqResponse = await fetch("https://api.groq.com/openai/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
    })

    if (!groqResponse.ok) {
      throw new Error("Groq API connection failed")
    }

    return Response.json({
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        groq: "connected",
        mongodb: "configured",
        auth: "configured",
      },
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return Response.json(
      {
        success: false,
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
