import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Proteksi role-based
    if (path.startsWith("/pasien") && token?.role !== "pasien") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path.startsWith("/medis") && token?.role !== "tenaga_medis") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/pasien/:path*", "/medis/:path*", "/admin/:path*"],
};
