import { Helmet } from "react-helmet-async";

const SITE_NAME = "Ryan Kroge | SBA Loan Specialist";
const SITE_URL = "https://www.ryankroge.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-social.jpg`;
const DEFAULT_IMAGE_WIDTH = "1024";
const DEFAULT_IMAGE_HEIGHT = "537";

interface SEOProps {
  title: string;
  description: string;
  /** Full absolute URL to the OG image. Defaults to the site social image. */
  image?: string;
  imageWidth?: string;
  imageHeight?: string;
  /** Canonical path e.g. "/about" — site URL is prepended automatically */
  path?: string;
  /** "website" (default) | "article" */
  type?: "website" | "article";
  /** Suppress indexing (admin pages, etc.) */
  noindex?: boolean;
}

export function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  imageWidth = DEFAULT_IMAGE_WIDTH,
  imageHeight = DEFAULT_IMAGE_HEIGHT,
  path = "",
  type = "website",
  noindex = false,
}: SEOProps) {
  const fullTitle = title.includes("Ryan Kroge") ? title : `${title} | Ryan Kroge`;
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={imageWidth} />
      <meta property="og:image:height" content={imageHeight} />
      <meta property="og:image:alt" content={fullTitle} />

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ryankroge" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
