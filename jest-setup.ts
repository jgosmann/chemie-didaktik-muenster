import "@testing-library/jest-dom"
import ResizeObseverr from "resize-observer-polyfill"
import "isomorphic-fetch"
import server from "./src/mocks/server"

global.ResizeObserver = ResizeObseverr

beforeAll(() => server.listen())

afterEach(() => {
  server.events.removeAllListeners()
  server.resetHandlers()
})

afterAll(() => server.close())
