import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/utils/supabase/middleware"

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If accessing a protected route without a session, redirect to login
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If accessing auth pages with a session, redirect to dashboard
  if (session && (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}
