import queryClient from "@/config/queryClient";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";
import { useIsFetching } from "@tanstack/react-query";

export default function RefreshButton() {
  const isFetching = useIsFetching();
  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={!!isFetching}
      className="gap-2 bg-transparent cursor-pointer hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
    >
      <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
      Refresh
    </Button>
  );
}
