import { getBaseUrl } from "@/lib/utils/get-base-url";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getBaseUrl(),
      lastModified: new Date(),
    },
  ];
}
