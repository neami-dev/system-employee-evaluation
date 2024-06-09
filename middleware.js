import { NextResponse } from "next/server";
export function middleware(request) {
    const isLogged = request?.cookies?.get("isLogged");
    const isAdmin = request?.cookies?.get("isAdmin");
   
    if (isLogged?.value !== "true") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (
        request.nextUrl.pathname == "/admin/dashboard" ||
        request.nextUrl.pathname == "/admin/attendance" ||
        request.nextUrl.pathname == "/admin/manageEmployees"
    ) {
        if (isAdmin?.value !== "true") {
            return NextResponse.redirect(
                new URL("/employee/dashboard", request.url)
            );
        }
    }
    return NextResponse.next();
}
export const config = {
    matcher: [
        "/employee/dashboard",
        "/employee/attendance",
        "/employee/profile",
        "/employee/settings",
        "/chat",
        "/admin/dashboard",
        "/admin/attendance",
        "/admin/manageEmployees",
    ],
};
