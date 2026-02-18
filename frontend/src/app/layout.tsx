import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MYNF',
  description: 'Plataforma SaaS NFS-e',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
