import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Nếu đang ở trang chủ (/)
  if (pathname === "/") {
    // Nếu có token, chuyển hướng đến /tasks
    if (token) {
      return NextResponse.redirect(new URL("/tasks", request.url));
    }
    // Nếu không có token, chuyển hướng đến /login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Nếu đang ở các route cần bảo vệ
  const protectedRoutes = ["/tasks", "/notes", "/categories"];
  if (protectedRoutes.includes(pathname)) {
    // Nếu không có token, chuyển hướng đến /login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Nếu đang ở /login hoặc /register
  if (pathname === "/login" || pathname === "/register") {
    // Nếu đã có token, chuyển hướng đến /tasks
    if (token) {
      return NextResponse.redirect(new URL("/tasks", request.url));
    }
  }

  return NextResponse.next();
}

// Các routes cần kiểm tra xác thực
export const config = {
  matcher: ["/", "/tasks", "/notes", "/categories", "/login", "/register"],
};
