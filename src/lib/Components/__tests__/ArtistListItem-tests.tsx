import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { ArtistFixture } from "../../__fixtures__/ArtistFixture"
import { ArtistListItemContainer as ArtistListItem, formatTombstoneText } from "../ArtistListItem"

jest.unmock("react-relay")

describe("ArtistListItem", () => {
  const render = () =>
    renderRelayTree({
      Component: ({ artist }) => <ArtistListItem artist={artist} />,
      query: graphql`
        query ArtistListItemTestsQuery @raw_response_type {
          artist(id: "pablo-picasso") {
            ...ArtistListItem_artist
          }
        }
      `,
      mockData: {
        artist: ArtistFixture,
      }, // Enable/fix this when making large change to these components/fixtures: as ArtistListItemTestsQueryRawResponse,
    })

  it("renders without throwing an error", async () => {
    await render()
  })
})

describe("formatTombstoneText", () => {
  it("formats with birthday and deathday", () => {
    expect(formatTombstoneText("American", "1990", "2014")).toBe("American, 1990-2014")
  })

  it("formats with only birthday and nationality", () => {
    expect(formatTombstoneText("American", "1990", "")).toBe("American, b. 1990")
  })

  it("formats with only nationality", () => {
    expect(formatTombstoneText("American", "", "")).toBe("American")
  })

  it("formats without nationality", () => {
    expect(formatTombstoneText("", "1990", "2014")).toBe("1990-2014")
  })

  it("formats with only birthday", () => {
    expect(formatTombstoneText("", "1990", "")).toBe("b. 1990")
  })
})
