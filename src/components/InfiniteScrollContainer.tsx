"use client";
import { useInView } from "react-intersection-observer";
export default function InfiniteScrollContainer({
  children,
  hasNextPage,
  isFetchingNextPage,
  onBottomReached,
}: {
  children: React.ReactNode;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onBottomReached: () => void;
}) {
  const { ref } = useInView({
    rootMargin: "50px",
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        onBottomReached();
      }
    },
  });
  return (
    <div>
      {children}
      <div ref={ref}></div>
    </div>
  );
}
