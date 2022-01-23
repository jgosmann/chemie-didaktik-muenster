import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useCallback, useRef } from "react"

export interface SearchInputProps {
  onQueryChange?: (query: string) => void
  value?: string
  placeholder?: string
}

const SearchInput = ({
  onQueryChange,
  value,
  placeholder,
}: SearchInputProps) => {
  const queryInputRef = useRef(null)
  const onChange = useCallback(() => {
    if (queryInputRef.current && onQueryChange) {
      onQueryChange(queryInputRef.current.value)
    }
  }, [onQueryChange])

  return (
    <div className="flex border rounded-lg p-1 focus-within:outline outline-primary outline-2 bg-white">
      <input
        ref={queryInputRef}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        id="q"
        name="q"
        type="text"
        className="outline-none flex-grow"
      />
      <button
        type="submit"
        title="Suchen"
        className="hover:text-primary focus:text-primary transition-colors ml-1"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  )
}

export default SearchInput
