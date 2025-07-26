import { getBaseUrl } from "@/lib/utils/get-base-url";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  children: string;
}

export default function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      components={{
        a: ({ href, children }) => {
          const isInternalLink =
            href?.startsWith(getBaseUrl()) || href?.startsWith("/");
          if (isInternalLink) {
            return (
              <Link href={href || "#"} className="text-primary hover:underline">
                {children}
              </Link>
            );
          }
          return (
            <a href={href || "#"} className="text-primary hover:underline">
              {children}
            </a>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
