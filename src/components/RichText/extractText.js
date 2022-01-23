const extractText = node => {
  if (typeof node["value"] === "string") {
    return node["value"].trim()
  } else if (Array.isArray(node["content"])) {
    return node["content"]
      .map(child => extractText(child))
      .filter(part => part && part !== "")
      .join(" ")
  }
  return ""
}

module.exports = extractText
