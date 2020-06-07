import { Box, Flex, Sans, Spacer } from "@artsy/palette"
import { PartnerOverview_partner } from "__generated__/PartnerOverview_partner.graphql"
import { ArtistListItemContainer as ArtistListItem } from "lib/Components/ArtistListItem"
import { ReadMore } from "lib/Components/ReadMore"
import Spinner from "lib/Components/Spinner"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { TabEmptyState } from "lib/Components/TabEmptyState"
import { get } from "lib/utils/get"
import React, { useState } from "react"
import { Text } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { PartnerLocationSectionContainer as PartnerLocationSection } from "./PartnerLocationSection"

const PAGE_SIZE = 10

export const PartnerOverview: React.FC<{
  partner: PartnerOverview_partner
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [fetchingNextPage, setFetchingNextPage] = useState(false)
  const artists = partner.artists && partner.artists.edges

  const renderArtists = () => {
    // @ts-ignore STRICTNESS_MIGRATION
    return artists.map(artist => {
      // @ts-ignore STRICTNESS_MIGRATION
      const node = artist.node
      if (!node) {
        return null
      }
      return (
        <Box key={node.id}>
          <ArtistListItem artist={node} />
          <Spacer mb={2} />
        </Box>
      )
    })
  }

  // @ts-ignore STRICTNESS_MIGRATION
  const aboutText = get(partner, p => p.profile.bio)

  if (!aboutText && !artists && !partner.cities) {
    return (
      <StickyTabPageScrollView>
        <TabEmptyState text="There is no information for this gallery yet" />
      </StickyTabPageScrollView>
    )
  }

  return (
    // TODO: Switch to StickyTabPageFlatList
    <StickyTabPageScrollView
      onEndReached={() => {
        // @ts-ignore STRICTNESS_MIGRATION
        if (fetchingNextPage || !partner.artists.pageInfo.endCursor || !relay.hasMore()) {
          return
        }
        setFetchingNextPage(true)
        relay.loadMore(PAGE_SIZE, error => {
          if (error) {
            // FIXME: Handle error
            console.error("PartnerOverview.tsx", error.message)
          }
          setFetchingNextPage(false)
        })
      }}
    >
      <Spacer mb={2} />
      {!!aboutText && (
        <>
          <ReadMore content={aboutText} maxChars={300} />
          <Spacer mb={2} />
        </>
      )}
      <PartnerLocationSection partner={partner} />
      {!!artists && artists.length > 0 && (
        <>
          <Text>
            <Sans size="3t" weight="medium">
              Artists
            </Sans>
            {!!(partner.counts && partner.counts.artists) && (
              <Sans size="3t" weight="medium">
                {` (${partner.counts.artists})`}
              </Sans>
            )}
          </Text>
          <Spacer mb={2} />
          {renderArtists()}
          {!!fetchingNextPage && (
            <Box p={2}>
              <Flex style={{ flex: 1 }} flexDirection="row" justifyContent="center">
                <Spinner />
              </Flex>
            </Box>
          )}
          <Spacer mb={3} />
        </>
      )}
    </StickyTabPageScrollView>
  )
}

export const PartnerOverviewFragmentContainer = createPaginationContainer(
  PartnerOverview,
  {
    partner: graphql`
      fragment PartnerOverview_partner on Partner
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        internalID
        name
        cities
        profile {
          bio
        }
        counts {
          artists
        }
        artists: artistsConnection(sort: SORTABLE_ID_ASC, first: $count, after: $cursor)
          @connection(key: "Partner_artists") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              ...ArtistListItem_artist
            }
          }
        }

        ...PartnerLocationSection_partner
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.partner && props.partner.artists
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }) {
      return {
        id: props.partner.internalID,
        count,
        cursor,
      }
    },
    query: graphql`
      query PartnerOverviewInfiniteScrollQuery($id: String!, $cursor: String, $count: Int!) {
        partner(id: $id) {
          ...PartnerOverview_partner @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
