import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { SessionProvider } from "@/components/SessionProvider";
import { SessionTimeout } from "@/components/SessionTimeout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KGU AI Platform",
  description: "KGU AI Platform",
  icons: {
    icon: "/favicon.ico",
    apple: "/images/kgu-ai-logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <SessionTimeout />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
