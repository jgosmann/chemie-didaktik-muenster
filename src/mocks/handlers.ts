import { rest } from "msw"

export const handlers = [
  rest.put("http://localhost:8001/tracked/domains", (req, res, ctx) =>
    res(ctx.status(204))
  ),
]
