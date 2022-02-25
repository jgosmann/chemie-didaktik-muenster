import { useEffect, useState } from "react"

export class PendingPromise {
  private constructor(public readonly isLoading: true) {}

  static readonly instance = new PendingPromise(true)
}

export class FulfilledPromise<T> {
  public readonly isLoading: false
  public readonly value: T

  constructor(value: T) {
    this.value = value
  }
}

export class RejectedPromise {
  public readonly isLoading: false
  public readonly error: unknown

  constructor(error: unknown) {
    this.error = error
  }
}

export type CompletedPromise<T> = FulfilledPromise<T> | RejectedPromise

export type PromiseState<T> = CompletedPromise<T> | PendingPromise

const usePromise = <T>(promise: Promise<T>): PromiseState<T> => {
  const [state, setState] = useState<PromiseState<T>>(PendingPromise.instance)

  useEffect(() => {
    setState(PendingPromise.instance)
    promise
      .then(value => setState(new FulfilledPromise(value)))
      .catch(err => setState(new RejectedPromise(err)))
  }, [promise])

  return state
}

export default usePromise
