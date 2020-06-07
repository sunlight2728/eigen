import { Box, color, Flex, Sans } from "@artsy/palette"
import ChevronIcon from "lib/Icons/ChevronIcon"
import PinSavedOff from "lib/Icons/PinSavedOff"
import PinSavedOn from "lib/Icons/PinSavedOn"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Track, track as _track } from "lib/utils/track"
import React, { Component } from "react"
import { TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"
import { BMWSponsorship } from "../../CityBMWSponsorship"

export interface Props {
  data: any
  citySlug: string
  sponsoredContentUrl: string
}

const track: Track<Props, {}> = _track as any

@track()
export class SavedEventSection extends Component<any> {
  handleTap = () => {
    SwitchBoard.presentNavigationViewController(this, `/city-save/${this.props.citySlug}`)
  }

  // @TODO: Implement test for this component https://artsyproduct.atlassian.net/browse/LD-562
  render() {
    const { data, sponsoredContentUrl } = this.props
    const hasSaves = data.length > 0
    const hasSavesComponent = (
      <TouchableWithoutFeedback onPress={this.handleTap}>
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Flex flexDirection="row" alignItems="center">
            <PinSavedOn pinWidth={30} pinHeight={30} />
            <Sans size="3t" weight="medium" ml={24}>
              {data.length > 1 ? data.length + " saved events" : data.length + " saved event"}
            </Sans>
          </Flex>
          <ChevronIcon color="black" />
        </Flex>
      </TouchableWithoutFeedback>
    )

    const hasNoSavesComponent = (
      <>
        <Flex flexDirection="row" alignItems="center">
          <PinSavedOff width={30} height={30} />
          <Flex ml={24}>
            <Sans size="3t" color="black60" weight="medium">
              No saved events
            </Sans>
            <Sans size="3t" color="black60">
              Save a show to find it later
            </Sans>
          </Flex>
        </Flex>
      </>
    )

    return (
      <>
        <Box mx={2} py={2}>
          <BMWSponsorship url={sponsoredContentUrl} logoText="Presented in Partnership with BMW" />
        </Box>
        <Box mx={2} mb={2}>
          <SavedBox p={1}>{hasSaves ? hasSavesComponent : hasNoSavesComponent}</SavedBox>
        </Box>
      </>
    )
  }
}

const SavedBox = styled(Box)`
  border-radius: 2px;
  border-width: 1px;
  border-color: ${color("black30")};
`
