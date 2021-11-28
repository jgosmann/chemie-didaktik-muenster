import React from "react"
import CryptedPhone from "./Phone"
import CryptedEmail from "./Email"

export const DefaultCryptedPhone = () => (
  <CryptedPhone country="+49" area="251" block0="83" block1="39468" />
)
export const DefaultCryptedEmail = () => (
  <CryptedEmail name="chdid" domain="uni-muenster" tld="de" />
)
