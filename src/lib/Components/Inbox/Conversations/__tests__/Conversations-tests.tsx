import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { getTextTree } from "lib/utils/getTestWrapper"

import { Conversations_me } from "__generated__/Conversations_me.graphql"
import { Conversations } from "../Conversations"

import { Theme } from "@artsy/palette"

describe("messaging inbox", () => {
  it("renders without throwing a error", () => {
    renderer.create(
      <Theme>
        <Conversations
          me={meProps}
          relay={
            {
              hasMore: jest.fn(),
            } as any
          }
        />
      </Theme>
    )
  })

  it("doesn't render the header when there are no messages", () => {
    const expected = "Messages"
    const inboxText = getTextTree(<Conversations me={mePropsEmpty} relay={{ hasMore: jest.fn() } as any} />)
    expect(inboxText).not.toContain(expected)
  })

  const meProps = ({
    conversations: {
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
      edges: [
        {
          node: {
            id: "582",
            inquiryId: "59302144275b244a81d0f9c6",
            from: { name: "Jean-Luc Collecteur", email: "luc+messaging@artsymail.com" },
            to: { name: "ACA Galleries" },
            lastMessage: "Karl and Anna... Fab!",
            created_at: "2017-06-01T14:14:35.538Z",
            items: [
              {
                title: "Karl and Anna Face Off (Diptych)",
                item: {
                  __typename: "Artwork",
                  id: "bradley-theodore-karl-and-anna-face-off-diptych",
                  href: "/artwork/bradley-theodore-karl-and-anna-face-off-diptych",
                  title: "Karl and Anna Face Off (Diptych)",
                  date: "2016",
                  artistNames: "Bradley Theodore",
                  image: {
                    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
                    imageUrl: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/:version.jpg",
                  },
                },
              },
            ],
          },
        },
        {
          node: {
            id: "581",
            inquiry_id: "593020be8b3b814f9f86f2fd",
            from: { name: "Jean-Luc Collecteur", email: "luc+messaging@artsymail.com" },
            to: { name: "David Krut Projects" },
            lastMessage:
              "Hi, I’m interested in purchasing this work. \
                    Could you please provide more information about the piece?",
            createdAt: "2017-06-01T14:12:19.155Z",
            items: [
              {
                title: "Darkness Give Way to Light",
                item: {
                  __typename: "Artwork",
                  id: "aida-muluneh-darkness-give-way-to-light-1",
                  href: "/artwork/aida-muluneh-darkness-give-way-to-light-1",
                  title: "Darkness Give Way to Light",
                  date: "2016",
                  artistNames: "Aida Muluneh",
                  image: {
                    url: "https://d32dm0rphc51dk.cloudfront.net/FDIuqbZUY1kLR-1Pd-Ec8w/normalized.jpg",
                    imageUrl: "https://d32dm0rphc51dk.cloudfront.net/FDIuqbZUY1kLR-1Pd-Ec8w/:version.jpg",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  } as any) as Conversations_me

  const mePropsEmpty = ({
    conversations: {
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
      edges: [],
    },
  } as any) as Conversations_me
})
