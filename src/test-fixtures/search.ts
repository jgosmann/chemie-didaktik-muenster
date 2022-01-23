import FlexSearch from "flexsearch"

const store = {
  0: {
    id: "id0",
    title: "Document 0",
    content: "Lorem ipsum",
    crumbs: [
      { title: "Startseite", slug: "" },
      { title: "Document 0", slug: "doc0" },
    ],
  },

  1: {
    id: "id1",
    title: "Document 1",
    content: "dolor sit amet",
    crumbs: [
      { title: "Startseite", slug: "" },
      { title: "Document 1", slug: "doc1" },
    ],
  },
}
const index = FlexSearch.create()
Object.entries(store).map(([id, doc]) => index.add(Number(id), doc.content))

export const searchData = {
  index,
  store,
}
