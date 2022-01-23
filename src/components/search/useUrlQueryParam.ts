import { useContext, useEffect, useState } from "react"
import LocationContext from "../LocationContext"

const useUrlQueryParam = (): [string, (query: string) => void] => {
  const location = useContext(LocationContext)
  const [query, setQuery] = useState(
    new URLSearchParams(location.search).get("q") || ""
  )

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set("q", query)
    window.history.replaceState(null, "", url.toString())
  }, [query])

  useEffect(() => {
    setQuery(new URLSearchParams(location.search).get("q") || "")
  }, [location])

  return [query, setQuery]
}

export default useUrlQueryParam
