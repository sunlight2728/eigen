import { FilteredInfiniteScrollGridTestsQueryRawResponse } from "__generated__/FilteredInfiniteScrollGridTestsQuery.graphql"
import React from "react"
import { graphql } from "react-relay"

import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { FilteredInfiniteScrollGridContainer as FilteredInfiniteScrollGrid } from "../FilteredInfiniteScrollGrid"

jest.unmock("react-relay")

// FIXME: Fix fixture data
describe("FilteredInfiniteScrollGrid", () => {
  xit("Passes filteredArtworks correctly", async () => {
    const tree = await renderRelayTree({
      Component: ({ show }) => {
        return <FilteredInfiniteScrollGrid entity={show} />
      },
      query: graphql`
        query FilteredInfiniteScrollGridTestsQuery @raw_response_type {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            id # dummy
            # filteredArtworks(size: 0, medium: "*", priceRange: "*-*", aggregations: [MEDIUM, PRICE_RANGE, TOTAL]) {
            #   ...FilteredInfiniteScrollGrid_filteredArtworks
            # }
          }
        }
      `,
      mockData: {
        show: { id: "anderson-fine-art-gallery-flickinger-collection" },
      } as FilteredInfiniteScrollGridTestsQueryRawResponse,
    })
    expect(tree.find(InfiniteScrollArtworksGrid).props().filteredArtworks.artworks.edges.length).toBe(
      // @ts-ignore STRICTNESS_MIGRATION
      ShowFixture.filterArtworksConnection.edges.length
    )
  })
})
