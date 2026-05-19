const classifyComplaint = (description) => {
  const text = description.toLowerCase();

  if (
    text.includes("water") ||
    text.includes("leakage") ||
    text.includes("pipe")
  ) {
    return "Water";
  }

  if (
    text.includes("road") ||
    text.includes("broken") ||
    text.includes("pothole")
  ) {
    return "Road";
  }

  if (
    text.includes("electric") ||
    text.includes("light") ||
    text.includes("power")
  ) {
    return "Electricity";
  }

  if (
    text.includes("garbage") ||
    text.includes("clean") ||
    text.includes("waste")
  ) {
    return "Cleanliness";
  }

  return "General";
};

module.exports = { classifyComplaint };
