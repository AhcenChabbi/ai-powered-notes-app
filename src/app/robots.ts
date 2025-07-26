import { getBaseUrl } from "@/lib/utils/get-base-url";
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/verify-email", "/dashboard", "/signup", "/login"],
      allow: ["/"],
    },
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  };
}
