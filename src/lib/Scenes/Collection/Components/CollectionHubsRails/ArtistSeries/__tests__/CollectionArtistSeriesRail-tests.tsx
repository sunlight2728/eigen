import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { Sans, Theme } from "@artsy/palette"
import {
  CollectionArtistSeriesRailTestsQuery,
  CollectionArtistSeriesRailTestsQueryRawResponse,
} from "__generated__/CollectionArtistSeriesRailTestsQuery.graphql"
// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import {
  GenericArtistSeriesMeta,
  GenericArtistSeriesRail,
  GenericArtistSeriesTitle,
} from "lib/Components/GenericArtistSeriesRail"
import { CardRailArtworkImageContainer as ArtworkImageContainer, CardRailCard } from "lib/Components/Home/CardRailCard"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import {
  CollectionArtistSeriesRail,
  CollectionArtistSeriesRailContainer,
} from "lib/Scenes/Collection/Components/CollectionHubsRails/ArtistSeries/CollectionArtistSeriesRail"
import { useTracking } from "react-tracking"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))
jest.mock("react-tracking")

describe("Artist Series Rail", () => {
  const trackEvent = jest.fn()
  let env: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<CollectionArtistSeriesRailTestsQuery>
      environment={env}
      query={graphql`
        query CollectionArtistSeriesRailTestsQuery @raw_response_type {
          marketingCollection(slug: "photography") {
            ...CollectionArtistSeriesRail_collection
            linkedCollections {
              groupType
              ...CollectionArtistSeriesRail_collectionGroup
            }
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.marketingCollection) {
          return (
            <Theme>
              <CollectionArtistSeriesRailContainer
                collection={props.marketingCollection}
                collectionGroup={props.marketingCollection.linkedCollections[0]}
              />
            </Theme>
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          ...CollectionHubRailsArtistSeriesFixture,
        },
      })
    })
    return tree
  }

  beforeEach(() => {
    env = createMockEnvironment()
    const mockTracking = useTracking as jest.Mock
    mockTracking.mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(GenericArtistSeriesRail)).toHaveLength(1)
  })

  it("correctly tracks when a collection is tapped", () => {
    const wrapper = getWrapper()
    wrapper.root.findAllByType(CardRailCard)[0].props.onPress()

    expect(trackEvent).toBeCalledWith({
      action_type: "tappedCollectionGroup",
      context_module: "artistSeriesRail",
      context_screen_owner_id: "collection0",
      context_screen_owner_slug: "cool-collection",
      context_screen_owner_type: "Collection",
      destination_screen_owner_id: "collection1",
      destination_screen_owner_slug: "cindy-sherman-untitled-film-stills",
      destination_screen_owner_type: "Collection",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
  })

  describe("Trending Artists Rail", () => {
    let props: any /* STRICTNESS_MIGRATION */
    beforeEach(() => {
      props = {
        collectionGroup: CollectionHubRailsArtistSeriesFixture?.marketingCollection?.linkedCollections[0],
        collection: CollectionHubRailsArtistSeriesFixture?.marketingCollection,
      }
    })

    it("renders the Trending Artists Series rail component", () => {
      const wrapper = mount(
        <Theme>
          <CollectionArtistSeriesRail {...props} />
        </Theme>
      )

      expect(wrapper.find(GenericArtistSeriesRail)).toHaveLength(1)
    })

    it("renders three artist series in the Trending Artists Series", () => {
      const wrapper = mount(
        <Theme>
          <CollectionArtistSeriesRail {...props} />
        </Theme>
      )

      expect(wrapper.find(ArtworkImageContainer)).toHaveLength(3)
    })

    it("renders three images of the correct size in an artist series", () => {
      const wrapper = mount(
        <Theme>
          <CollectionArtistSeriesRail {...props} />
        </Theme>
      )

      expect(
        wrapper
          .find(ImageView)
          .at(0)
          .props().imageURL
      ).toBe("https://cindy-sherman-untitled-film-stills/medium.jpg")

      expect(
        wrapper
          .find(ImageView)
          .at(0)
          .props().height
      ).toBe(180)

      expect(
        wrapper
          .find(ImageView)
          .at(0)
          .props().width
      ).toBe(180)

      expect(
        wrapper
          .find(ImageView)
          .at(1)
          .props().imageURL
      ).toBe("https://cindy-sherman-untitled-film-stills-2/medium.jpg")

      expect(
        wrapper
          .find(ImageView)
          .at(1)
          .props().height
      ).toBe(90)

      expect(
        wrapper
          .find(ImageView)
          .at(1)
          .props().width
      ).toBe(90)

      expect(
        wrapper
          .find(ImageView)
          .at(2)
          .props().imageURL
      ).toBe("https://cindy-sherman-untitled-film-stills-3/medium.jpg")

      expect(
        wrapper
          .find(ImageView)
          .at(2)
          .props().height
      ).toBe(88)

      expect(
        wrapper
          .find(ImageView)
          .at(2)
          .props().width
      ).toBe(90)
    })

    it("renders the collection hub rail title", () => {
      const wrapper = mount(
        <Theme>
          <CollectionArtistSeriesRail {...props} />
        </Theme>
      )

      expect(wrapper.find(Sans).text()).toBe("Trending Artist Series")
    })

    it("renders each artist series' title", () => {
      const wrapper = mount(
        <Theme>
          <CollectionArtistSeriesRail {...props} />
        </Theme>
      )

      expect(
        wrapper
          .find(GenericArtistSeriesTitle)
          .at(0)
          .text()
      ).toBe("Cindy Sherman: Untitled Film Stills")

      expect(
        wrapper
          .find(GenericArtistSeriesTitle)
          .at(1)
          .text()
      ).toBe("Damien Hirst: Butterflies")

      expect(
        wrapper
          .find(GenericArtistSeriesTitle)
          .at(2)
          .text()
      ).toBe("Hunt Slonem: Bunnies")
    })

    it("renders each artist series' metadata", () => {
      const wrapper = mount(
        <Theme>
          <CollectionArtistSeriesRail {...props} />
        </Theme>
      )

      expect(
        wrapper
          .find(GenericArtistSeriesMeta)
          .at(0)
          .text()
      ).toBe("From $20,000")

      expect(
        wrapper
          .find(GenericArtistSeriesMeta)
          .at(1)
          .text()
      ).toBe("From $7,500")

      expect(
        wrapper
          .find(GenericArtistSeriesMeta)
          .at(2)
          .text()
      ).toBe("From $2,000")
    })

    it("navigates to a new collection when a series is tapped", () => {
      const wrapper = mount(
        <Theme>
          <CollectionArtistSeriesRail {...props} />
        </Theme>
      )

      wrapper
        .find(CardRailCard)
        .at(0)
        .props()
        .onPress()

      expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
        expect.anything(),
        "/collection/cindy-sherman-untitled-film-stills"
      )

      wrapper
        .find(CardRailCard)
        .at(1)
        .props()
        .onPress()

      expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
        expect.anything(),
        "/collection/damien-hirst-butterflies"
      )

      wrapper
        .find(CardRailCard)
        .at(2)
        .props()
        .onPress()

      expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
        expect.anything(),
        "/collection/hunt-slonem-bunnies"
      )
    })
  })
})

const CollectionHubRailsArtistSeriesFixture: CollectionArtistSeriesRailTestsQueryRawResponse = {
  marketingCollection: {
    id: "collection0",
    slug: "cool-collection",
    linkedCollections: [
      {
        groupType: "ArtistSeries",
        name: "Trending Artist Series",
        members: [
          {
            slug: "cindy-sherman-untitled-film-stills",
            id: "collection1",
            title: "Cindy Sherman: Untitled Film Stills",
            priceGuidance: 20000,
            artworksConnection: {
              id: "conn1",
              edges: [
                {
                  node: {
                    id: "artwork1",
                    title: "Untitled (Film Still) Tray",
                    image: {
                      url: "https://cindy-sherman-untitled-film-stills/medium.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork2",
                    title: "Untitled (Film Still) Tray 2",
                    image: {
                      url: "https://cindy-sherman-untitled-film-stills-2/medium.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork3",
                    title: "Untitled (Film Still) Tray 3",
                    image: {
                      url: "https://cindy-sherman-untitled-film-stills-3/medium.jpg",
                    },
                  },
                },
              ],
            },
          },
          {
            slug: "damien-hirst-butterflies",
            id: "collection2",
            title: "Damien Hirst: Butterflies",
            priceGuidance: 7500,
            artworksConnection: {
              id: "conn2",
              edges: [
                {
                  node: {
                    id: "artwork4",
                    title: "Untitled (Film Still) Tray",
                    image: {
                      url: "https://damien-hirst-butterflies/larger.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork5",
                    title: "Untitled (Film Still) Tray 2",
                    image: {
                      url: "https://damien-hirst-butterflies-2/larger.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork6",
                    title: "Untitled (Film Still) Tray 3",
                    image: {
                      url: "https://damien-hirst-butterflies-3/larger.jpg",
                    },
                  },
                },
              ],
            },
          },
          {
            slug: "hunt-slonem-bunnies",
            id: "collection3",
            title: "Hunt Slonem: Bunnies",
            priceGuidance: 2000,
            artworksConnection: {
              id: "conn3",
              edges: [
                {
                  node: {
                    id: "artwork7",
                    title: "Untitled",
                    image: {
                      url: "https://hunt-slonem-bunnies/medium.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork8",
                    title: "Untitled2",
                    image: {
                      url: "https://hunt-slonem-bunnies-2/medium.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork9",
                    title: "Untitled3",
                    image: {
                      url: "https://hunt-slonem-bunnies-3/medium.jpg",
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
}
