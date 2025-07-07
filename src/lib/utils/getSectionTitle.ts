const getSectionTitle = (filter: string) => {
  switch (filter) {
    case "pinned":
      return "Pinned Notes";
    case "favorites":
      return "Favorite Notes";
    case "trash":
      return "Trash";
    default:
      return "All Notes";
  }
};
export default getSectionTitle;
