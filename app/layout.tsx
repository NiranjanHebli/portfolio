import type { Metadata } from 'next';
import './globals.css';
import { PERSONA } from '@/lib/persona';
import { AppShell } from '@/components/shell/AppShell';

export const metadata: Metadata = {
  title: `${PERSONA.shortName} | ${PERSONA.title} | ${PERSONA.clearance}`,
  description: PERSONA.bioShort,
  openGraph: {
    title: `${PERSONA.shortName} | ${PERSONA.title}`,
    description: PERSONA.bioShort,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PERSONA.shortName,
    jobTitle: PERSONA.title,
    description: PERSONA.bioShort,
    url: PERSONA.githubUrl,
    knowsAbout: PERSONA.stackHighlights,
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-terminal-bg font-sans text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
