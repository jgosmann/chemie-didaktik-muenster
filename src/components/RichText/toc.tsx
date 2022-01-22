import { Node } from "@contentful/rich-text-types"

const extractText = (node: Node) => {
  if (typeof node["value"] === "string") {
    return node["value"].trim()
  } else if (Array.isArray(node["content"])) {
    return node["content"]
      .map((child: Node) => extractText(child))
      .filter(part => part && part !== "")
      .join("")
  }
  return ""
}

const sanitizeForId = (value: string) =>
  value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[.?!,;]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")

export class IdHierarchy {
  private hierarchy: string[]

  constructor() {
    this.hierarchy = []
  }

  setLevel(level: number, headline: Node) {
    this.hierarchy = this.hierarchy.slice(0, level - 1)
    while (this.hierarchy.length < level - 1) {
      this.hierarchy.push("")
    }
    this.hierarchy.push(sanitizeForId(extractText(headline)))
  }

  currentId() {
    return `section-${this.hierarchy.filter(id => !!id).join("-")}`
  }

  currentDepth() {
    return this.hierarchy.filter(level => level !== "").length
  }
}

export interface TocNode extends Node {
  level: number
  title: string
  id: string
  children: TocNode[]
}

export const transformToToc = (content: { raw: string }): TocNode[] => {
  const idHierarchy = new IdHierarchy()
  const headings = JSON.parse(content.raw)
    .content.filter(block => block.nodeType.startsWith("heading-"))
    .map(heading => {
      const level = parseInt(heading.nodeType.substr("heading-".length))
      idHierarchy.setLevel(level, heading)
      return {
        ...heading,
        level,
        title: extractText(heading),
        id: idHierarchy.currentId(),
      }
    })
  const stack = []

  while (headings.length > 0) {
    const current = headings.pop()
    const children = []
    while (stack.length > 0 && stack[stack.length - 1].level > current.level) {
      children.push(stack.pop())
    }
    stack.push({ ...current, children })
  }

  return stack.reverse()
}
