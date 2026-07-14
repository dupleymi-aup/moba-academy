import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Академия Дуплея — Платформа самостоятельного обучения",
  description:
    "Авторская образовательная платформа Дуплея Максима Игоревича. Курсы MBA, менеджмента, маркетинга, финансов и искусственного интеллекта для самостоятельного изучения.",
  keywords: [
    "обучение онлайн",
    "MBA",
    "менеджмент",
    "маркетинг",
    "финансы",
    "саморазвитие",
    "Дуплей Максим Игоревич",
    "бизнес-образование",
  ],
  authors: [{ name: "Дуплей Максим Игоревич" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Академия Дуплея — Платформа самостоятельного обучения",
    description:
      "Авторская образовательная платформа Дуплея Максима Игоревича: курсы, уроки, заметки и прогресс.",
    type: "website",
    locale: "ru_RU",
    siteName: "Академия Дуплея",
  },
  twitter: {
    card: "summary_large_image",
    title: "Академия Дуплея — Платформа самостоятельного обучения",
    description:
      "Авторская образовательная платформа: курсы MBA, менеджмента, маркетинга, финансов и ИИ.",
  },
  metadataBase: new URL("https://moba-academy.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Академия Дуплея",
              description:
                "Авторская образовательная платформа: курсы MBA, менеджмента, маркетинга, финансов и ИИ.",
              url: "https://moba-academy.vercel.app",
              author: {
                "@type": "Person",
                name: "Дуплей Максим Игоревич",
              },
              educationalLevel: "Взрослое образование",
              inLanguage: "ru",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Sonner />
        </ThemeProvider>
      </body>
    </html>
  );
}
