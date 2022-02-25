import React from "react"
import { DataLoaderView, DataLoaderViewProps } from "./DataLoader"
import {
  FulfilledPromise,
  PendingPromise,
  RejectedPromise,
} from "../../../hooks/usePromise"

export default {
  title: "Controls/Admin/Data Loader",
  component: DataLoaderView,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template = (args: DataLoaderViewProps<string>) => (
  <DataLoaderView render={data => <>Data: {data}</>} {...args} />
)

export const Loading = Template.bind({})
Loading.args = {
  state: PendingPromise.instance,
}

export const Success = Template.bind({})
Success.args = {
  state: new FulfilledPromise("promise value"),
}

export const Error = Template.bind({})
Error.args = {
  state: new RejectedPromise("error"),
}
