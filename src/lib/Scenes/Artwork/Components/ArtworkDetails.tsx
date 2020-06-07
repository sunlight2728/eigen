import { Box, Join, Sans, Spacer } from "@artsy/palette"
import { ArtworkDetails_artwork } from "__generated__/ArtworkDetails_artwork.graphql"
import { ReadMore } from "lib/Components/ReadMore"
import { truncatedTextLimit } from "lib/utils/hardware"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { NativeModules } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { RequestConditionReportQueryRenderer } from "./RequestConditionReport"

interface ArtworkDetailsProps {
  artwork: ArtworkDetails_artwork
}

@track()
export class ArtworkDetails extends React.Component<ArtworkDetailsProps> {
  @track(() => ({
    action_name: Schema.ActionNames.ShowMoreArtworksDetails,
    action_type: Schema.ActionTypes.Tap,
    flow: Schema.Flow.ArtworkDetails,
    context_module: Schema.ContextModules.ArtworkDetails,
  }))
  render() {
    const { artwork } = this.props

    const enableLotConditionReport = NativeModules.Emission.options.AROptionsLotConditionReport

    const listItems = [
      { title: "Medium", value: artwork.category },
      {
        title: "Condition",
        value:
          enableLotConditionReport && artwork.canRequestLotConditionsReport ? (
            <RequestConditionReportQueryRenderer artworkID={artwork.slug} />
          ) : (
            artwork.conditionDescription && artwork.conditionDescription.details
          ),
      },
      { title: "Signature", value: artwork.signatureInfo && artwork.signatureInfo.details },
      {
        title: "Certificate of Authenticity",
        value: artwork.certificateOfAuthenticity && artwork.certificateOfAuthenticity.details,
      },
      { title: "Frame", value: artwork.framed && artwork.framed.details },
      { title: "Series", value: artwork.series },
      { title: "Publisher", value: artwork.publisher },
      { title: "Manufacturer", value: artwork.manufacturer },
      { title: "Image rights", value: artwork.image_rights },
    ]

    const displayItems = listItems.filter(i => i.value != null && i.value !== "")

    return (
      <Box>
        <Join separator={<Spacer my={1} />}>
          <Sans size="3t" weight="medium">
            Artwork details
          </Sans>
          {displayItems.map(({ title, value }, index) => (
            <React.Fragment key={index}>
              <Sans size="3t" weight="regular">
                {title}
              </Sans>
              {React.isValidElement(value) ? (
                value
              ) : (
                <ReadMore
                  content={value as string}
                  color="black60"
                  sans
                  maxChars={truncatedTextLimit()}
                  trackingFlow={Schema.Flow.ArtworkDetails}
                  contextModule={Schema.ContextModules.ArtworkDetails}
                />
              )}
            </React.Fragment>
          ))}
        </Join>
      </Box>
    )
  }
}

export const ArtworkDetailsFragmentContainer = createFragmentContainer(ArtworkDetails, {
  artwork: graphql`
    fragment ArtworkDetails_artwork on Artwork {
      slug
      category
      conditionDescription {
        label
        details
      }
      signatureInfo {
        label
        details
      }
      certificateOfAuthenticity {
        label
        details
      }
      framed {
        label
        details
      }
      series
      publisher
      manufacturer
      image_rights: imageRights
      canRequestLotConditionsReport
    }
  `,
})
