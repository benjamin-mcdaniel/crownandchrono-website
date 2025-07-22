import React from 'react';

export const metadata = {
  title: 'Watch Survey | Crown and Chrono',
  description: 'Participate in our luxury watch survey and share your preferences and opinions.',
  openGraph: {
    title: 'Watch Survey | Crown and Chrono',
    description: 'Participate in our luxury watch survey and share your preferences and opinions.',
    url: 'https://crownandchrono.com/survey',
    siteName: 'Crown and Chrono',
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630 }],
    locale: 'en-US',
    type: 'website',
  },
};

export default function SurveyPage() {
  return (
    <div className="container">
      <div className="maintenance-container">
        <div className="maintenance-content">
          <h2>Our Survey is Currently Down for Maintenance</h2>
          <div className="maintenance-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className="maintenance-message">
            We're currently updating our watch survey to bring you a better experience.
          </p>
          <p className="maintenance-submessage">
            Our team is working hard to make improvements to the survey. Please check back soon!
          </p>

          <div className="maintenance-actions">
            <a href="/" className="primary-button">Return to Homepage</a>
            <a href="/tags/review" className="secondary-button">Browse Watch Reviews</a>
          </div>
        </div>
      </div>
    </div>
  );
}
