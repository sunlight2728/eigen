import { Flex, Serif } from "@artsy/palette"
import { Shows_show } from "__generated__/Shows_show.graphql"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ShowItemContainer as ShowItem } from "./Components/ShowItem"

interface Props {
  show: Shows_show
}

export const Shows: React.SFC<Props> = ({ show }) => {
  // @ts-ignore STRICTNESS_MIGRATION
  const { edges } = show.nearbyShows
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
        <Serif size="5">More shows nearby</Serif>
      </Flex>
      <FlatList
        horizontal
        data={edges}
        showsHorizontalScrollIndicator={false}
        // @ts-ignore STRICTNESS_MIGRATION
        keyExtractor={item => item.node.id}
        renderItem={({ item }) => {
          // @ts-ignore STRICTNESS_MIGRATION
          return <ShowItem show={item.node as any} />
        }}
      />
    </>
  )
}

export const ShowsContainer = createFragmentContainer(Shows, {
  show: graphql`
    fragment Shows_show on Show {
      nearbyShows: nearbyShowsConnection(first: 20) {
        edges {
          node {
            id
            name
            ...ShowItem_show
          }
        }
      }
    }
  `,
})
