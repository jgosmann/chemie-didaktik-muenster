import React, { useCallback } from "react"
import { useContext } from "react"
import { useState } from "react"
import AnalyticsClientContext from "../AnalyticsClient"
import Input from "./Input"
import SaveButton, { State } from "./SaveButton"

export interface TrackedDomainsViewProps {
  trackedDomains: string[]
  saveButtonState: State
  onSave: () => void
  onTrackedDomainsChange: (domains: string[]) => void
}

export const TrackedDomainsView = ({
  trackedDomains,
  saveButtonState,
  onSave,
  onTrackedDomainsChange,
}: TrackedDomainsViewProps): JSX.Element => (
  <form>
    <h2 className="text-xl mt-4 mb-1">
      <label htmlFor="tracked-domains">Getrackte Domains</label>
    </h2>
    <Input
      id="tracked-domains"
      name="tracked-domains"
      trackedDomains={trackedDomains}
      onChange={onTrackedDomainsChange}
    />
    <SaveButton
      state={saveButtonState}
      onClick={ev => {
        ev.preventDefault()
        onSave && onSave()
      }}
    />
  </form>
)

export interface TrackedDomainsControlProps {
  initialTrackedDomains: string[]
}

const TrackedDomainsControl = ({
  initialTrackedDomains,
}: TrackedDomainsControlProps): JSX.Element => {
  const [trackedDomains, setTrackedDomains] = useState(initialTrackedDomains)
  const [state, setState] = useState(State.Unchanged)

  const onTrackedDomainsChange = useCallback(newDomains => {
    setTrackedDomains(newDomains)
    setState(newDomains.length > 0 ? State.Changed : State.Unchanged)
  }, [])

  const analyticsClient = useContext(AnalyticsClientContext)
  const onSave = useCallback(() => {
    setState(State.Saving)
    analyticsClient.default
      .putTrackedDomainsTrackedDomainsPut({
        tracked_domains: trackedDomains,
      })
      .then(() => {
        setState(State.SavedSuccesfully)
      })
      .catch(e => {
        setState(State.Failure)
        console.error(e)
      })
  }, [trackedDomains])

  return (
    <TrackedDomainsView
      trackedDomains={trackedDomains}
      saveButtonState={state}
      onTrackedDomainsChange={onTrackedDomainsChange}
      onSave={onSave}
    />
  )
}

export default TrackedDomainsControl
