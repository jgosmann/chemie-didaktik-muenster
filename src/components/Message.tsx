import {
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

export enum Type {
  Success,
  Info,
  Warning,
  Error,
}

const typeIconMapping = {
  [Type.Success]: faCheckCircle,
  [Type.Info]: faInfoCircle,
  [Type.Warning]: faExclamationCircle,
  [Type.Error]: faExclamationCircle,
}

const typeStyleMapping = {
  [Type.Success]: "bg-green-100 border-green-200 text-green-800",
  [Type.Info]: "bg-blue-100 border-blue-200 text-blue-800",
  [Type.Warning]: "bg-yellow-100 border-yellow-200 text-yellow-800",
  [Type.Error]: "bg-red-100 border-red-200 text-red-800",
}

const typeTitleMapping = {
  [Type.Success]: "Erfolg",
  [Type.Info]: "Information",
  [Type.Warning]: "Warnung",
  [Type.Error]: "Fehler",
}

export interface MessageProps {
  type: Type
  className?: string
  children?: React.ReactNode
}

const Message = ({ type, className, children }: MessageProps) => (
  <div
    className={`rounded-lg mt-4 p-2 border ${typeStyleMapping[type]} ${className}`}
  >
    <FontAwesomeIcon
      icon={typeIconMapping[type]}
      fixedWidth
      className="mr-2"
      title={typeTitleMapping[type]}
    />
    {children}
  </div>
)

export default Message
