import { Theme } from "@artsy/palette"
import { FullFeaturedArtistListTestsQueryRawResponse } from "__generated__/FullFeaturedArtistListTestsQuery.graphql"
import { mockTracking } from "lib/tests/mockTracking"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { FullFeaturedArtistListCollectionFixture } from "../__fixtures__/CollectionFixture"
import { CollectionFeaturedArtistsContainer as CollectionFeaturedArtists } from "../FullFeaturedArtistList"
jest.unmock("react-relay")

describe("FullFeaturedArtistList", () => {
  const render = (collection: FullFeaturedArtistListTestsQueryRawResponse["marketingCollection"]) =>
    renderRelayTree({
      Component: mockTracking(({ marketingCollection }) => (
        <Theme>
          <CollectionFeaturedArtists collection={marketingCollection} />
        </Theme>
      )),
      query: graphql`
        query FullFeaturedArtistListTestsQuery @raw_response_type {
          marketingCollection(slug: "emerging-photographers") {
            ...FullFeaturedArtistList_collection
          }
        }
      `,
      mockData: {
        marketingCollection: collection,
      },
    })

  it("renders without throwing an error", async () => {
    expect(await render(FullFeaturedArtistListCollectionFixture))
  })

  it("renders an EntityHeader for each featured artist", async () => {
    const tree = await render(FullFeaturedArtistListCollectionFixture)

    const entityHeaders = tree.find("EntityHeader")
    expect(entityHeaders.length).toEqual(5)

    const output = tree.html()
    expect(output).toContain("Pablo Picasso")
    expect(output).toContain("Andy Warhol")
    expect(output).toContain("Joan Miro")
    expect(output).toContain("Jean-Michel Basquiat")
    expect(output).toContain("Kenny Scharf")
  })

  it("does not render an EntityHeader for excluded artists", async () => {
    // @ts-ignore STRICTNESS_MIGRATION
    const tree = await render({
      ...FullFeaturedArtistListCollectionFixture,
      featuredArtistExclusionIds: ["34534-andy-warhols-id", "2342-pablo-picassos-id"],
    })

    const entityHeaders = tree.find("EntityHeader")
    expect(entityHeaders.length).toEqual(3)

    const output = tree.html()
    expect(output).toContain("Joan Miro")
    expect(output).not.toContain("Andy Warhol")
    expect(output).not.toContain("Pablo Picasso")
    expect(output).toContain("Jean-Michel Basquiat")
    expect(output).toContain("Kenny Scharf")
  })

  describe("when artist ids are explicitly requested", () => {
    it("does not render an EntityHeader for any non-requested artists", async () => {
      // @ts-ignore STRICTNESS_MIGRATION
      const tree = await render({
        ...FullFeaturedArtistListCollectionFixture,
        query: { id: "some-id", artistIDs: ["34534-andy-warhols-id"] },
      })

      const entityHeaders = tree.find("EntityHeader")
      expect(entityHeaders.length).toEqual(1)

      const output = tree.html()
      expect(output).toContain("Andy Warhol")
      expect(output).not.toContain("Joan Miro")
      expect(output).not.toContain("Pablo Picasso")
    })
  })
})
