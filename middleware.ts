import { withAuth } from "next-auth/middleware";
import { NextResponse, type NextRequest } from "next/server";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return !!token && !!token.role;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/chat-apps/:path*",
    "/api/users/:path*",
    "/api/user-types/:path*",
    "/api/admin-apps/:path*",
  ],
};
