export default (text) => {
  const match = text.match(/\((\d+)(?:-|[+])/);
  return match ? Number(match[1]) : null;
};
