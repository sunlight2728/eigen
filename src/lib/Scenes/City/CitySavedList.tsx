import { Theme } from "@artsy/palette"
import { CitySavedList_city } from "__generated__/CitySavedList_city.graphql"
import { CitySavedList_me } from "__generated__/CitySavedList_me.graphql"
import { CitySavedListQuery } from "__generated__/CitySavedListQuery.graphql"
import { PAGE_SIZE } from "lib/data/constants"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { EventList } from "./Components/EventList"

interface Props {
  me: CitySavedList_me
  city: CitySavedList_city
  relay: RelayPaginationProp
  citySlug: string
}

interface State {
  fetchingNextPage: boolean
}

@screenTrack((props: Props) => ({
  context_screen: Schema.PageNames.CityGuideSavedList,
  context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
  context_screen_owner_slug: props.citySlug,
  context_screen_owner_id: props.citySlug,
}))
class CitySavedList extends React.Component<Props, State> {
  state = {
    fetchingNextPage: false,
  }

  fetchData = () => {
    const { relay } = this.props

    if (!relay.hasMore() || relay.isLoading()) {
      return
    }
    this.setState({ fetchingNextPage: true })
    relay.loadMore(PAGE_SIZE, error => {
      if (error) {
        console.error("CitySectionList.tsx #fetchData", error.message)
        // FIXME: Handle error
      }
      this.setState({ fetchingNextPage: false })
    })
  }

  // @TODO: Implement test for this component https://artsyproduct.atlassian.net/browse/LD-562
  render() {
    const { fetchingNextPage } = this.state
    return (
      <Theme>
        <EventList
          header="Saved shows"
          cityName={this.props.city.name!}
          bucket={this.props.me.followsAndSaves?.shows?.edges?.map(e => e?.node) as any}
          type="saved"
          relay={this.props.relay as any}
          onScroll={isCloseToBottom(this.fetchData) as any}
          fetchingNextPage={fetchingNextPage}
        />
      </Theme>
    )
  }
}

export const CitySavedListContainer = createPaginationContainer(
  CitySavedList,
  {
    city: graphql`
      fragment CitySavedList_city on City {
        name
      }
    `,
    me: graphql`
      fragment CitySavedList_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String", defaultValue: "" }) {
        followsAndSaves {
          shows: showsConnection(first: $count, status: RUNNING_AND_UPCOMING, city: $citySlug, after: $cursor)
            @connection(key: "CitySavedList_shows") {
            edges {
              node {
                slug
                internalID
                id
                name
                isStubShow
                status
                href
                is_followed: isFollowed
                isStubShow
                exhibition_period: exhibitionPeriod
                cover_image: coverImage {
                  url
                }
                location {
                  coordinates {
                    lat
                    lng
                  }
                }
                type
                start_at: startAt
                end_at: endAt
                partner {
                  ... on Partner {
                    name
                    type
                    profile {
                      image {
                        url(version: "square")
                      }
                    }
                  }
                }
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
      return props.me && props.me.followsAndSaves && props.me.followsAndSaves.shows
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        citySlug: props.citySlug,
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query CitySavedListPaginationQuery($count: Int!, $cursor: String, $citySlug: String!) {
        me {
          ...CitySavedList_me @arguments(count: $count, cursor: $cursor)
        }
        city(slug: $citySlug) {
          ...CitySavedList_city
        }
      }
    `,
  }
)

interface CitySavedListProps {
  citySlug: string
}
export const CitySavedListRenderer: React.SFC<CitySavedListProps> = ({ citySlug }) => {
  return (
    <QueryRenderer<CitySavedListQuery>
      environment={defaultEnvironment}
      query={graphql`
        query CitySavedListQuery($citySlug: String!) {
          me {
            ...CitySavedList_me
          }
          city(slug: $citySlug) {
            ...CitySavedList_city
          }
        }
      `}
      variables={{ citySlug }}
      render={renderWithLoadProgress(CitySavedListContainer)}
    />
  )
}
