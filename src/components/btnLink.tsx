import * as React from "react"

export interface BtnLinkProps {
  children: React.ReactNode
}

const BtnLink = ({ children }: BtnLinkProps) => (
  <a
    href="https://..."
    className="w-44 min-w-max rounded-lg border p-3 flex justify-center place-items-center text-white shadow bg-primary-400 hover:bg-primary-600 transition-colors ease-out hover:no-underline active:no-underline"
  >
    {children}
  </a>
)

export default BtnLink
