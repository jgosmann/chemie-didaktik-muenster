import React from "react"

export interface Location {
  pathname: string
  search: string
  hash: string
}

export default React.createContext<Location>({
  pathname: "",
  search: "",
  hash: "",
})
