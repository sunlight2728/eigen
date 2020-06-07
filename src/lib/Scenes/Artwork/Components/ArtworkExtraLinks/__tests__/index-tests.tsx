import { Sans, Theme } from "@artsy/palette"
// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import React from "react"
import { Text } from "react-native"
import { ArtworkExtraLinks } from "../index"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

jest.unmock("react-tracking")

jest.mock("lib/NativeModules/Events", () => ({ postEvent: jest.fn() }))

import { ArtworkExtraLinks_artwork } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { AuctionTimerState } from "lib/Components/Bidding/Components/Timer"
import { postEvent } from "lib/NativeModules/Events"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { mockTracking } from "lib/tests/mockTracking"

describe("ArtworkExtraLinks", () => {
  it("redirects to consignments flow when consignments link is clicked", () => {
    const artwork = {
      ...ArtworkFixture,
      isForSale: true,
      artists: [
        {
          name: "Santa",
          isConsignable: true,
        },
      ],
    }
    const component = mount(
      <Theme>
        <ArtworkExtraLinks
          artwork={artwork}
          // @ts-ignore STRICTNESS_MIGRATION
          auctionState={null}
        />
      </Theme>
    )
    const consignmentsLink = component.find(Text).at(1)
    // @ts-ignore STRICTNESS_MIGRATION
    const texts = component.find(Sans).map(x => x.text())

    expect(texts[0]).toContain("Consign with Artsy.")
    consignmentsLink.props().onPress()
    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), "/consign/submission")
  })

  describe("for an artwork with more than 1 consignable artist", () => {
    it("shows plural link text", () => {
      const artwork = {
        ...ArtworkFixture,
        isForSale: true,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
          {
            name: "Easter Bunny",
            isConsignable: true,
          },
        ],
      }
      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artwork={artwork}
            // @ts-ignore STRICTNESS_MIGRATION
            auctionState={null}
          />
        </Theme>
      )
      expect(component.text()).toContain("Want to sell a work by these artists?")
    })

    it("shows consign link if at least 1 artist is consignable", () => {
      const artwork = {
        ...ArtworkFixture,
        isForSale: true,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }

      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artwork={artwork}
            // @ts-ignore STRICTNESS_MIGRATION
            auctionState={null}
          />
        </Theme>
      )
      expect(component.text()).toContain("Consign with Artsy.")
    })

    it("doesn't render component if no artists are consignable", () => {
      const artwork = {
        ...ArtworkFixture,
        isForSale: true,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }
      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artwork={artwork}
            // @ts-ignore STRICTNESS_MIGRATION
            auctionState={null}
          />
        </Theme>
      )
      expect(component).toEqual({})
    })
  })

  describe("for an artwork with one artist", () => {
    it("shows singular link text", () => {
      const artwork = {
        ...ArtworkFixture,
        isForSale: true,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }
      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artwork={artwork}
            // @ts-ignore STRICTNESS_MIGRATION
            auctionState={null}
          />
        </Theme>
      )
      expect(component.text()).toContain("Want to sell a work by Santa?")
    })

    it("shows consign link", () => {
      const artwork = {
        ...ArtworkFixture,
        isForSale: true,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }
      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artwork={artwork}
            // @ts-ignore STRICTNESS_MIGRATION
            auctionState={null}
          />
        </Theme>
      )
      expect(component.text()).toContain("Consign with Artsy.")
    })
  })

  describe("FAQ and specialist BNMO links", () => {
    it("does not render FAQ or ask a specialist links when isInquireable", () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: false,
        isInquireable: true,
        isForSale: true,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }

      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artwork={artwork}
            // @ts-ignore STRICTNESS_MIGRATION
            auctionState={null}
          />
        </Theme>
      )
      expect(component.text()).not.toContain("Read our FAQ")
      expect(component.text()).not.toContain("ask a specialist")
    })

    it("renders ask a specialist link when isAcquireable", () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: true,
        isForSale: true,
        isInquireable: true,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }

      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artwork={artwork}
            // @ts-ignore STRICTNESS_MIGRATION
            auctionState={null}
          />
        </Theme>
      )
      expect(component.text()).toContain("Read our FAQ")
      expect(component.text()).toContain("ask a specialist")
    })

    it("renders ask a specialist link when isOfferable", () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: true,
        isForSale: true,
        isInquireable: true,
        artists: [{ name: "Santa", isConsignable: true }],
      }

      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artwork={artwork}
            // @ts-ignore STRICTNESS_MIGRATION
            auctionState={null}
          />
        </Theme>
      )
      expect(component.text()).toContain("Read our FAQ")
      expect(component.text()).toContain("ask a specialist")
    })
  })

  describe("FAQ and specialist Auction links", () => {
    const artwork: ArtworkExtraLinks_artwork = {
      ...ArtworkFixture,
      isForSale: true,
      isInAuction: true,
      sale: {
        isClosed: false,
        isBenefit: false,
        partner: {
          name: "Christie's",
        },
      },
      artists: [
        {
          name: "Santa",
          isConsignable: true,
        },
      ],
    }

    const Component = mockTracking(() => (
      <Theme>
        <ArtworkExtraLinks artwork={artwork} auctionState={AuctionTimerState.CLOSING} />
      </Theme>
    ))
    const component = mount(<Component />)

    it("renders Auction specific text", () => {
      expect(
        component
          .find(Sans)
          .at(0)
          .text()
      ).toContain("By placing a bid you agree to Artsy's and Christie's Conditions of Sale.")
      expect(
        component
          .find(Sans)
          .at(1)
          .text()
      ).toContain("Read our auction FAQs")
      expect(
        component
          .find(Sans)
          .at(1)
          .text()
      ).toContain("ask a specialist")
    })

    it("hides auction links when auction work has sold via buy now", () => {
      const notForSaleArtwork = {
        ...ArtworkFixture,
        isInAuction: true,
        isForSale: false,
        sale: {
          isClosed: false,
          internalID: "123",
          isBenefit: false,
          partner: {
            name: "Christie's",
          },
        },
        artists: [
          {
            name: "Santa",
            isConsignable: false,
          },
        ],
      }

      const componentWithNoLink = mount(
        <Theme>
          <ArtworkExtraLinks
            artwork={notForSaleArtwork}
            // @ts-ignore STRICTNESS_MIGRATION
            auctionState={null}
          />
        </Theme>
      )
      expect(componentWithNoLink.find(Sans).length).toEqual(0)
    })

    it("hides auction links when auctionState is closed", () => {
      const componentWithEndedAuctionState = mount(
        <Theme>
          <ArtworkExtraLinks artwork={artwork} auctionState={AuctionTimerState.CLOSED} />
        </Theme>
      )
      expect(componentWithEndedAuctionState.text()).not.toContain("By placing a bid you agree to")
    })

    it("displays auction links when auctionState is closing", () => {
      const componentWithEndedAuctionState = mount(
        <Theme>
          <ArtworkExtraLinks artwork={artwork} auctionState={AuctionTimerState.CLOSING} />
        </Theme>
      )
      expect(componentWithEndedAuctionState.text()).toContain("By placing a bid you agree to")
    })

    it("displays auction links when auctionState is live_integration_upcoming", () => {
      const componentWithEndedAuctionState = mount(
        <Theme>
          <ArtworkExtraLinks artwork={artwork} auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
        </Theme>
      )
      expect(componentWithEndedAuctionState.text()).toContain("By placing a bid you agree to")
    })

    it("displays auction links when auctionState is inProgress", () => {
      const componentWithEndedAuctionState = mount(
        <Theme>
          <ArtworkExtraLinks artwork={artwork} auctionState={AuctionTimerState.CLOSING} />
        </Theme>
      )
      expect(componentWithEndedAuctionState.text()).toContain("By placing a bid you agree to")
    })

    it("posts proper event in when clicking Ask A Specialist", () => {
      component
        .find("Text")
        // @ts-ignore STRICTNESS_MIGRATION
        .findWhere(t => t.text() === "ask a specialist")
        .first()
        .props()
        .onPress()
      expect(postEvent).toBeCalledWith({
        action_name: "askASpecialist",
        action_type: "tap",
        context_module: "ArtworkExtraLinks",
      })
    })

    it("posts proper event in when clicking Read our auction FAQs", () => {
      component
        .find("Text")
        // @ts-ignore STRICTNESS_MIGRATION
        .findWhere(t => t.text() === "Read our auction FAQs")
        .first()
        .props()
        .onPress()
      expect(postEvent).toBeCalledWith({
        action_name: "auctionsFAQ",
        action_type: "tap",
        context_module: "ArtworkExtraLinks",
      })
    })

    it("posts proper event in when clicking Conditions of Sale", () => {
      component
        .find("Text")
        // @ts-ignore STRICTNESS_MIGRATION
        .findWhere(t => t.text() === "Conditions of Sale")
        .first()
        .props()
        .onPress()
      expect(postEvent).toBeCalledWith({
        action_name: "conditionsOfSale",
        action_type: "tap",
        context_module: "ArtworkExtraLinks",
      })
    })
  })
})
