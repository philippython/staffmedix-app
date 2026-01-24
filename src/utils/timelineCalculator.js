function daysAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);

  const diffInMs = now - past;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays === 0 ? "today" : `${diffInDays} days ago`;
}

export { daysAgo };
