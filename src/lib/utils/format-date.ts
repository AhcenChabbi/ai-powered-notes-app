import { formatDistanceToNow, isValid, format } from "date-fns";
export const formatRelativeTime = (date: string | Date) => {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) {
    throw new Error("Invalid date provided");
  }
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    includeSeconds: false,
  });
};

const DATE_FORMATS = {
  DATE_ONLY: "MMMM d, yyyy", // "December 25, 2023"
  DATE_TIME: "MMMM d, yyyy h:mm a", // "December 25, 2023 2:30 PM"
} as const;
type DateFormatType = keyof typeof DATE_FORMATS;

export const formatDate = (
  date: string | Date,
  formatType: DateFormatType = "DATE_ONLY"
): string => {
  const dateObj = new Date(date);

  if (!isValid(dateObj)) {
    throw new Error("Invalid date provided");
  }

  return format(dateObj, DATE_FORMATS[formatType]);
};
