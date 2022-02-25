import { useEffect, useState } from "react"

export class PendingPromise {
  private constructor(public isLoading: true) {}

  static instance = new PendingPromise(true)
}

export class FulfilledPromise<T> {
  constructor(public isLoading: false, public value: T) {}
}

export class RejectedPromise {
  constructor(public isLoading: false, public error: unknown) {}
}

export type CompletedPromise<T> = FulfilledPromise<T> | RejectedPromise

export type PromiseState<T> = CompletedPromise<T> | PendingPromise

const usePromise = <T>(promise: Promise<T>): PromiseState<T> => {
  const [state, setState] = useState<PromiseState<T>>(PendingPromise.instance)

  useEffect(() => {
    setState(PendingPromise.instance)
    promise
      .then(value => setState(new FulfilledPromise(false, value)))
      .catch(err => setState(new RejectedPromise(false, err)))
  }, [promise])

  return state
}

export default usePromise
