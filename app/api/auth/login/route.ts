import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Check if BACKEND_URL is configured
    const backendUrl = process.env.BACKEND_URL

    if (!backendUrl) {
      // For demo purposes, simulate a successful login with mock data
      console.log("BACKEND_URL not configured, using mock authentication")

      // Simple mock authentication - in production, remove this
      if (email === "demo@supercoach.ai" && password === "demo123") {
        return NextResponse.json(
          {
            access_token: "mock_access_token_" + Date.now(),
            refresh_token: "mock_refresh_token_" + Date.now(),
            coach: {
              id: 1,
              name: "Demo Coach",
              email: email,
              phone: "1234567890",
              auth_user_id: "demo_auth_uid",
            },
            expires_in: 3600,
          },
          { status: 200 },
        )
      } else {
        return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
      }
    }

    try {
      // Make request to your actual backend API
      const backendResponse = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      const data = await backendResponse.json()

      if (!backendResponse.ok) {
        return NextResponse.json(
          {
            message: data.message || "Authentication failed",
          },
          { status: backendResponse.status },
        )
      }

      // Return the successful response from your backend
      return NextResponse.json(data, { status: 200 })
    } catch (fetchError) {
      console.error("Backend fetch error:", fetchError)

      // If backend is unreachable, provide helpful error message
      if (fetchError.name === "AbortError") {
        return NextResponse.json(
          {
            message: "Authentication service timeout. Please try again.",
          },
          { status: 504 },
        )
      }

      return NextResponse.json(
        {
          message: "Authentication service unavailable. Please try again later.",
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      {
        message: "Internal server error. Please try again.",
      },
      { status: 500 },
    )
  }
}
