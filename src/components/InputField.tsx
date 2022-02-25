import React from "react"

const InputField = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function InputField(props: React.InputHTMLAttributes<HTMLInputElement>, ref) {
  return (
    <input
      type="text"
      {...props}
      // eslint-disable-next-line react/prop-types
      className={`border rounded-lg p-1 focus-within:outline outline-primary outline-2 bg-white disabled:text-gray-500 ${props.className}`}
      ref={ref}
    />
  )
})

export default InputField
