import type { ReactNode } from 'react';
import { CfopNavigation } from './CfopNavigation';
import 'bulma/css/bulma.min.css';

interface CfopPageLayoutProps {
  children: ReactNode;
  pageTitle: string;
  subtitle?: string;
  introContent?: ReactNode;
  introImageSrc?: string;
  introImageAlt?: string;
}

export function CfopPageLayout({
  children,
  pageTitle,
  subtitle,
  introContent,
  introImageSrc,
  introImageAlt,
}: CfopPageLayoutProps) {
  return (
    <div className="app-shell">
      <CfopNavigation />
      <div className="container py-5" style={{ maxWidth: '1200px' }}>
        <section className="section pt-0 has-text-centered">
          <h1 className="title is-3">Cubing - Learning CFOP <span className="has-text-grey-light">|</span> {pageTitle}</h1>
          {subtitle && <p className="subtitle is-6 page-intro-subtitle">{subtitle}</p>}
          {introContent && (
            <div className="cfop-primer has-text-left mx-auto mt-4">
              {introImageSrc && (
                <div className="cfop-primer-media" aria-hidden="true">
                  <img
                    src={introImageSrc}
                    alt={introImageAlt ?? `${pageTitle} illustration`}
                    className="cfop-primer-image"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="cfop-primer-copy">{introContent}</div>
            </div>
          )}
        </section>
        <main>{children}</main>
      </div>
    </div>
  );
}
