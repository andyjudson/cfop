import type { ReactNode } from 'react';
import { CfopNavigation } from './CfopNavigation';
import 'bulma/css/bulma.min.css';

interface CfopPageLayoutProps {
  children: ReactNode;
  pageTitle: string;
  subtitle?: string;
  introContent?: ReactNode;
}

export function CfopPageLayout({
  children,
  pageTitle,
  subtitle,
  introContent,
}: CfopPageLayoutProps) {
  return (
    <div className="app-shell">
      <CfopNavigation />
      <div className="container py-5">
        <section className="section pt-0 has-text-centered">
          <h1 className="title is-3">Cubing - Learning CFOP <span className="has-text-grey-light">|</span> {pageTitle}</h1>
          {subtitle && <p className="subtitle is-6 page-intro-subtitle">{subtitle}</p>}
          {introContent && <div className="cfop-primer has-text-left mx-auto mt-4">{introContent}</div>}
        </section>
        <main>{children}</main>
      </div>
    </div>
  );
}
