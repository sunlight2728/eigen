import { Flex, Sans, Separator, Theme } from "@artsy/palette"
import React from "react"
import { View } from "react-native"

export class ZeroState extends React.Component {
  render() {
    return (
      <Theme>
        <View style={{ flex: 1 }}>
          <Sans size="4" textAlign="center" mb={1} mt={2}>
            Auctions
          </Sans>
          <Separator />
          <Flex justifyContent="center" flexGrow={1}>
            <Sans size="3t" weight="medium" textAlign="center">
              There’s no upcoming auctions scheduled
            </Sans>
            <Sans size="3t" textAlign="center" color="black60">
              Check back soon for new auctions on Artsy.
            </Sans>
          </Flex>
        </View>
      </Theme>
    )
  }
}
