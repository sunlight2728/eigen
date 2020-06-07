import { Button } from "@artsy/palette"
import { RequestConditionReport_artwork } from "__generated__/RequestConditionReport_artwork.graphql"
import { RequestConditionReport_me } from "__generated__/RequestConditionReport_me.graphql"
// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import { Modal } from "lib/Components/Modal"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import React from "react"
import { RequestConditionReport } from "../RequestConditionReport"

const artwork: RequestConditionReport_artwork = {
  // @ts-ignore STRICTNESS_MIGRATION
  " $refType": null,
  internalID: "some-internal-id",
  slug: "pablo-picasso-guernica",
  saleArtwork: {
    internalID: "some-sale-internal-id",
  },
}
const me: RequestConditionReport_me = {
  // @ts-ignore STRICTNESS_MIGRATION
  " $refType": null,
  email: "someemail@testerino.net",
  internalID: "some-id",
}

describe("RequestConditionReport", () => {
  it("renders correctly", () => {
    // @ts-ignore STRICTNESS_MIGRATION
    const component = mount(<RequestConditionReport artwork={artwork} me={me} relay={null} />)
    const requestReportButton = component.find(Button).at(0)
    expect(requestReportButton.length).toEqual(1)

    expect(requestReportButton.render().text()).toContain("Request condition report")

    const modals = component.find(Modal)
    expect(modals.length).toEqual(2)

    const errorModal = modals.at(0)
    const successModal = modals.at(1)

    expect(errorModal.props().visible).toEqual(false)
    expect(successModal.props().visible).toEqual(false)
  })

  it("shows an error modal on failure", async () => {
    // @ts-ignore STRICTNESS_MIGRATION
    const component = mount(<RequestConditionReport artwork={artwork} me={me} relay={null} />)
    component.instance().requestConditionReport = jest
      .fn()
      .mockReturnValue(Promise.reject(new Error("Condition report request failed")))
    component.update()
    const requestReportButton = component.find(Button).at(0)
    requestReportButton.props().onPress()
    expect(component.instance().requestConditionReport).toHaveBeenCalled()

    await flushPromiseQueue()

    component.update()
    const errorModal = component.find(Modal).at(0)
    const successModal = component.find(Modal).at(1)
    expect(errorModal.props().visible).toEqual(true)
    expect(successModal.props().visible).toEqual(false)
  })

  it("shows a success modal on success", async () => {
    // @ts-ignore STRICTNESS_MIGRATION
    const component = mount(<RequestConditionReport artwork={artwork} me={me} relay={null} />)
    component.instance().requestConditionReport = jest
      .fn()
      .mockReturnValue(Promise.resolve({ requestConditionReport: true }))
    component.update()
    const requestReportButton = component.find(Button).at(0)
    requestReportButton.props().onPress()
    expect(component.instance().requestConditionReport).toHaveBeenCalled()

    await flushPromiseQueue()

    component.update()
    const errorModal = component.find(Modal).at(0)
    const successModal = component.find(Modal).at(1)
    expect(errorModal.props().visible).toEqual(false)
    expect(successModal.props().visible).toEqual(true)
  })
})
