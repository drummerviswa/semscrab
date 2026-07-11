import "./globals.css";

export const metadata = {
  title: "SEMS GPA & Placement Analyzer | Anna University",
  description: "Automated GPA/CGPA calculations, active backlog tracking, what-if GPA simulators, and class placement eligibility dashboards for Anna University students and PRs.",
  keywords: ["Anna University", "SEMS", "GPA Calculator", "CGPA Calculator", "CEG", "MIT", "ACTECH", "Anna Univ SEMS Scraper", "Placement Analyzer"],
  authors: [{ name: "Viswanathan P" }],
  metadataBase: new URL("https://semscrab.vercel.app"),
  openGraph: {
    title: "SEMS GPA & Placement Analyzer | Anna University",
    description: "Automated GPA/CGPA calculations, active backlog tracking, what-if GPA simulators, and class placement eligibility dashboards for Anna University students and PRs.",
    url: "https://semscrab.vercel.app",
    siteName: "SEMS Analyzer",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEMS GPA & Placement Analyzer",
    description: "Automated GPA/CGPA calculations, active backlog tracking, what-if GPA simulators, and class placement eligibility dashboards for Anna University students.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
