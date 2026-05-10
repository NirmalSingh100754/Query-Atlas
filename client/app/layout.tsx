import {
  ClerkProvider,
  Show,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Query Atlas",
  description: "A tool to help you chat with your data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ThemeProvider defaultTheme="system" storageKey="query-atlas-theme">
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
          <header className="shrink-0 flex items-center justify-between px-8 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
            <div>
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Query Atlas
              </p>
              <h1 className="text-lg font-semibold text-foreground">Document Search</h1>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Show when="signed-out">
                <SignInButton mode="modal" />
                <SignUpButton mode="modal" />
              </Show>

              <Show when="signed-in">
                <SignOutButton />
              </Show>
            </div>
          </header>

          <main className="flex-1 min-h-0">
            <Show when="signed-out">
              <div className="w-full max-w-4xl mx-auto rounded-2xl border border-border bg-card p-12 shadow-lg mt-16">
                <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                  <div>
                    <p className="mb-3 text-sm font-medium tracking-wide text-primary">
                      Welcome
                    </p>
                    <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                      Sign in to upload PDFs and search your documents.
                    </h2>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                      Query Atlas helps you search through your documents intelligently. Sign in or create an account to start uploading files and exploring your content.
                    </p>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                      <SignInButton mode="modal" />
                      <SignUpButton mode="modal" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/50 p-8 text-muted-foreground">
                    <p className="text-sm font-medium tracking-wide text-primary">
                      What you can do
                    </p>
                    <ul className="mt-6 space-y-4 text-sm leading-relaxed">
                      <li>• Upload PDF documents securely</li>
                      <li>• Search through your document content</li>
                      <li>• Get intelligent answers from your files</li>
                      <li>• Keep your workspace protected with secure authentication
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Show>

            <Show when="signed-in">{children}</Show>
          </main>
        </body>
      </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}
