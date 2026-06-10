import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://ethandaley.dev/sitemap.xml",
    host: "https://ethandaley.dev",
  };
}
