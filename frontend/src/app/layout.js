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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="site-header">
          <div className="container">
            <nav>
              <ul>
                <li className="logo-item"><a href="/" className="logo"><h1>Crown and Chrono</h1></a></li>
                <li><a href="/tags/review">Reviews</a></li>
                <li><a href="/tags/history">History</a></li>
                <li><a href="/tags/commentary">Commentary</a></li>
                <li><a href="/tags/classics">Classics</a></li>
                <li><a href="https://watchesofamerica.com/collections/clearance" target="_blank" rel="noopener noreferrer">Deals</a></li>
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
