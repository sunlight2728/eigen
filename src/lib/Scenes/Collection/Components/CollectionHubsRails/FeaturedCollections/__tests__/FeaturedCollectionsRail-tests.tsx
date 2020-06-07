import { Theme } from "@artsy/palette"
import {
  FeaturedCollectionsRailTestsQuery,
  FeaturedCollectionsRailTestsQueryRawResponse,
} from "__generated__/FeaturedCollectionsRailTestsQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import {
  FeaturedCollectionsRail,
  FeaturedCollectionsRailContainer,
  ImageWrapper,
} from "lib/Scenes/Collection/Components/CollectionHubsRails/FeaturedCollections/FeaturedCollectionsRail"
import React from "react"
import { TouchableHighlight } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))
jest.mock("react-tracking")

describe("Featured Collections Rail", () => {
  const trackEvent = jest.fn()
  let env: ReturnType<typeof createMockEnvironment>

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

  const TestRenderer = () => (
    <QueryRenderer<FeaturedCollectionsRailTestsQuery>
      environment={env}
      query={graphql`
        query FeaturedCollectionsRailTestsQuery @raw_response_type {
          marketingCollection(slug: "post-war") {
            ...FeaturedCollectionsRail_collection
            linkedCollections {
              groupType
              ...FeaturedCollectionsRail_collectionGroup
            }
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.marketingCollection) {
          return (
            <Theme>
              <FeaturedCollectionsRailContainer
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
          ...FeaturedCollectionsFixture,
        },
      })
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(FeaturedCollectionsRail)).toHaveLength(1)
  })

  it("correctly tracks when a collection is tapped", () => {
    const wrapper = getWrapper()
    wrapper.root.findAllByType(TouchableHighlight)[0].props.onPress()

    expect(trackEvent).toBeCalledWith({
      action_type: "tappedCollectionGroup",
      context_module: "curatedHighlightsRail",
      context_screen_owner_id: "hub-collection",
      context_screen_owner_slug: "hub-collection-slug",
      context_screen_owner_type: "Collection",
      destination_screen_owner_id: "featured-collection-id-1",
      destination_screen_owner_slug: "featured-collection-1",
      destination_screen_owner_type: "Collection",
      horizontal_slide_position: 1,
      type: "thumbnail",
    })
  })

  describe("Featured Collections Rail", () => {
    let props: any /* STRICTNESS_MIGRATION */
    beforeEach(() => {
      props = {
        collectionGroup: FeaturedCollectionsFixture?.marketingCollection?.linkedCollections[0],
        collection: FeaturedCollectionsFixture?.marketingCollection,
      }
    })

    it("renders three collections in the Featured Collections Series", () => {
      const tree = ReactTestRenderer.create(
        <Theme>
          <FeaturedCollectionsRail {...props} />
        </Theme>
      ).root

      expect(tree.findAllByType(ImageWrapper).length).toBe(3)
    })

    it("renders the collection hub rail title", () => {
      const tree = ReactTestRenderer.create(
        <Theme>
          <FeaturedCollectionsRail {...props} />
        </Theme>
      ).root
      expect(tree.findByProps({ "data-test-id": "group" }).props.children).toBe("Curated Highlights")
    })

    it("renders each Featured Collection's title", () => {
      const tree = ReactTestRenderer.create(
        <Theme>
          <FeaturedCollectionsRail {...props} />
        </Theme>
      ).root

      const title1 = tree.findByProps({ "data-test-id": "title-0" })
      const title2 = tree.findByProps({ "data-test-id": "title-1" })
      const title3 = tree.findByProps({ "data-test-id": "title-2" })

      expect(title1.props.children).toBe("First Featured Collection")
      expect(title2.props.children).toBe("Second Featured Collection")
      expect(title3.props.children).toBe("Third Featured Collection")
    })

    it("renders each Featured Collection's price guidance metadata", () => {
      const tree = ReactTestRenderer.create(
        <Theme>
          <FeaturedCollectionsRail {...props} />
        </Theme>
      ).root

      const price1 = tree.findByProps({ "data-test-id": "price-0" })
      const price2 = tree.findByProps({ "data-test-id": "price-1" })
      const price3 = tree.findByProps({ "data-test-id": "price-2" })

      expect(price1.props.children).toBe("From $15,000")
      expect(price2.props.children).toBe("From $25,000")
      expect(price3.props.children).toBe("From $35,000")
    })

    it("navigates to a new collection when tapped", () => {
      const tree = ReactTestRenderer.create(
        <Theme>
          <FeaturedCollectionsRail {...props} />
        </Theme>
      ).root

      const instance = tree.findAllByType(TouchableHighlight)[0]
      act(() => instance.props.onPress())

      expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
        expect.anything(),
        "/collection/featured-collection-1"
      )
    })
  })
})

const FeaturedCollectionsFixture: FeaturedCollectionsRailTestsQueryRawResponse = {
  marketingCollection: {
    id: "hub-collection",
    slug: "hub-collection-slug",
    linkedCollections: [
      {
        groupType: "FeaturedCollections",
        name: "Curated Highlights",
        members: [
          {
            slug: "featured-collection-1",
            id: "featured-collection-id-1",
            title: "First Featured Collection",
            priceGuidance: 15000,
            descriptionMarkdown: "Featured collection 1 description",
            featuredCollectionArtworks: {
              id: null,
              edges: [
                {
                  node: {
                    id: null,
                    image: {
                      url: "https://featured-collection-one/medium.jpg",
                    },
                  },
                },
              ],
            },
          },
          {
            slug: "featured-collection-2",
            id: "featured-collection-id-2",
            title: "Second Featured Collection",
            priceGuidance: 25000,
            descriptionMarkdown: "Featured collection 2 description",
            featuredCollectionArtworks: {
              id: null,
              edges: [
                {
                  node: {
                    id: null,
                    image: {
                      url: "https://featured-collection-two/medium.jpg",
                    },
                  },
                },
              ],
            },
          },
          {
            slug: "featured-collection-1",
            id: "featured-collection-id-3",
            title: "Third Featured Collection",
            priceGuidance: 35000,
            descriptionMarkdown: "Featured collection 3 description",
            featuredCollectionArtworks: {
              id: null,
              edges: [
                {
                  node: {
                    id: null,
                    image: {
                      url: "https://featured-collection-three /medium.jpg",
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
