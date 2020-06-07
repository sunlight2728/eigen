import { Box, Theme } from "@artsy/palette"
import { LotsByFollowedArtists_me } from "__generated__/LotsByFollowedArtists_me.graphql"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { SectionTitle } from "lib/Components/SectionTitle"
import React, { Component } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

const DEFAULT_TITLE = "Lots by Artists You Follow"

interface Props {
  relay: RelayPaginationProp
  title?: string
  me: LotsByFollowedArtists_me
}

export class LotsByFollowedArtists extends Component<Props> {
  render() {
    // @ts-ignore STRICTNESS_MIGRATION
    if (this.props.me.lotsByFollowedArtistsConnection.edges.length === 0) {
      return null
    }

    const { title = DEFAULT_TITLE } = this.props

    return (
      <Theme>
        <Box px={2}>
          <InfiniteScrollArtworksGrid
            loadMore={this.props.relay.loadMore}
            hasMore={this.props.relay.hasMore}
            isLoading={this.props.relay.isLoading}
            // @ts-ignore STRICTNESS_MIGRATION
            connection={this.props.me.lotsByFollowedArtistsConnection}
            HeaderComponent={<SectionTitle title={title} />}
          />
        </Box>
      </Theme>
    )
  }
}

export default createPaginationContainer(
  LotsByFollowedArtists,
  {
    me: graphql`
      fragment LotsByFollowedArtists_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        lotsByFollowedArtistsConnection(first: $count, after: $cursor, liveSale: true, isAuction: true)
          @connection(key: "LotsByFollowedArtists_lotsByFollowedArtistsConnection") {
          edges {
            cursor
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps: ({ me }) => me && me.lotsByFollowedArtistsConnection,
    getFragmentVariables: (prevVars, totalCount) => ({ ...prevVars, count: totalCount }),
    getVariables: (_props, { count, cursor }) => ({ count, cursor }),
    query: graphql`
      query LotsByFollowedArtistsQuery($count: Int!, $cursor: String) {
        me {
          ...LotsByFollowedArtists_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
