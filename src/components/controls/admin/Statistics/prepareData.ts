import { ClickCount } from "../../../../../analytics-client"
import { DomainNode } from "./DomainStatistics"
import { PathNode } from "./Row"

const groupBy = <T>(
  arr: T[],
  selector: (item: T) => string
): Map<string, T[]> => {
  const result = new Map<string, T[]>()
  arr.forEach(item => {
    const key = selector(item)
    const group = result.get(key)
    if (!group) {
      result.set(key, [item])
    } else {
      group.push(item)
    }
  })
  return result
}

const removeLeadingSlash = (path: string): string => {
  if (path.startsWith("/")) {
    return path.slice(1)
  }
  return path
}

interface ProcessableData {
  splitPath: string[]
  count: number
}

const prepareNestedPaths = (data: Array<ProcessableData>): PathNode[] => {
  const byPath = groupBy(data, item => item.splitPath[0])
  return Array.from(byPath).map(([name, pathData]) => {
    const nested = prepareNestedPaths(
      pathData
        .filter(item => item.splitPath.length > 1)
        .map(item => ({ ...item, splitPath: item.splitPath.slice(1) }))
    )
    return {
      name,
      count: pathData
        .filter(item => item.splitPath.length <= 1)
        .map(item => item.count)
        .reduce((a, b) => a + b, 0),
      nestedCount: nested
        .map(node => node.count + node.nestedCount)
        .reduce((a, b) => a + b, 0),
      nested,
    }
  })
}

const prepareDomain = (
  domain: string,
  data: Array<ProcessableData>
): DomainNode => {
  const nested = prepareNestedPaths(data)
  return {
    domain,
    nested: nested.filter(node => node.name),
    count: nested
      .filter(node => !node.name)
      .map(node => node.count)
      .reduce((a, b) => a + b, 0),
    nestedCount: nested
      .filter(node => node.name)
      .map(node => node.count + node.nestedCount)
      .reduce((a, b) => a + b, 0),
  }
}

const prepareData = (data: ClickCount[]): DomainNode[] => {
  const withSplitPaths = data.map(item => ({
    ...item,
    splitPath: removeLeadingSlash(item.path).split("/"),
  }))
  const preparedData = []
  for (const [key, value] of groupBy(
    withSplitPaths,
    item => item.domain_name
  )) {
    preparedData.push(prepareDomain(key, value))
  }
  preparedData.sort((a, b) => a.domain.localeCompare(b.domain))

  const dataAcrossDomains: ProcessableData[] = Array.from(
    groupBy(withSplitPaths, item => item.path)
  ).map(([, values]) => ({
    splitPath: values[0].splitPath,
    count: values.map(value => value.count).reduce((a, b) => a + b, 0),
  }))
  const total = prepareDomain("Alle Domains", dataAcrossDomains)
  return [total, ...preparedData]
}

export default prepareData
