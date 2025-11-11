// import { NextResponse } from 'next/server';

// export function middleware(request) {
//   // Check if user is authenticated and is admin
//   const token = request.cookies.get('admin_token');
//   const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

//   if (isAdminPath && !token) {
//     return NextResponse.redirect(new URL('/signin', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: '/admin/:path*',
