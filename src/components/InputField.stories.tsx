import React from "react"
import InputFieldComponent from "./InputField"

export default {
  title: "Controls/Input Field",
  component: InputFieldComponent,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

export const InputField = () => <InputFieldComponent />
export const Disabled = () => <InputFieldComponent value="some text" disabled />
