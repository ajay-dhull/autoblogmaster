import React from "react";
import { Helmet } from "react-helmet-async";

type SeoProps = {
  title?: string;
  description?: string;
  canonical?: string;     // give this to force exact canonical
  ogUrl?: string;         // optional: for social sharing
  noindex?: boolean;      // optional: for pages you don't want indexed
};

const stripQuery = (url: string) => url.split("?")[0].split("#")[0];

const Seo: React.FC<SeoProps> = ({ title, description, canonical, ogUrl, noindex }) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://newshubnow.in";
  const path   = typeof window !== "undefined" ? window.location.pathname : "/";

  // If canonical not given: default to origin + pathname (no query/hash)
  const canonicalUrl = canonical ? canonical : stripQuery(`${origin}${path}`);
  const pageUrl = ogUrl ? ogUrl : (typeof window !== "undefined" ? window.location.href : canonicalUrl);

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Social (Open Graph) */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
    </Helmet>
  );
};

export default Seo;
