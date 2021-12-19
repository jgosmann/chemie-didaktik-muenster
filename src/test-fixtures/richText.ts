export const richText = (text: string) => ({
  raw:
    '{"nodeType":"document","data":{},"content":[' +
    '{"nodeType":"paragraph","data":{},"content":[' +
    '{"nodeType":"text","value":"' +
    text +
    '","marks":[],"data":{}}]}]}',
  references: [],
})

export const loremIpsum = () =>
  richText(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod" +
      "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim" +
      "veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea" +
      "commodo consequat. Duis aute irure dolor in reprehenderit in voluptate" +
      "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat" +
      "cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id" +
      "est laborum."
  )
