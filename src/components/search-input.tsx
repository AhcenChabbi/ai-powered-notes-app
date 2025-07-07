"use client";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import useSearchQueryState from "@/hooks/useSearchQueryState";
export default function SearchInput() {
  const [searchQuery, setSearchQuery] = useSearchQueryState();
  const [search, setSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(search);
  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Search notes..."
        className="pl-10 bg-background border-border"
        name="search"
        required
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
