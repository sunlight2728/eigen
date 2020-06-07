import React, { Component } from "react"
import { RefreshControl, ScrollView } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { ZeroState } from "lib/Components/States/ZeroState"
import { PAGE_SIZE } from "lib/data/constants"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"

import { Button } from "@artsy/palette"
import { Artworks_me } from "__generated__/Artworks_me.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"

interface Props {
  me: Artworks_me
  relay: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}

interface State {
  fetchingMoreData: boolean
  refreshingFromPull: boolean
}

export class SavedWorks extends Component<Props, State> {
  state = {
    fetchingMoreData: false,
    refreshingFromPull: false,
  }

  loadMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return
    }

    const updateState = (loading: boolean) => {
      this.setState({ fetchingMoreData: loading })
      if (this.props.onDataFetching) {
        this.props.onDataFetching(loading)
      }
    }

    updateState(true)
    this.props.relay.loadMore(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("SavedWorks/index.tsx", error.message)
      }
      updateState(false)
    })
  }

  handleRefresh = () => {
    this.setState({ refreshingFromPull: true })
    this.props.relay.refetchConnection(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("SavedWorks/index.tsx #handleRefresh", error.message)
      }
      this.setState({ refreshingFromPull: false })
    })
  }

  // @TODO: Implement test on this component https://artsyproduct.atlassian.net/browse/LD-563
  render() {
    // @ts-ignore STRICTNESS_MIGRATION
    const artworks = this.props.me.followsAndSaves.artworks.edges.map(edge => edge.node)

    if (artworks.length === 0) {
      return (
        <ZeroState
          title="You haven’t saved any works yet"
          subtitle="Tap the heart on an artwork to save for later."
          callToAction={
            <Button
              variant="secondaryOutline"
              size="large"
              onPress={() => {
                SwitchBoard.presentNavigationViewController(this, "/")
              }}
            >
              Browse works for you
            </Button>
          }
        />
      )
    }

    return (
      <ScrollView
        onScroll={isCloseToBottom(this.loadMore)}
        scrollEventThrottle={400}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={<RefreshControl refreshing={this.state.refreshingFromPull} onRefresh={this.handleRefresh} />}
      >
        <GenericGrid artworks={artworks as any} isLoading={this.state.fetchingMoreData} />
      </ScrollView>
    )
  }
}

export default createPaginationContainer(
  SavedWorks,
  {
    me: graphql`
      fragment Artworks_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String", defaultValue: "" }) {
        # TODO: This should move into followsAndSaves
        followsAndSaves {
          artworks: artworksConnection(private: true, first: $count, after: $cursor)
            @connection(key: "GenericGrid_artworks") {
            pageInfo {
              startCursor
              endCursor
              hasPreviousPage
              hasNextPage
            }
            edges {
              node {
                ...GenericGrid_artworks
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
      return props.me && props.me.followsAndSaves.artworks
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
      query ArtworksQuery($count: Int!, $cursor: String) {
        me {
          ...Artworks_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
