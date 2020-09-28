import { Sans, Serif } from "palette"
import React from "react"

interface Props {
  text: string
  title: string
}

export const TextSection: React.FC<Props> = ({ text, title }) => (
  <>
    <Sans size="3t" weight="medium" mb={2}>
      {title}
    </Sans>
    <Serif size="3">{text}</Serif>
  </>
)
