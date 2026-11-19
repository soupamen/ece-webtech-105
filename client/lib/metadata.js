const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export function createPageMetadata({ title, description, path }) {
  return {
    title,
    description,
    ...(siteUrl && path ? { alternates: { canonical: path } } : {}),
  }
}

export const metadataBase = siteUrl ? new URL(siteUrl) : undefined
