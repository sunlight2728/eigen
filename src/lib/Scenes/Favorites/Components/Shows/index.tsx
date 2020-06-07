import { ShowItemRowContainer as ShowItemRow } from "lib/Components/Lists/ShowItemRow"
import Spinner from "lib/Components/Spinner"
import { ZeroState } from "lib/Components/States/ZeroState"
import { PAGE_SIZE } from "lib/data/constants"
import React, { Component } from "react"
import { FlatList, RefreshControl } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import { Box, Separator, Theme } from "@artsy/palette"
import { Shows_me } from "__generated__/Shows_me.graphql"

interface Props {
  me: Shows_me
  relay: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}

interface State {
  fetchingMoreData: boolean
  refreshingFromPull: boolean
}

export class Shows extends Component<Props, State> {
  state = {
    fetchingMoreData: false,
    refreshingFromPull: false,
  }

  loadMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return
    }

    this.setState({ fetchingMoreData: true })
    this.props.relay.loadMore(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("Shows/index.tsx", error.message)
      }
      this.setState({ fetchingMoreData: false })
    })
  }

  handleRefresh = () => {
    this.setState({ refreshingFromPull: true })
    this.props.relay.refetchConnection(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("Shows/index.tsx #handleRefresh", error.message)
      }
      this.setState({ refreshingFromPull: false })
    })
  }

  // @TODO: Implement test on this component https://artsyproduct.atlassian.net/browse/LD-563
  render() {
    // @ts-ignore STRICTNESS_MIGRATION
    const shows = this.props.me.followsAndSaves.shows.edges.map(edge => edge.node)

    if (shows.length === 0 || !shows) {
      return (
        <ZeroState
          title="You haven’t saved any shows yet"
          subtitle="When you save shows, they will show up here for future use."
        />
      )
    }

    return (
      <Theme>
        <FlatList
          data={shows}
          // @ts-ignore STRICTNESS_MIGRATION
          keyExtractor={item => item.id}
          renderItem={item => (
            <Box m={2}>
              <ShowItemRow
                // @ts-ignore STRICTNESS_MIGRATION
                show={item.item}
              />
            </Box>
          )}
          onEndReached={this.loadMore}
          onEndReachedThreshold={0.2}
          ItemSeparatorComponent={() => <Separator />}
          refreshControl={<RefreshControl refreshing={this.state.refreshingFromPull} onRefresh={this.handleRefresh} />}
          ListFooterComponent={
            this.state.fetchingMoreData ? <Spinner style={{ marginTop: 20, marginBottom: 20 }} /> : null
          }
        />
      </Theme>
    )
  }
}

export default createPaginationContainer(
  Shows,
  {
    me: graphql`
      fragment Shows_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        followsAndSaves {
          shows: showsConnection(first: $count, after: $cursor) @connection(key: "SavedShows_shows") {
            pageInfo {
              startCursor
              endCursor
              hasPreviousPage
              hasNextPage
            }
            edges {
              node {
                id
                ...ShowItemRow_show
              }
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      // @ts-ignore STRICTNESS_MIGRATION
      return props.me && props.me.followsAndSaves.shows
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query ShowsQuery($count: Int!, $cursor: String) {
        me {
          ...Shows_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
