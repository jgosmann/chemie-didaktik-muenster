import React, { useCallback, useRef } from "react"

export interface InputProps {
  trackedDomains: string[]
  onChange: (domains: string[]) => void
}

const Input = ({
  trackedDomains,
  onChange,
  ...props
}: InputProps &
  Omit<
    React.HTMLProps<HTMLTextAreaElement>,
    keyof InputProps
  >): JSX.Element => {
  const ref = useRef(null)
  const onTextChanged = useCallback(() => {
    if (ref.current) {
      onChange(
        ref.current.value
          .replaceAll(",", " ")
          .split(/\s+/)
          .map(domain => domain.trim())
          .filter(domain => !!domain)
      )
    }
  }, [onChange])

  return (
    <textarea
      {...props}
      className="border rounded p-2 focus-within:outline outline-primary"
      spellCheck={false}
      rows={5}
      cols={32}
      placeholder="domain.org&#10;www.another-domain.de"
      ref={ref}
      onChange={onTextChanged}
      defaultValue={trackedDomains.join("\n")}
    />
  )
}

export default Input
