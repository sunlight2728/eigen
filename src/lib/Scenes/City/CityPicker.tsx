import { Box, color, Flex, Sans, Separator, Serif, space } from "@artsy/palette"
import { dimensions, screen } from "lib/data/ScreenSizes/screenSizes"
import { CircleWhiteCheckIcon } from "lib/Icons/CircleWhiteCheckIcon"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, screenTrack, track } from "lib/utils/track"
import React, { Component } from "react"
import { Dimensions, NativeModules, TouchableOpacity } from "react-native"
import styled from "styled-components/native"
import cities from "../../../../data/cityDataSortedByDisplayPreference.json"
import { BMWSponsorship } from "../City/CityBMWSponsorship"

interface Props {
  selectedCity: string
  sponsoredContentUrl?: string
}

interface State {
  selectedCity: string | null
}

const cityList = cities.map(city => city.name)

@screenTrack(() => ({
  context_screen: Schema.PageNames.CityPicker,
  context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
}))
export class CityPicker extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      selectedCity: props.selectedCity,
    }
  }

  clearSelectedCityState() {
    this.setState({ selectedCity: null })
  }

  selectCity(city: string, index: number) {
    this.setState({ selectedCity: city }, this.clearSelectedCityState)
    NativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryUserSelectedCity", { cityIndex: index })
  }

  handleLogo(screenHeight: number) {
    return (
      <Sans size={dimensions(screenHeight)[screen(screenHeight)].logoFontSize} weight="medium" ml={2} mt={2}>
        Presented in Partnership with BMW
      </Sans>
    )
  }

  handleCityList(screenHeight: number, city: string) {
    return (
      <Serif
        mt={2}
        size={dimensions(screenHeight)[screen(screenHeight)].cityFontSize}
        lineHeight={dimensions(screenHeight)[screen(screenHeight)].lineHeight}
      >
        {city}
      </Serif>
    )
  }

  @track(() => {
    return {
      action_name: Schema.ActionNames.BMWLogo,
      action_type: Schema.ActionTypes.Tap,
    } as any
  })
  navigateToBMWArtGuide() {
    const { sponsoredContentUrl } = this.props

    /** Here we default to the hardcoded url as on the City Picker's inital load City is undefined
     *  and therefore does not have a sponsoredContentUrl property on City
     */
    SwitchBoard.presentNavigationViewController(
      this,
      sponsoredContentUrl || "https://www.bmw-arts-design.com/bmw_art_guide"
    )
  }

  // @TODO: Implement test for this component https://artsyproduct.atlassian.net/browse/LD-562
  render() {
    const { selectedCity } = this.state
    const { height: screenHeight } = Dimensions.get("window")
    const { sponsoredContentUrl } = this.props

    return (
      <Overlay>
        <Box ml={2}>
          <Sans size="3" weight="medium">
            Shows and fairs by city
          </Sans>
        </Box>
        {cityList.map((city, i) => (
          <Box key={i} mx={2}>
            <TouchableOpacity onPress={() => this.selectCity(city, i)}>
              <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                {this.handleCityList(screenHeight, city)}
                {selectedCity === city && (
                  <Box mb={2}>
                    <CircleWhiteCheckIcon width={26} height={26} />
                  </Box>
                )}
              </Flex>
            </TouchableOpacity>
            <Separator />
          </Box>
        ))}
        <LogoContainer>
          <BMWSponsorship url={sponsoredContentUrl} logoText="Presented in Partnership with BMW" />
        </LogoContainer>
      </Overlay>
    )
  }
}

const Overlay = styled.View`
  flex: 1;
  background-color: ${color("white100")};
  margin-top: ${space(2)};
  margin-left: ${space(2)};
  margin-right: ${space(2)};
  margin-bottom: ${space(1)};
  flex-direction: column;
`
const LogoContainer = styled(Flex)`
  width: 100%;
  align-items: center;
  justify-content: center;
  flex: 1;
`
