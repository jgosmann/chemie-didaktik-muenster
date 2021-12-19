import { extractVideoId } from "./youtube-url-parser"

describe("youtube-url-parser", () =>
  [
    "https://www.youtube.com/watch?v=IdkCEioCp24",
    "http://www.youtube.com/watch?v=IdkCEioCp24",
    "www.youtube.com/watch?v=IdkCEioCp24",
    "youtube.com/watch?v=IdkCEioCp24",
    "https://youtube-nocookie.com/watch?v=IdkCEioCp24",
    "https://www.youtube-nocookie.com/watch?v=IdkCEioCp24",
    "https://www.youtube.com/watch?foo=bar&v=IdkCEioCp24&baz=xyz",
  ].forEach(url => {
    it(`extracts video ID from ${url}`, () => {
      expect(extractVideoId(url)).toEqual("IdkCEioCp24")
    })
  }))
