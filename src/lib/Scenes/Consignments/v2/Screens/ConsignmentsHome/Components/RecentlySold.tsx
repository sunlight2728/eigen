import { ContextModule, OwnerType, tappedEntityGroup, TappedEntityGroupArgs } from "@artsy/cohesion"
import { Box, Flex, Join, Sans, Spacer } from "@artsy/palette"
import { RecentlySold_targetSupply } from "__generated__/RecentlySold_targetSupply.graphql"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { shuffle } from "lodash"
import React, { useRef } from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface RecentlySoldProps {
  isLoading?: boolean
  targetSupply: RecentlySold_targetSupply
}

const trackingArgs: TappedEntityGroupArgs = {
  contextModule: ContextModule.artworkRecentlySoldGrid,
  contextScreenOwnerType: OwnerType.sell,
  destinationScreenOwnerType: OwnerType.artwork,
  type: "thumbnail",
}

export const RecentlySold: React.FC<RecentlySoldProps> = ({ targetSupply, isLoading }) => {
  if (isLoading) {
    return <RecentlySoldPlaceholder />
  }

  const navRef = useRef<any>()
  const tracking = useTracking()

  const microfunnelItems = targetSupply.microfunnel || []
  if (microfunnelItems.length === 0) {
    return null
  }

  const recentlySoldArtworks = shuffle(microfunnelItems.map(x => x?.artworksConnection?.edges?.[0]?.node))

  return (
    <Box ref={navRef}>
      <Box>
        <Sans size="4" px={2} mb={2}>
          Recently sold on Artsy
        </Sans>

        <Flex flexDirection="row">
          <Join separator={<Spacer mr={0.5} />}>
            <FlatList
              horizontal
              ListHeaderComponent={() => <Spacer mr={2}></Spacer>}
              ListFooterComponent={() => <Spacer mr={2}></Spacer>}
              ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
              showsHorizontalScrollIndicator={false}
              initialNumToRender={5}
              windowSize={3}
              data={recentlySoldArtworks}
              renderItem={({ item }) => {
                const saleMessage = item?.realizedPrice ? `Sold for ${item?.realizedPrice}` : undefined

                return (
                  <ArtworkTileRailCard
                    imageURL={item?.image?.imageURL}
                    artistNames={item?.artistNames}
                    saleMessage={saleMessage}
                    key={item?.internalID}
                    data-test-id="recently-sold-item"
                    onPress={() => {
                      tracking.trackEvent(
                        tappedEntityGroup({
                          ...trackingArgs,
                          destinationScreenOwnerId: item!.internalID,
                          destinationScreenOwnerSlug: item!.slug,
                        })
                      )
                      SwitchBoard.presentNavigationViewController(navRef.current!, item?.href!)
                    }}
                  />
                )
              }}
              keyExtractor={item => item!.internalID}
            />
          </Join>
        </Flex>
      </Box>
    </Box>
  )
}

export const RecentlySoldFragmentContainer = createFragmentContainer(RecentlySold, {
  targetSupply: graphql`
    fragment RecentlySold_targetSupply on TargetSupply {
      microfunnel {
        artworksConnection(first: 1) {
          edges {
            node {
              slug
              internalID
              href
              artistNames
              image {
                imageURL
              }
              realizedPrice
            }
          }
        }
      }
    }
  `,
})

const RecentlySoldPlaceholder: React.FC = () => {
  return (
    <Box>
      <Box px={2} py={0.5}>
        <PlaceholderText width={200} />
      </Box>

      <Spacer mb={2} />

      <Flex flexDirection="row" pl={2}>
        <Join separator={<Spacer mr={0.5} />}>
          {[...new Array(4)].map((_, index) => {
            return (
              <Box key={index}>
                <PlaceholderBox width={120} height={120} marginRight={10} />
                <Spacer mb={1} />
                <PlaceholderText width={60} />
                <PlaceholderText width={40} />
              </Box>
            )
          })}
        </Join>
      </Flex>
    </Box>
  )
}
