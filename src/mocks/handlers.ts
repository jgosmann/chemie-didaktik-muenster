import { rest } from "msw"

export const baseUrl = "http://localhost:8001"
export const withBaseUrl = (path: string): string => `${baseUrl}${path}`

export const handlers = [
  rest.get(withBaseUrl("/tracked/domains"), (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ tracked_domains: ["example.org"] }))
  ),
  rest.put(withBaseUrl("/tracked/domains"), (req, res, ctx) =>
    res(ctx.status(204))
  ),
  rest.post(withBaseUrl("/profile/change-password"), (req, res, ctx) =>
    res(ctx.status(204))
  ),
  rest.get(withBaseUrl("/users"), (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        users: [
          { username: "john", realname: "John Wick" },
          { username: "jane", comment: "Some lengthy comment." },
        ],
      })
    )
  ),
  rest.put(withBaseUrl("/users/*"), (req, res, ctx) => res(ctx.status(204))),
  rest.delete(withBaseUrl("/users/*"), (req, res, ctx) => res(ctx.status(204))),
  rest.get(withBaseUrl("/statistics/clicks"), (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        clicks: [
          {
            domain_name: "other-domain.org",
            path: "/",
            count: 7,
          },
          {
            domain_name: "other-domain.org",
            path: "/path",
            count: 8,
          },
          {
            domain_name: "example.org",
            path: "/",
            count: 1,
          },
          {
            domain_name: "example.org",
            path: "/path",
            count: 2,
          },
          {
            domain_name: "example.org",
            path: "/path/index",
            count: 3,
          },
          {
            domain_name: "example.org",
            path: "/path/foo",
            count: 4,
          },
          {
            domain_name: "example.org",
            path: "/another-path",
            count: 5,
          },
          {
            domain_name: "example.org",
            path: "/some/very_deep_path",
            count: 6,
          },
        ],
      })
    )
  ),
]
