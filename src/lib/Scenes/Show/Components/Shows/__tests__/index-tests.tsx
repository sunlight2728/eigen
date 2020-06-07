import { Theme } from "@artsy/palette"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { NearbyShows as _nearbyShows } from "../../../__fixtures__/NearbyShowsFixture"
import { Shows } from "../index"

it("renders without throwing an error", () => {
  renderer.create(
    <Theme>
      <Shows show={data as any} />
    </Theme>
  )
})

const data = {
  city: "New York",
  nearbyShows: _nearbyShows,
}
