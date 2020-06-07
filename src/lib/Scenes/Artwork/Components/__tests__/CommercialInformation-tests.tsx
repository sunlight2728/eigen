import { Sans, Theme } from "@artsy/palette"
// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import { Countdown } from "lib/Components/Bidding/Components/Timer"
import "moment-timezone"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { ArtworkExtraLinks } from "../ArtworkExtraLinks"
import { BidButton } from "../CommercialButtons/BidButton"
import { BuyNowButton } from "../CommercialButtons/BuyNowButton"
import { CommercialButtons } from "../CommercialButtons/CommercialButtons"
import { CommercialEditionSetInformation } from "../CommercialEditionSetInformation"
import { CommercialInformationTimerWrapper } from "../CommercialInformation"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe("CommercialInformation", () => {
  it("renders all information when the data is present", () => {
    const component = mount(
      <Theme>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtwork as any}
          me={{ identityVerified: false } as any}
        />
      </Theme>
    )
    expect(component.text()).toContain("Contact for price")
    expect(component.text()).toContain("I'm a Gallery")
    expect(component.find(ArtworkExtraLinks).text()).toContain("Consign with Artsy.")
  })

  it("renders Bidding Closed and no CommercialButtons for auction works when the auction has ended", () => {
    const workInEndedAuction = {
      ...CommercialInformationArtwork,
      isInAuction: true,
      isInquireable: true,
      sale: {
        isAuction: true,
        isClosed: true,
      },
    }
    const component = mount(
      <Theme>
        <CommercialInformationTimerWrapper
          artwork={workInEndedAuction as any}
          me={{ identityVerified: false } as any}
        />
      </Theme>
    )

    expect(component.text()).toContain("Bidding closed")
    expect(component.find("CommercialButtons").length).toBe(0)
  })

  it("hides seller info for works from closed auctions", () => {
    const CommercialInformationArtworkClosedAuction = {
      ...CommercialInformationArtwork,
      sale: {
        isAuction: true,
        isClosed: true,
      },
    }
    const component = mount(
      <Theme>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtworkClosedAuction as any}
          me={{ identityVerified: false } as any}
        />
      </Theme>
    )
    expect(component.text()).toContain("Contact for price")
    expect(component.text()).toContain("I'm a Gallery")
    expect(component.text()).not.toContain("Shipping, tax, and service quoted by seller")
    expect(component.find(ArtworkExtraLinks).text()).toContain("Consign with Artsy.")
  })

  it("doesn't render information when the data is not present", () => {
    const CommercialInformationArtworkNoData = {
      ...ArtworkFixture,
      ...{
        availability: null,
        price: "",
        saleMessage: "",
        shippingInfo: "",
        isInAuction: false,
        shippingOrigin: null,
        isAcquireable: false,
        isOfferable: false,
        isBiddable: false,
        isInquireable: false,
        isForSale: false,
        editionSets: [],
        sale: {
          isAuction: false,
          isClosed: false,
          isLiveOpen: false,
          isPreview: false,
          liveStartAt: null,
          endAt: null,
          startAt: null,
        },
        partner: {
          name: null,
          " $refType": null,
        },
        artists: [
          {
            isConsignable: false,
            name: "",
            " $fragmentRefs": null,
          },
        ],
        " $fragmentRefs": null,
        " $refType": null,
      },
    }
    const component = mount(
      <Theme>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtworkNoData as any}
          me={{ identityVerified: false } as any}
        />
      </Theme>
    )
    expect(component.text()).not.toContain("Contact for price")
    expect(component.text()).not.toContain("I'm a Gallery")
    expect(component.text()).not.toContain("Consign with Artsy.")
  })

  it("renders seller info correctly for non-commercial works", () => {
    const CommercialInformationArtworkNonCommercial = {
      ...CommercialInformationArtwork,
      availability: null,
      isForSale: false,
    }
    const component = mount(
      <Theme>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtworkNonCommercial as any}
          me={{ identityVerified: false } as any}
        />
      </Theme>
    )
    expect(
      component
        .find(Sans)
        .at(1)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"At I'm a Gallery"`)
  })

  it("renders consign with Artsy text", () => {
    const component = mount(
      <Theme>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtwork as any}
          me={{ identityVerified: false } as any}
        />
      </Theme>
    )
    expect(
      component
        .find(Sans)
        .at(2)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Want to sell a work by Santa Claus? Consign with Artsy."`)
  })

  it("when edition set is selected its internalID is passed to CommercialButtons for mutation", () => {
    const artworkWithEditionSets = {
      ...CommercialInformationArtwork,
      isAcquireable: true,
      isOfferable: true,
      editionSets: [
        {
          id: "RWRpdGlvblNldDo1YmJiOTc3N2NlMmZjMzAwMmMxNzkwMTM=",
          internalID: "5bbb9777ce2fc3002c179013",
          isAcquireable: true,
          isOfferable: true,
          saleMessage: "$1",
          edition_of: "",
          dimensions: {
            in: "2 × 2 in",
            cm: "5.1 × 5.1 cm",
          },
        },
        {
          id: "RWRpdGlvblNldDo1YmMwZWMwMDdlNjQzMDBhMzliMjNkYTQ=",
          internalID: "5bc0ec007e64300a39b23da4",
          isAcquireable: true,
          isOfferable: true,
          saleMessage: "$2",
          edition_of: "",
          dimensions: {
            in: "1 × 1 in",
            cm: "2.5 × 2.5 cm",
          },
        },
      ],
    }

    const component = mount(
      <Theme>
        <CommercialInformationTimerWrapper
          artwork={artworkWithEditionSets as any}
          me={{ identityVerified: false } as any}
        />
      </Theme>
    )

    // Expect the component to default to first edition set's internalID
    expect(component.find(CommercialButtons).props().editionSetID).toEqual("5bbb9777ce2fc3002c179013")

    const secondEditionButton = component
      .find(CommercialEditionSetInformation)
      .find(TouchableWithoutFeedback)
      .at(1)
    secondEditionButton.props().onPress()
    component.update()

    expect(component.find(CommercialButtons).props().editionSetID).toEqual("5bc0ec007e64300a39b23da4")
  })
})

