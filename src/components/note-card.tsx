import { TNoteWithTags } from "@/lib/types/note";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Heart, Pin } from "lucide-react";
import { formatDate } from "@/lib/utils/format-date";
import { Badge } from "./ui/badge";
import NoteCardActions from "./note-card-actions";
import { useNoteViewer } from "@/store/noteViewer.store";
import useViewModeQueryState from "@/hooks/useViewModeQueryState";
import { ViewMode } from "@/lib/utils/parsers";

const MAX_TAGS = {
  list: 4,
  grid: 3,
} as const;

const DEFAULT_SUMMARY = "No summary available for this note.";

interface TagsListProps {
  tags: TNoteWithTags["tags"];
  maxTags: number;
}
const TagsList = ({ tags, maxTags }: TagsListProps) => {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, maxTags).map((tag) => (
        <Badge
          key={tag.name}
          variant="secondary"
          className="text-xs px-2 py-0.5"
          style={{
            backgroundColor: `${tag.color}15`,
            color: tag.color,
            border: `1px solid ${tag.color}30`,
          }}
        >
          {tag.name}
        </Badge>
      ))}
      {tags.length > maxTags && (
        <Badge variant="secondary" className="text-xs px-2 py-0.5">
          +{tags.length - maxTags}
        </Badge>
      )}
    </div>
  );
};

interface StatusIndicatorsProps {
  isPinned: boolean;
  isFavorite: boolean;
}
const StatusIndicators = ({ isFavorite, isPinned }: StatusIndicatorsProps) => (
  <div className="flex items-center gap-1">
    {isPinned && <Pin className="h-3 w-3 text-orange-500" />}
    {isFavorite && <Heart className="h-3 w-3 text-red-500 fill-current" />}
  </div>
);

interface NoteSummaryProps {
  summary: string | null;
}
const NoteSummary = ({ summary }: NoteSummaryProps) => (
  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
    {summary?.length ? summary : DEFAULT_SUMMARY}
  </p>
);
interface GridViewHeaderProps {
  note: TNoteWithTags;
  viewMode: ViewMode;
}
const GridViewHeader = ({ note, viewMode }: GridViewHeaderProps) => {
  if (viewMode === "list") return null;
  return (
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <h3 className="font-medium line-clamp-2 text-base leading-tight">
          {note.title}
        </h3>
        <NoteCardActions note={note} viewMode={viewMode} />
      </div>

      <NoteSummary summary={note.summary} />
    </CardHeader>
  );
};
interface ListViewContentProps {
  note: TNoteWithTags;
  viewMode: ViewMode;
}
const ListViewContent = ({ note, viewMode }: ListViewContentProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-medium truncate">{note.title}</h3>
          <StatusIndicators
            isPinned={note.isPinned}
            isFavorite={note.isFavorite}
          />
        </div>
        <NoteSummary summary={note.summary} />
        <div className="flex items-center gap-4">
          <TagsList tags={note.tags} maxTags={MAX_TAGS.list} />
          <span className="text-xs text-muted-foreground">
            {formatDate(note.createdAt)}
          </span>
        </div>
      </div>
      <NoteCardActions note={note} viewMode={viewMode} />
    </div>
  );
};
interface GridViewContentProps {
  note: TNoteWithTags;
}
const GridViewContent = ({ note }: GridViewContentProps) => {
  return (
    <div className="space-y-3">
      <TagsList tags={note.tags} maxTags={MAX_TAGS.grid} />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDate(note.createdAt)}</span>
        <StatusIndicators
          isPinned={note.isPinned}
          isFavorite={note.isFavorite}
        />
      </div>
    </div>
  );
};
export default function NoteCard(note: TNoteWithTags) {
  const [viewMode] = useViewModeQueryState();
  const isListView = viewMode === "list";
  const openNoteViewerModal = useNoteViewer(
    (state) => state.openNoteViewerModal
  );

  return (
    <Card
      onClick={() => openNoteViewerModal(note)}
      className={`group cursor-pointer transition-all border-border ${
        isListView
          ? "hover:shadow-md  py-0.5"
          : "hover:shadow-lg hover:shadow-black/5 flex flex-col justify-between"
      }`}
    >
      <GridViewHeader note={note} viewMode={viewMode} />
      <CardContent className={isListView ? "p-4" : "pt-0"}>
        {isListView ? (
          <ListViewContent note={note} viewMode={viewMode} />
        ) : (
          <GridViewContent note={note} />
        )}
      </CardContent>
    </Card>
  );
}
