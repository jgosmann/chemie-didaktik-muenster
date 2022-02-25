import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCog } from "@fortawesome/free-solid-svg-icons"
import React, { useState } from "react"
import { useEffect } from "react"
import usePromise, {
  PendingPromise,
  PromiseState,
  RejectedPromise,
} from "../../../hooks/usePromise"
import Message, { Type } from "../../Message"

export interface DataLoaderViewProps<T> {
  state: PromiseState<T>
  render: (data: T) => React.ReactNode
}

export const DataLoaderView = <T,>({
  state,
  render,
}: DataLoaderViewProps<T>): JSX.Element => {
  if (state instanceof PendingPromise) {
    return (
      <div className="text-center text-4xl text-gray-600 p-4">
        <FontAwesomeIcon
          icon={faCog}
          fixedWidth
          className="animate-spin "
          style={{ animationDuration: "2s" }}
          title="Wird geladen"
        />
      </div>
    )
  }

  if (state instanceof RejectedPromise) {
    return <Message type={Type.Error}>Es ist ein Fehler aufgetreten.</Message>
  }

  return <>{render(state.value)}</>
}

export interface DataLoaderProps<T> {
  load: () => Promise<T>
  render: (data: T) => React.ReactNode
}

const DataLoader = <T,>({ load, render }: DataLoaderProps<T>): JSX.Element => {
  const [dataPromise, setDataPromise] = useState<Promise<T>>(
    new Promise(() => undefined)
  )
  const state = usePromise(dataPromise)
  useEffect(() => setDataPromise(load()), [load])

  return <DataLoaderView state={state} render={render} />
}

export default DataLoader