describe("CommercialInformation buttons and coundtown timer", () => {
  it("renders CountDownTimer and BidButton when Artwork is in an auction", () => {
    const component = mount(
      <Theme>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtworkInAuction as any}
          me={{ identityVerified: false } as any}
          tracking={{ trackEvent: jest.fn() } as any}
        />
      </Theme>
    )
    expect(component.find(Countdown).length).toEqual(1)
    expect(component.find(BidButton).length).toEqual(1)
  })

  it("doesn't render CountDownTimer, BidButton, or BuyNowButton when artwork is in an auction but sold via buy now", () => {
    const CommercialInformationSoldArtworkInAuction = {
      ...CommercialInformationArtworkInAuction,
      availability: "sold",
      isAcquireable: false,
      isForSale: false,
    }

    const component = mount(
      <Theme>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationSoldArtworkInAuction as any}
          me={{ identityVerified: false } as any}
          tracking={{ trackEvent: jest.fn() } as any}
        />
      </Theme>
    )
    expect(component.find(Countdown).length).toEqual(0)
    expect(component.find(BidButton).length).toEqual(0)
    expect(component.find(BuyNowButton).length).toEqual(0)
  })

  it("doesn't render CountDownTimer or BidButton when not in auction", () => {
    const component = mount(
      <Theme>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationAcquierableArtwork as any}
          me={{ identityVerified: false } as any}
        />
      </Theme>
    )
    expect(component.find(Countdown).length).toEqual(0)
    expect(component.find(BidButton).length).toEqual(0)
    expect(component.find(BuyNowButton).length).toEqual(1)
  })
})

