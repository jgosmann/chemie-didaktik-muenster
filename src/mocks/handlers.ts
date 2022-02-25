import { rest } from "msw"

export const baseUrl = "http://localhost:8001"
export const withBaseUrl = (path: string): string => `${baseUrl}${path}`

export const handlers = [
  rest.put(withBaseUrl("/tracked/domains"), (req, res, ctx) =>
    res(ctx.status(204))
  ),
]
