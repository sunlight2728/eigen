import { Theme } from "@artsy/palette"
import { CityBMWList_city } from "__generated__/CityBMWList_city.graphql"
import { CityBMWListQuery, CityBMWListQueryVariables } from "__generated__/CityBMWListQuery.graphql"
import { PAGE_SIZE } from "lib/data/constants"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { EventList } from "./Components/EventList"

interface Props extends Pick<CityBMWListQueryVariables, "citySlug"> {
  city: CityBMWList_city
  relay: RelayPaginationProp
}

interface State {
  fetchingNextPage: boolean
}

// @ts-ignore STRICTNESS_MIGRATION
@screenTrack((props: Props) => ({
  context_screen: Schema.PageNames.CityGuideBMWList,
  context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
  context_screen_owner_slug: props.city.slug,
  context_screen_owner_id: props.city.slug,
}))
class CityBMWList extends React.Component<Props, State> {
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
    const {
      city: {
        name,
        // @ts-ignore STRICTNESS_MIGRATION
        sponsoredContent: { shows },
      },
      relay,
    } = this.props
    const { fetchingNextPage } = this.state
    return (
      <Theme>
        <EventList
          key={name + "bmw"}
          cityName={name! /* STRICTNESS_MIGRATION */}
          bucket={shows.edges.map((e: any /* STRICTNESS_MIGRATION */) => e.node) as any}
          header="BMW Art Guide"
          type="BMW Art Guide"
          relay={relay as any /* STRICTNESS_MIGRATION */}
          onScroll={isCloseToBottom(this.fetchData) as any /* STRICTNESS_MIGRATION */}
          fetchingNextPage={fetchingNextPage}
        />
      </Theme>
    )
  }
}

export const CityBMWListContainer = createPaginationContainer(
  CityBMWList,
  {
    city: graphql`
      fragment CityBMWList_city on City
        @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String", defaultValue: "" }) {
        name
        slug
        sponsoredContent {
          shows: showsConnection(first: $count, status: RUNNING, after: $cursor, sort: PARTNER_ASC)
            @connection(key: "CityBMWList_shows") {
            edges {
              node {
                slug
                internalID
                id
                name
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
      return props.city && props.city.sponsoredContent && props.city.sponsoredContent.shows
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
      query CityBMWListPaginationQuery($count: Int!, $cursor: String, $citySlug: String!) {
        city(slug: $citySlug) {
          ...CityBMWList_city @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

interface CityBMWListProps {
  citySlug: string
}
export const CityBMWListRenderer: React.SFC<CityBMWListProps> = ({ citySlug }) => {
  return (
    <QueryRenderer<CityBMWListQuery>
      environment={defaultEnvironment}
      query={graphql`
        query CityBMWListQuery($citySlug: String!) {
          city(slug: $citySlug) {
            ...CityBMWList_city
          }
        }
      `}
      variables={{ citySlug }}
      render={renderWithLoadProgress(CityBMWListContainer)}
    />
  )
}
