
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LevelUp Earth - Gamify Your Self-Improvement',
  description: 'Level up your life with gamified missions! Track your strength, intelligence, and wealth. Complete daily missions, chat with an AI mentor, and climb the leaderboard!',
  keywords: ['self-improvement', 'gamification', 'fitness', 'knowledge', 'investment', 'AI mentor', 'leaderboard', 'missions', 'achievements', 'cyberpunk', 'React', 'Next.js', 'Tailwind CSS', 'Firebase'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'LevelUp Earth - Gamify Your Self-Improvement',
    description: 'Level up your life with gamified missions! Track your strength, intelligence, and wealth. Complete daily missions, chat with an AI mentor, and climb the leaderboard!',
    url: 'https://yourdomain.com',
    siteName: 'LevelUp Earth',
    images: ['/og-image.png'], // Replace with your actual OG image
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LevelUp Earth - Gamify Your Self-Improvement',
    description: 'Level up your life with gamified missions! Track your strength, intelligence, and wealth. Complete daily missions, chat with an AI mentor, and climb the leaderboard!',
    images: ['/twitter-image.png'], // Replace with your actual Twitter image
    creator: '@yourTwitterHandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': 'standard',
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google', // Add your Google verification code
    yandex: 'yandex', // Add your Yandex verification code
    yahoo: 'yahoo', // Add your Yahoo verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