describe("ArtworkExtraLinks", () => {
  it("does not show the extra links if the work is inquireable", () => {
    const inquireableArtwork = {
      ...CommercialInformationArtwork,
      artists: [{ isConsignable: false, name: "Santa Claus", " $fragmentRefs": null }],
      isInquireable: true,
      isAcquireable: false,
      isOfferable: false,
      isInAuction: false,
      isForSale: false,
      sale: {
        isClosed: false,
        isLiveOpen: false,
        isPreview: false,
        liveStartAt: null,
        endAt: null,
        startAt: null,
        isAuction: false,
      },
    }

    const component = mount(
      <Theme>
        <CommercialInformationTimerWrapper
          artwork={inquireableArtwork as any}
          me={{ identityVerified: false } as any}
        />
      </Theme>
    )
    expect(component.find(ArtworkExtraLinks).length).toEqual(0)
  })

  it("shows the extra links if the work is acquireable", () => {
    const acquireableArtwork = {
      ...CommercialInformationArtwork,
      artists: [{ isConsignable: false, name: "Santa Claus", " $fragmentRefs": null }],
      isInquireable: false,
      isAcquireable: true,
      isOfferable: false,
      isInAuction: false,
      isForSale: true,
      sale: null,
    }

    const component = mount(
      <Theme>
        <CommercialInformationTimerWrapper
          artwork={acquireableArtwork as any}
          me={{ identityVerified: false } as any}
        />
      </Theme>
    )
    expect(component.find(ArtworkExtraLinks).length).toEqual(1)
  })

  it("shows the extra links if the work is offerable", () => {
    const offerableArtwork = {
      ...CommercialInformationArtwork,
      artists: [{ isConsignable: false, name: "Santa Claus", " $fragmentRefs": null }],
      isInquireable: false,
      isAcquireable: false,
      isOfferable: true,
      isInAuction: false,
      isForSale: true,
      sale: null,
    }

    const component = mount(
      <Theme>
        <CommercialInformationTimerWrapper artwork={offerableArtwork as any} me={{ identityVerified: false } as any} />
      </Theme>
    )
    expect(component.find(ArtworkExtraLinks).length).toEqual(1)
  })

  it("shows the extra links if the work is biddable", () => {
    const nonConsignableBiddableArtwork = {
      ...CommercialInformationArtworkInAuction,
      artists: [{ isConsignable: false, name: "Santa Claus", " $fragmentRefs": null }],
    }

    const component = mount(
      <Theme>
        <CommercialInformationTimerWrapper
          artwork={nonConsignableBiddableArtwork as any}
          me={{ identityVerified: false } as any}
          tracking={{ trackEvent: jest.fn() } as any}
        />
      </Theme>
    )
    expect(component.find(ArtworkExtraLinks).length).toEqual(1)
  })
})

const CommercialInformationArtwork = {
  ...ArtworkFixture,
  isAcquireable: false,
  isInAuction: false,
  isOfferable: false,
  isBiddable: false,
  isInquireable: false,
  isForSale: true,
  editionSets: [],
  saleMessage: "Contact For Price",
  shippingInfo: "Shipping, tax, and service quoted by seller",
  shippingOrigin: null,
  availability: "sold",
  sale: {
    isClosed: false,
    isAuction: false,
    isLiveOpen: false,
    isPreview: false,
    liveStartAt: null,
    endAt: null,
    startAt: null,
  },
  partner: {
    name: "I'm a Gallery",
    " $refType": null,
  },
  artists: [
    {
      isConsignable: true,
      name: "Santa Claus",
      " $fragmentRefs": null,
    },
  ],
  " $fragmentRefs": null,
  " $refType": null,
}

const CommercialInformationArtworkInAuction = {
  ...CommercialInformationArtwork,
  availability: "for sale",
  isAcquireable: false,
  isInAuction: true,
  sale: {
    internalId: "internal-id",
    slug: "my-sale",
    isClosed: false,
    isAuction: true,
    isLiveOpen: false,
    isPreview: false,
    startAt: "2019-08-15T19:22:00+00:00",
    endAt: "2019-08-16T20:20:00+00:00",
    liveStartAt: null,
    formattedStartDateTime: "Ends Aug 16 at 8:20pm UTC",
  },
  saleArtwork: {
    increments: [
      {
        cents: 11000000,
        display: "CHF110,000",
      },
      {
        cents: 12000000,
        display: "CHF120,000",
      },
    ],
  },
}

const CommercialInformationAcquierableArtwork = {
  ...CommercialInformationArtwork,
  isAcquireable: true,
}
