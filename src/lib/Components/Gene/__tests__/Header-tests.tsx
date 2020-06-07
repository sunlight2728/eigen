import { NativeModules } from "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import Header from "../Header"

import { Theme } from "@artsy/palette"

beforeAll(() => {
  NativeModules.ARTemporaryAPIModule = { followStatusForGene: jest.fn() }
})

it("renders without throwing a error", () => {
  const gene = {
    id: "gene-deep-time",
    internalID: "gravity-id",
    gravityID: "deep-time",
    name: "Deep Time",
  }

  renderer.create(
    <Theme>
      <Header gene={gene as any} shortForm={false} />
    </Theme>
  )
})
