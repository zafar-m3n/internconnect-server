const formatName = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

module.exports = { formatName };
