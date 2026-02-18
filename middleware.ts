import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple basic auth for admin routes
// In production, replace with proper auth (NextAuth, Clerk, etc.)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme"

function isValidBasicAuth(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false
  }

  try {
    const base64Credentials = authHeader.split(" ")[1]
    const credentials = atob(base64Credentials)
    const [username, password] = credentials.split(":")
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const authHeader = request.headers.get("authorization")

    if (!isValidBasicAuth(authHeader)) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Area"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
