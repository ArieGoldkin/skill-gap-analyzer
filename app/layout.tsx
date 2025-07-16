import "./globals.css";

export const metadata = {
  title: "Skill Gap Analyzer",
  description: "AI-powered career development and skill optimization platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
