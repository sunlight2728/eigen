import { Sans, Theme } from "@artsy/palette"
import { CollectionHeaderTestsQueryRawResponse } from "__generated__/CollectionHeaderTestsQuery.graphql"
// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ReadMore } from "lib/Components/ReadMore"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { CollectionFixture } from "../../Components/__fixtures__/CollectionFixture"
import { CollectionHeader, CollectionHeaderContainer } from "../CollectionHeader"

jest.unmock("react-relay")

it("renders without throwing an error", async () => {
  await renderRelayTree({
    Component: (props: any) => (
      <Theme>
        <CollectionHeaderContainer collection={props.marketingCollection} {...props} />
      </Theme>
    ),
    query: graphql`
      query CollectionHeaderTestsQuery @raw_response_type {
        marketingCollection(slug: "street-art-now") {
          ...CollectionHeader_collection
        }
      }
    `,
    mockData: { marketingCollection: CollectionFixture } as CollectionHeaderTestsQueryRawResponse,
  })
})

describe("collection header", () => {
  // @ts-ignore STRICTNESS_MIGRATION
  let props: any
  beforeEach(() => {
    props = {
      collection: { ...CollectionFixture },
    }
  })

  it("passes the collection header image url to collection header", () => {
    const wrapper = mount(
      <Theme>
        <CollectionHeader {...props} />
      </Theme>
    )
    expect(wrapper.find(OpaqueImageView).html()).toContain("http://imageuploadedbymarketingteam.jpg")
  })

  it("passes the collection header title to collection header", () => {
    const wrapper = mount(
      <Theme>
        <CollectionHeader {...props} />
      </Theme>
    )

    expect(
      wrapper
        .find(Sans)
        .at(0)
        .html()
    ).toContain("Street Art Now")
  })

  it("passes the url of the most marketable artwork in the collection to the collection header when there is no headerImage value present", () => {
    props.collection.headerImage = null
    const wrapper = mount(
      <Theme>
        <CollectionHeader {...props} />
      </Theme>
    )
    expect(wrapper.find(OpaqueImageView).html()).toContain("https://defaultmostmarketableartworkincollectionimage.jpg")
  })

  it("does not render the Read More component when there is no description", () => {
    props.collection.descriptionMarkdown = null
    const wrapper = mount(
      <Theme>
        <CollectionHeader {...props} />
      </Theme>
    )
    expect(wrapper.find(ReadMore).exists()).toBe(false)
  })

  it("passes the collection header description to collection header", () => {
    const wrapper = mount(
      <Theme>
        <CollectionHeader {...props} />
      </Theme>
    )

    expect(wrapper.find(ReadMore).exists()).toBe(true)
    expect(
      wrapper
        .find(ReadMore)
        .find(Sans)
        .text()
    ).toContain("A beach towel by Yayoi Kusama, a classic print by Alexander Calder, or a piggy bank by Yoshitomo Nara")
  })
})
