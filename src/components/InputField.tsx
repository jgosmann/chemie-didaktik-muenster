import React, { useCallback, useRef, useState } from "react"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  onChange?: (ev: React.FormEvent) => void
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(props: InputFieldProps, ref) {
    const internalRef = useRef(null)

    const [useInvalidHighlighting, setUseInvalidHighlighting] = useState(false)
    const onChange = useCallback(ev => {
      setUseInvalidHighlighting(!!internalRef.current.value)
      props.onChange && props.onChange(ev)
    }, [])

    return (
      <input
        type="text"
        placeholder=""
        {...props}
        onChange={onChange}
        // eslint-disable-next-line react/prop-types
        className={
          "w-full border rounded-lg p-1 focus-within:outline outline-primary " +
          `outline-2 bg-white disabled:text-gray-500 ${
            useInvalidHighlighting ? "invalid:bg-red-100" : ""
          } ${props.className}`
        }
        ref={node => {
          internalRef.current = node
          if (typeof ref === "function") {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
      />
    )
  }
)

export default InputField
