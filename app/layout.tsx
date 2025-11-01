import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TimeWarp LoL - Your Year in Review',
  description: 'AI-powered end-of-year review for League of Legends players',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
