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
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="min-h-screen bg-slate-950 text-slate-100">
          <header className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Query Atlas
              </p>
              <h1 className="text-lg font-semibold text-white">Document AI search</h1>
            </div>

            <div className="flex items-center gap-3">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:text-white">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400">
                    Sign up
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <SignOutButton>
                  <button className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:text-white">
                    Sign out
                  </button>
                </SignOutButton>
              </Show>
            </div>
          </header>

          <main className="flex min-h-[calc(100vh-76px)] flex-col items-center justify-center px-6 py-10">
            <Show when="signed-out">
              <div className="w-full max-w-4xl rounded-[32px] border border-slate-800 bg-slate-950/95 p-10 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
                <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                  <div>
                    <p className="mb-4 text-sm uppercase tracking-[0.35em] text-indigo-400/80">
                      Welcome back
                    </p>
                    <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                      Sign in to upload PDFs and search your documents.
                    </h2>
                    <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
                      Query Atlas is ready to become your document AI assistant. Sign in or create an account to start ingesting files, building semantic search, and exploring documents with AI.
                    </p>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                      <SignInButton mode="modal">
                        <button className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto">
                          Sign in
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="w-full rounded-full border border-slate-700 bg-transparent px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 sm:w-auto">
                          Create account
                        </button>
                      </SignUpButton>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-8 text-slate-300 shadow-lg shadow-slate-950/10">
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-300/80">
                      What you can do
                    </p>
                    <ul className="mt-6 space-y-4 text-sm leading-7">
                      <li>• Upload PDF documents securely.</li>
                      <li>• Store files for future search and AI enrichment.</li>
                      <li>• Prepare the app for vector search and RAG workflows.</li>
                      <li>• Use Clerk-based auth to protect your workspace.
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
    </ClerkProvider>
  );
}
