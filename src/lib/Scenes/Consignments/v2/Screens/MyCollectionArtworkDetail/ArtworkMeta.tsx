import React from "react"
import { Field } from "./Field"

export const ArtworkMeta: React.FC<{ artwork: ArtworkMetaArtwork }> = ({ artwork }) => {
  const titleField = !!artwork.title && <Field label="Title" value={artwork.title} />
  const yearField = !!artwork.date && <Field label="Year created" value={artwork.date} />
  const mediumField = !!artwork.medium && <Field label="Medium" value={artwork?.medium} />

  return (
    <>
      <Field label="Artist" value={artwork.artistNames} />
      {titleField}
      {yearField}
      {mediumField}
    </>
  )
}

// FIXME: Everything below here will be replaced when we're connected to real data
export interface ArtworkMetaArtwork {
  artistNames: string
  date?: string
  medium?: string
  title?: string
}
