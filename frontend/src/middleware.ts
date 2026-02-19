export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/notas/:path*', '/clientes/:path*', '/relatorios/:path*', '/configuracoes/:path*'],
};