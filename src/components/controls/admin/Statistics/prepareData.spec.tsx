import { ClickCount } from "../../../../../analytics-client"
import { DomainNode } from "./DomainStatistics"
import prepareData from "./prepareData"

describe("prepareData", () => {
  it("converts the API endpoint data into the component's prop format", () => {
    const apiData: ClickCount[] = [
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
    ]

    const expectedData: DomainNode[] = [
      {
        domain: "Alle Domains",
        count: 8,
        nestedCount: 28,
        nested: [
          {
            name: "path",
            count: 10,
            nestedCount: 7,
            nested: [
              {
                name: "index",
                count: 3,
                nestedCount: 0,
                nested: [],
              },
              { name: "foo", count: 4, nestedCount: 0, nested: [] },
            ],
          },
          {
            name: "another-path",
            count: 5,
            nestedCount: 0,
            nested: [],
          },
          {
            name: "some",
            count: 0,
            nestedCount: 6,
            nested: [
              { name: "very_deep_path", count: 6, nestedCount: 0, nested: [] },
            ],
          },
        ],
      },
      {
        domain: "example.org",
        count: 1,
        nestedCount: 20,
        nested: [
          {
            name: "path",
            count: 2,
            nestedCount: 7,
            nested: [
              {
                name: "index",
                count: 3,
                nestedCount: 0,
                nested: [],
              },
              { name: "foo", count: 4, nestedCount: 0, nested: [] },
            ],
          },
          {
            name: "another-path",
            count: 5,
            nestedCount: 0,
            nested: [],
          },
          {
            name: "some",
            count: 0,
            nestedCount: 6,
            nested: [
              {
                name: "very_deep_path",
                count: 6,
                nestedCount: 0,
                nested: [],
              },
            ],
          },
        ],
      },
      {
        domain: "other-domain.org",
        count: 7,
        nestedCount: 8,
        nested: [
          {
            name: "path",
            count: 8,
            nestedCount: 0,
            nested: [],
          },
        ],
      },
    ]

    expect(prepareData(apiData)).toEqual(expectedData)
  })
})
