"use client";
import { Grid3X3, List, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useQueryState } from "nuqs";
import { parseAsViewMode } from "@/lib/utils/parsers";
import getSectionTitle from "@/lib/utils/getSectionTitle";
import CreateNoteButton from "./create-note-button";
import RefreshButton from "./refresh-button";

type TNotesHeaderProps = {
  totalCount: number;
  filter: string;
};
export default function NotesHeader({ totalCount, filter }: TNotesHeaderProps) {
  const [viewMode, setViewMode] = useQueryState("viewMode", parseAsViewMode);
  return (
    <div className="border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {getSectionTitle(filter)} ({totalCount})
        </h1>
        <div className="flex items-center gap-2">
          <RefreshButton />
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-2 rounded-r-none border-r cursor-pointer"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-2 rounded-l-none cursor-pointer"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <CreateNoteButton size="sm" className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </CreateNoteButton>
        </div>
      </div>
    </div>
  );
}
