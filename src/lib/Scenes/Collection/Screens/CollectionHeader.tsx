import { Box, Sans } from "@artsy/palette"
import { CollectionHeader_collection } from "__generated__/CollectionHeader_collection.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ReadMore } from "lib/Components/ReadMore"
import { Schema } from "lib/utils/track"
import React from "react"
import { Dimensions } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface CollectionHeaderProps {
  collection: CollectionHeader_collection
}

const HEADER_IMAGE_HEIGHT = 204

export const CollectionHeader: React.SFC<CollectionHeaderProps> = props => {
  const { title, image, headerImage, descriptionMarkdown: collectionDescription } = props.collection
  // @ts-ignore STRICTNESS_MIGRATION
  const defaultHeaderUrl = image?.edges[0]?.node?.image?.url || ""
  const url = headerImage ? headerImage : defaultHeaderUrl
  const { width: screenWidth } = Dimensions.get("window")
  const collectionTitleMargin = (collectionDescription || "").length < 1 ? 2 : 1

  return (
    <>
      <Box mb={2}>
        <OpaqueImageView imageURL={url} height={HEADER_IMAGE_HEIGHT} width={screenWidth} />
      </Box>
      <Sans size="8" mx={2} mb={collectionTitleMargin}>
        {title}
      </Sans>
      {!!collectionDescription && (
        <Box mx="2" mb="2" mt="0.3">
          <ReadMore
            content={collectionDescription}
            maxChars={screenWidth > 700 ? 300 : 250} // truncate at 300 characters on iPads and 250 on all other devices
            contextModule={Schema.ContextModules.CollectionDescription}
            trackingFlow={Schema.Flow.AboutTheCollection}
            sans
          />
        </Box>
      )}
    </>
  )
}

export const CollectionHeaderContainer = createFragmentContainer(CollectionHeader, {
  collection: graphql`
    fragment CollectionHeader_collection on MarketingCollection {
      title
      headerImage
      descriptionMarkdown
      image: artworksConnection(sort: "-decayed_merch", first: 1) {
        edges {
          node {
            image {
              url(version: "larger")
            }
          }
        }
      }
    }
  `,
})
