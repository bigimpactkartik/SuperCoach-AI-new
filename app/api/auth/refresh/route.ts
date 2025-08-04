import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refresh_token } = body

    if (!refresh_token) {
      return NextResponse.json({ message: "Refresh token is required" }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_URL

    if (!backendUrl) {
      // Mock refresh token response
      console.log("BACKEND_URL not configured, using mock token refresh")

      return NextResponse.json(
        {
          access_token: "mock_access_token_refreshed_" + Date.now(),
          refresh_token: refresh_token, // Return the same refresh token
          expires_in: 3600,
        },
        { status: 200 },
      )
    }

    try {
      // Make request to your backend to refresh the token
      const backendResponse = await fetch(`${backendUrl}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      const data = await backendResponse.json()

      if (!backendResponse.ok) {
        return NextResponse.json(
          {
            message: data.message || "Token refresh failed",
          },
          { status: backendResponse.status },
        )
      }

      return NextResponse.json(data, { status: 200 })
    } catch (fetchError) {
      console.error("Backend refresh error:", fetchError)

      if (fetchError.name === "AbortError") {
        return NextResponse.json(
          {
            message: "Token refresh timeout. Please try again.",
          },
          { status: 504 },
        )
      }

      return NextResponse.json(
        {
          message: "Token refresh service unavailable. Please try again later.",
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
