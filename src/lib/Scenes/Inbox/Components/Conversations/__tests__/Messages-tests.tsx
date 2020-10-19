import React from "react"

import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import "react-native"
import Messages from "../Messages"

it("renders without throwing an error", () => {
  renderWithWrappers(<Messages conversation={props as any} />)
})

const props = {
  gravityID: "Conversation:420",
  id: "420",
  from: {
    name: "Anita Garibaldi",
    email: "anita@garibaldi.br",
    initials: "AG",
  },
  to: { name: "Kimberly Klark", initials: "KK" },
  initialMessage: "Adoro! Por favor envie-me mais informações",
  messages: {
    pageInfo: {
      startCursor: null,
      endCursor: null,
      hasPreviousPage: false,
      hasNextPage: false,
    },
    edges: [
      {
        cursor: "some-cursor",
        node: {
          gravityID: "unique-id",
          id: 222,
          impulse_id: "impulse:222",
          isFromUser: true,
          body: "Adoro! Por favor envie-me mais informações",
          fromEmailAddress: "anita@garibaldi.br",
          attachments: [],
          from: {
            name: "Percy",
            email: "percy@cat.com",
          },
        },
      },
    ],
  },
  items: [
    {
      artwork: {
        id: "adrian-piper-the-mythic-being-sols-drawing-number-1-5",
        href: "/artwork/adrian-piper-the-mythic-being-sols-drawing-number-1-5",
        title: "The Mythic Being: Sol’s Drawing #1–5",
        date: "1974",
        artistNames: "Adrian Piper",
        image: {
          url: "https://d32dm0rphc51dk.cloudfront.net/W1FkNoM9IjrND_xv_DTkeg/normalized.jpg",
          imageUrl: "https://d32dm0rphc51dk.cloudfront.net/J0uofgV9e8cIxGiZwn12mg/:version.jpg",
        },
      },
    },
  ],
}
