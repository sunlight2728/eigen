import { Button, Sans, Theme } from "@artsy/palette"
import { PartnerCard_artwork } from "__generated__/PartnerCard_artwork.graphql"
import { PartnerCardTestsQueryRawResponse } from "__generated__/PartnerCardTestsQuery.graphql"
// @ts-ignore
import { mount } from "enzyme"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { Image } from "react-native"
import { graphql, RelayProp } from "react-relay"
import { PartnerCard, PartnerCardFragmentContainer } from "../PartnerCard"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

jest.unmock("react-relay")

describe("PartnerCard", () => {
  it("renders partner name correctly", () => {
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtwork} />
      </Theme>
    )
    expect(component.find(Button).length).toEqual(1)

    expect(component.text()).toContain(`Test Gallery`)
  })

  it("renders partner image", () => {
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtwork} />
      </Theme>
    )

    expect(component.find(Image)).toHaveLength(1)
  })

  it("renders partner type", () => {
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtwork} />
      </Theme>
    )

    expect(
      component
        .find(Sans)
        .at(0)
        .text()
    ).toMatchInlineSnapshot(`"At gallery"`)
  })

  it("renders partner type correctly for institutional sellers", () => {
    const PartnerCardArtworkInstitutionalSeller = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        type: "Institutional Seller",
      },
    }
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtworkInstitutionalSeller} />
      </Theme>
    )

    expect(
      component
        .find(Sans)
        .at(0)
        .text()
    ).toMatchInlineSnapshot(`"At institution"`)
  })

  it("doesn't render partner type for partners that aren't institutions or galleries", () => {
    const PartnerCardArtworkOtherType = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        type: "Some Other Partner Type",
      },
    }
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtworkOtherType} />
      </Theme>
    )

    expect(
      component
        .find(Sans)
        .at(0)
        .text()
    ).not.toEqual("At institution")
    expect(
      component
        .find(Sans)
        .at(0)
        .text()
    ).not.toEqual("At gallery")
  })

  it("renders partner initials when no image is present", () => {
    const PartnerCardArtworkWithoutImage = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        profile: null,
      },
    }
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtworkWithoutImage} />
      </Theme>
    )

    expect(component.find(Image)).toHaveLength(0)
    expect(component.text()).toContain(`TG`)
  })
  it("truncates partner locations correctly", () => {
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtwork} />
      </Theme>
    )
    expect(component.find(Button).length).toEqual(1)

    expect(component.text()).toContain(`Miami, New York, +3 more`)
  })

  it("renders button text correctly", () => {
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtwork} />
      </Theme>
    )
    expect(component.find(Button)).toHaveLength(1)

    expect(
      component
        .find(Button)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"FollowFollowing"`)
  })

  it("does not render when the partner is an auction house", () => {
    const PartnerCardArtworkAuctionHouse: PartnerCard_artwork = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        type: "Auction House",
      },
    }
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtworkAuctionHouse} />
      </Theme>
    )
    expect(component.html()).toBe(null)
  })

  it("does not render when the artwork is in a benefit or gallery auction", () => {
    const PartnerCardArtworkAuction = {
      ...PartnerCardArtwork,
      sale: {
        isBenefit: true,
        isGalleryAuction: true,
      },
    }
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtworkAuction} />
      </Theme>
    )
    expect(component.html()).toBe(null)
  })

  it("does not render follow button when the partner has no profile info", () => {
    const PartnerCardArtworkNoProfile = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        profile: null,
      },
    }
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtworkNoProfile} />
      </Theme>
    )
    expect(component.find(Button)).toHaveLength(0)
  })

  describe("Following a partner", () => {
    const getWrapper = async ({ mockArtworkData, mockFollowResults }: any) => {
      return await renderRelayTree({
        Component: (props: any) => (
          <Theme>
            <PartnerCardFragmentContainer {...props} />
          </Theme>
        ),
        query: graphql`
          query PartnerCardTestsQuery @raw_response_type {
            artwork(id: "artworkID") {
              ...PartnerCard_artwork
            }
          }
        `,
        mockData: { artwork: mockArtworkData } as PartnerCardTestsQueryRawResponse,
        mockMutationResults: { followProfile: mockFollowResults },
      })
    }

    it("correctly displays when the artist is already followed, and allows unfollowing", async () => {
      const PartnerCardArtworkFollowed = {
        ...PartnerCardArtwork,
        partner: {
          ...PartnerCardArtwork.partner,
          profile: {
            ...PartnerCardArtwork.partner!.profile,
            is_followed: true,
          },
        },
      }

      const unfollowResponse = {
        profile: {
          is_followed: false,
          slug: PartnerCardArtwork.partner!.slug,
          internalID: PartnerCardArtwork.partner!.profile!.internalID,
        },
      }

      const partnerCard = await getWrapper({
        mockArtworkData: PartnerCardArtworkFollowed,
        mockFollowResults: unfollowResponse,
      })

      const followButton = partnerCard.find(Button)
      expect(followButton.text()).toMatchInlineSnapshot(`"FollowingFollowing"`)

      await partnerCard
        .find(Button)
        .at(0)
        .props()
        .onPress()

      await flushPromiseQueue()
      partnerCard.update()

      const updatedFollowButton = partnerCard.find(Button).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"FollowFollowing"`)
    })

    it("correctly displays when the work is not followed, and allows following", async () => {
      const followResponse = {
        profile: {
          is_followed: true,
          slug: PartnerCardArtwork.partner!.slug,
          internalID: PartnerCardArtwork.partner!.profile!.internalID,
        },
      }
      const partnerCard = await getWrapper({
        mockArtworkData: PartnerCardArtwork,
        mockFollowResults: followResponse,
      })

      const followButton = partnerCard.find(Button).at(0)
      expect(followButton.text()).toMatchInlineSnapshot(`"FollowFollowing"`)

      await partnerCard
        .find(Button)
        .at(0)
        .props()
        .onPress()

      await flushPromiseQueue()
      partnerCard.update()

      const updatedFollowButton = partnerCard.find(Button).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"FollowingFollowing"`)
    })

    // TODO Update once we can use relay's new facilities for testing
    xit("handles errors in saving gracefully", async () => {
      const partnerCard = await renderRelayTree({
        Component: PartnerCardFragmentContainer,
        query: graphql`
          query PartnerCardTestsErrorQuery @raw_response_type {
            artwork(id: "artworkID") {
              ...PartnerCard_artwork
            }
          }
        `,
        mockData: { artwork: PartnerCardArtwork }, // Enable/fix this when making large change to these components/fixtures: as PartnerCardTestsErrorQueryRawResponse,
        mockMutationResults: {
          PartnerCardFragmentContainer: () => {
            return Promise.reject(new Error("failed to fetch"))
          },
        },
      })

      const followButton = partnerCard.find(Button).at(0)
      expect(followButton.text()).toMatchInlineSnapshot(`"Follow"`)

      await partnerCard
        .find(Button)
        .at(0)
        .props()
        .onPress()

      await flushPromiseQueue()
      partnerCard.update()

      const updatedFollowButton = partnerCard.find(Button).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Follow"`)
    })
  })
})

const PartnerCardArtwork: PartnerCard_artwork = {
  sale: {
    isBenefit: false,
    isGalleryAuction: false,
  },
  partner: {
    is_default_profile_public: true,
    type: "Gallery",
    name: "Test Gallery",
    slug: "12345",
    id: "12345",
    href: "",
    initials: "TG",
    profile: {
      id: "12345",
      internalID: "56789",
      is_followed: false,
      icon: {
        url: "https://d32dm0rphc51dk.cloudfront.net/YciR5levjrhp2JnFYlPxpw/square140.png",
      },
    },
    cities: ["Miami", "New York", "Hong Kong", "London", "Boston"],
  },
  " $refType": null as any,
}
