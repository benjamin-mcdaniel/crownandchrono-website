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

export const metadata = {
  title: "Crown and Chrono",
  description: "Watch Reviews, History, and Commentary",
  openGraph: {
    type: 'website',
    siteName: 'Crown and Chrono',
    title: 'Crown and Chrono',
    description: 'Watch Reviews, History, and Commentary',
    images: [
      {
        url: 'https://crownandchrono.com/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Crown and Chrono',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crown and Chrono',
    description: 'Watch Reviews, History, and Commentary',
    images: ['https://crownandchrono.com/images/og-default.jpg'],
    creator: '@crownandchrono',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://crownandchrono.com" />
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="site-header">
          <div className="container">
            <nav className="header-navigation">
              <ul className="nav-left">
                <li className="logo-item"><a href="/" className="logo"><h1>Crown and Chrono</h1></a></li>
                <li><a href="/tags/review">Reviews</a></li>
                <li><a href="/tags/history">History</a></li>
                <li><a href="/tags/commentary">Commentary</a></li>
                <li><a href="/tags/classics">Classics</a></li>
                <li><a href="https://watchesofamerica.com/collections/clearance" target="_blank" rel="noopener noreferrer">Deals</a></li>
              </ul>
              <ul className="nav-right">
                <li><a href="/survey" className="red-survey-link">Take our Watch Survey!</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer>
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Crown and Chrono. All rights reserved.</p>
          </div>
        </footer>
        
        {/* Script to redirect to admin when identity widget is ready */}
        <script dangerouslySetInnerHTML={{ __html: `
          if (window.netlifyIdentity) {
            window.netlifyIdentity.on("init", user => {
              if (!user) {
                window.netlifyIdentity.on("login", () => {
                  document.location.href = "/admin/";
                });
              }
            });
          }
        `}} />
      </body>
    </html>
  );
}
