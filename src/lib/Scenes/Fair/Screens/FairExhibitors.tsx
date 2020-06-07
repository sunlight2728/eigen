import { Box, Sans, Separator, Serif, Theme } from "@artsy/palette"
import { FairExhibitors_fair } from "__generated__/FairExhibitors_fair.graphql"
import { FairExhibitorsQuery } from "__generated__/FairExhibitorsQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, screenTrack, track } from "lib/utils/track"
import React from "react"
import { SectionList, TouchableOpacity, ViewProperties } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { defaultEnvironment } from "../../../relay/createEnvironment"
import renderWithLoadProgress from "../../../utils/renderWithLoadProgress"

interface Props extends ViewProperties {
  fair: FairExhibitors_fair
}

interface State {
  sections: Array<{
    items: any
    letter: string
    index: number
    sections: any
    data: any
  }>
}

@screenTrack<Props>(props => ({
  context_screen: Schema.PageNames.FairAllExhibitorsPage,
  context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
  context_screen_owner_slug: props.fair.slug,
  context_screen_owner_id: props.fair.internalID,
}))
export class FairExhibitors extends React.Component<Props, State> {
  state = {
    sections: [],
  }

  componentDidMount() {
    const { fair } = this.props
    if (!fair) {
      return
    }
    const sections = [] as any
    const exhibitorsGroupedByName = fair.exhibitorsGroupedByName || []
    exhibitorsGroupedByName.forEach(group => {
      sections.push({
        // @ts-ignore STRICTNESS_MIGRATION
        title: group.letter,
        // @ts-ignore STRICTNESS_MIGRATION
        data: group.exhibitors,
        // @ts-ignore STRICTNESS_MIGRATION
        count: group.exhibitors.length,
      })
    })
    this.setState({ sections })
  }

  @track((__, _, args) => {
    const slug = args[1]
    const partnerID = args[2]
    return {
      action_name: Schema.ActionNames.ListGallery,
      action_type: Schema.ActionTypes.Tap,
      owner_id: partnerID,
      owner_slug: slug,
      owner_type: Schema.OwnerEntityTypes.Gallery,
    } as any
  })
  // @ts-ignore STRICTNESS_MIGRATION
  handleOnPressName(profileID, _slug, _partnerID) {
    if (profileID) {
      SwitchBoard.presentNavigationViewController(this, `/show/${profileID}?entity=fair-booth`)
    }
  }

  // @ts-ignore STRICTNESS_MIGRATION
  renderExhibitor(data) {
    const { item, index, section } = data
    const { count } = section
    const { name, profileID, slug, partnerID } = item
    const generatedKey = count - index
    return (
      <Box mb={2} key={generatedKey}>
        <TouchableOpacity
          onPress={() => {
            this.handleOnPressName(profileID, slug, partnerID)
          }}
        >
          <Serif size="3">{name}</Serif>
        </TouchableOpacity>
      </Box>
    )
  }

  // @TODO: Implement test for this component: https://artsyproduct.atlassian.net/browse/LD-549
  render() {
    return (
      <Theme>
        <SectionList
          stickySectionHeadersEnabled={true}
          renderItem={data => <Box px={2}>{this.renderExhibitor(data)}</Box>}
          ListHeaderComponent={() => {
            return (
              <Box px={2} mb={2} pt={85}>
                <Serif size="8">Exhibitors</Serif>
              </Box>
            )
          }}
          renderSectionHeader={({ section: { title } }) => (
            <Box px={2} mb={2}>
              <Sans weight="medium" size="4">
                {title}
              </Sans>
              <Separator />
            </Box>
          )}
          // @ts-ignore STRICTNESS_MIGRATION
          renderSectionFooter={({ section }) => {
            if (section.index < this.state.sections.length - 1) {
              return (
                <Box px={2} pb={2}>
                  <Separator />
                </Box>
              )
            }
          }}
          sections={this.state.sections}
          keyExtractor={(item, index) => item + index}
        />
      </Theme>
    )
  }
}

const FairExhibitorsFragmentContainer = createFragmentContainer(FairExhibitors, {
  fair: graphql`
    fragment FairExhibitors_fair on Fair {
      slug
      internalID
      exhibitorsGroupedByName {
        letter
        exhibitors {
          name
          slug
          profileID
          partnerID
        }
      }
    }
  `,
})

export const FairExhibitorsRenderer: React.SFC<{ fairID: string }> = ({ fairID }) => (
  <QueryRenderer<FairExhibitorsQuery>
    environment={defaultEnvironment}
    query={graphql`
      query FairExhibitorsQuery($fairID: String!) {
        fair(id: $fairID) {
          ...FairExhibitors_fair
        }
      }
    `}
    variables={{ fairID }}
    render={renderWithLoadProgress(FairExhibitorsFragmentContainer)}
  />
)
