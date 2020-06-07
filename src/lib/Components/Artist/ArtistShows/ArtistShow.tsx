import React from "react"
import { TouchableWithoutFeedback, View, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "../../../NativeModules/SwitchBoard"
import Metadata from "./Metadata"

import { ArtistShow_show } from "__generated__/ArtistShow_show.graphql"
import { hrefForPartialShow } from "lib/utils/router"

interface Props {
  show: ArtistShow_show
  styles?: {
    container?: ViewStyle
    image?: ViewStyle
    metadata?: ViewStyle
  }
}

class Show extends React.Component<Props> {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, hrefForPartialShow(this.props.show))
  }

  render() {
    const show = this.props.show
    const image = show.cover_image
    const imageURL = image && image.url

    const styles = this.props.styles

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View style={[styles?.container]}>
          <OpaqueImageView
            imageURL={imageURL}
            style={[styles?.image, { overflow: "hidden", borderRadius: 2, flex: 0 }]}
          />
          {/* this wrapper required to make numberOfLines work when parent is a row */}
          <View style={{ flex: 1 }}>
            <Metadata show={show} style={styles && styles.metadata} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default createFragmentContainer(Show, {
  show: graphql`
    fragment ArtistShow_show on Show {
      slug
      href
      is_fair_booth: isFairBooth
      cover_image: coverImage {
        url(version: "large")
      }
      ...Metadata_show
    }
  `,
})
