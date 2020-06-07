import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { Button } from "@artsy/palette"
import { ShowArtistsPreviewTestsQuery } from "__generated__/ShowArtistsPreviewTestsQuery.graphql"
import { ArtistListItem } from "lib/Components/ArtistListItem"
import { extractText } from "lib/tests/extractText"
import React from "react"
import { ShowArtistsPreviewContainer as ShowArtistsPreview } from "../ShowArtistsPreview"

jest.unmock("react-relay")

describe("ArtistsContainer", () => {
  let env: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<ShowArtistsPreviewTestsQuery>
      environment={env}
      query={graphql`
        query ShowArtistsPreviewTestsQuery @raw_response_type {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...ShowArtistsPreview_show
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.show) {
          return <ShowArtistsPreview show={props.show} onViewAllArtistsPressed={jest.fn()} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("Renders the show artists", async () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          show: {
            followedArtists: { edges: [] },
            images: [],
            coverImage: null,
            partner: { __typename: "Partner", name: "Test Partner" },
            isStubShow: false,
            name: "Test Show",
            slug: "test-show",
            artists: [{ name: "Hans Hofmann" }],
          },
        },
      })
    })
    expect(extractText(tree.root.findByType(ArtistListItem))).toContain("Hans Hofmann")
  })

  it("commits a follow mutation", async () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          show: {
            followedArtists: { edges: [] },
            images: [],
            coverImage: null,
            partner: { __typename: "Partner", name: "Test Partner" },
            isStubShow: false,
            name: "Test Show",
            slug: "test-show",
            artists: [{ name: "Hans Hofmann", slug: "hans-hofmann", is_followed: false }],
          },
        },
      })
    })

    tree.root.findAllByType(Button)[0].props.onPress()

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toEqual("ArtistListItemFollowArtistMutation")
    expect(env.mock.getMostRecentOperation().request.variables).toMatchInlineSnapshot(`
      Object {
        "input": Object {
          "artistID": "hans-hofmann",
          "unfollow": false,
        },
      }
    `)
  })
})
