import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here
    console.log("[v0] Middleware executed for:", req.nextUrl.pathname)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect API routes that require authentication
        if (req.nextUrl.pathname.startsWith("/api/")) {
          const publicRoutes = ["/api/auth", "/api/health"]
          const isPublicRoute = publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

          if (!isPublicRoute) {
            return !!token
          }
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: ["/api/:path*"],
}
