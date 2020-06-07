import { Box, CheckIcon, color, Flex, Sans, space } from "@artsy/palette"
import { ArtworkFilterHeader } from "lib/Components/ArtworkFilterOptions/FilterHeader"
import { MediumOption, PriceRangeOption, SortOption } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"
import { OptionListItem } from "../FilterModal"

type SingleSelectOptions = MediumOption | SortOption | PriceRangeOption

interface SingleSelectOptionScreenProps {
  navigator: NavigatorIOS
  filterText: "Sort" | "Medium" | "Price Range"
  onSelect: (any: any) => void
  selectedOption: SingleSelectOptions
  filterOptions: SingleSelectOptions[]
}

export const SingleSelectOptionScreen: React.SFC<SingleSelectOptionScreenProps> = ({
  filterText,
  selectedOption,
  onSelect,
  filterOptions,
  navigator,
}) => {
  const handleBackNavigation = () => {
    navigator.pop()
  }

  return (
    <Flex flexGrow={1}>
      <ArtworkFilterHeader filterName={filterText} handleBackNavigation={handleBackNavigation} />
      <Flex mb="125px">
        <FlatList<SingleSelectOptions>
          initialNumToRender={12}
          keyExtractor={(_item, index) => String(index)}
          data={filterOptions}
          renderItem={({ item }) => (
            <Box>
              {
                <SingleSelectOptionListItemRow onPress={() => onSelect(item)}>
                  <OptionListItem>
                    <InnerOptionListItem>
                      <Option color="black100" size="3t">
                        {item}
                      </Option>
                      {item === selectedOption && (
                        <Box mb={0.1}>
                          <CheckIcon fill="black100" />
                        </Box>
                      )}
                    </InnerOptionListItem>
                  </OptionListItem>
                </SingleSelectOptionListItemRow>
              }
            </Box>
          )}
        />
      </Flex>
    </Flex>
  )
}

export const FilterHeader = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  padding-right: ${space(2)}px;
  border: solid 0.5px ${color("black10")};
  border-right-width: 0;
  border-left-width: 0;
  border-top-width: 0;
`
export const NavigateBackIconContainer = styled(TouchableOpacity)`
  margin: 20px 0px 0px 20px;
`

export const InnerOptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  align-items: flex-end;
  padding: ${space(2)}px;
`

export const SingleSelectOptionListItemRow = styled(TouchableOpacity)``
export const Option = styled(Sans)``
