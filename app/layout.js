import "./globals.css";

export const metadata = {
  title: "SEMS GPA & Placement Analyzer",
  description: "Automated GPA/CGPA calculations, backlog tracking, what-if simulators, and class placement eligibility dashboards for Anna University students and PRs.",
  charset: "utf-8",
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
