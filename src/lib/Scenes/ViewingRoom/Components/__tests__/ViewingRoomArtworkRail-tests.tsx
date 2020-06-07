import { Theme } from "@artsy/palette"
import { ViewingRoomArtworkRailTestsQuery } from "__generated__/ViewingRoomArtworkRailTestsQuery.graphql"
import { ArtworkTileRail } from "lib/Components/ArtworkTileRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractText } from "lib/tests/extractText"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { tracks, ViewingRoomArtworkRailContainer } from "../ViewingRoomArtworkRail"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe("ViewingRoomArtworkRail", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <Theme>
      <QueryRenderer<ViewingRoomArtworkRailTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query ViewingRoomArtworkRailTestsQuery {
            viewingRoom(id: "unused") {
              ...ViewingRoomArtworkRail_viewingRoom
            }
          }
        `}
        render={renderWithLoadProgress(ViewingRoomArtworkRailContainer)}
        variables={{}}
      />
    </Theme>
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })
  it("renders a title for the rail", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation)
      return result
    })
    expect(tree.root.findAllByType(SectionTitle)).toHaveLength(1)
  })

  it("navigates to the artworks screen + calls tracking when title is tapped", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({
          slug: "gallery-name-viewing-room-name",
          internalID: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
        }),
      })
      return result
    })
    tree.root.findByType(SectionTitle).props.onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/viewing-room/gallery-name-viewing-room-name/artworks"
    )
    expect(useTracking().trackEvent).toHaveBeenCalledWith(
      tracks.tappedArtworkGroupHeader("2955ab33-c205-44ea-93d2-514cd7ee2bcd", "gallery-name-viewing-room-name")
    )
  })

  it("renders one artwork card per edge", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({
          artworks: {
            edges: [
              {
                node: {
                  href: "/artwork/nicolas-party-rocks-ii",
                  internalID: "5deff4b96fz7e7000f36ce37",
                  slug: "nicolas-party-rocks-ii",
                  artistNames: ["Nicolas Party"],
                  image: {
                    imageURL: "https://d32dm0rphc51dk.cloudfront.net/Tc9k2ROn55SxNHWjYxxnrg/:version.jpg",
                  },
                  saleMessage: "$20,000",
                },
              },
              {
                node: {
                  internalID: "5d14c764d2f1db001243a81e",
                  slug: "nicolas-party-still-life-no-011",
                  artistNames: "Nicolas Party",
                  href: "/artwork/nicolas-party-still-life-no-011",
                  saleMessage: "$25,000",
                  image: {
                    imageURL: "https://d32dm0rphc51dk.cloudfront.net/Tc9k2ROn55SxNHWjYxxnrg/:version.jpg",
                  },
                },
              },
            ],
          },
        }),
      })
      return result
    })
    expect(tree.root.findAllByType(ArtworkTileRail)).toHaveLength(1)
    expect(extractText(tree.root)).toMatch(/Nicolas Party\$20,000/)
    expect(extractText(tree.root)).toMatch(/Nicolas Party\$25,000/)
  })
})
