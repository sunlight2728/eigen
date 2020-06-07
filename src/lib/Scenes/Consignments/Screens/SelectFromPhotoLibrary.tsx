import { Box, Serif, Spacer, Theme } from "@artsy/palette"
import CameraRoll from "@react-native-community/cameraroll"
import { triggerCamera } from "lib/NativeModules/triggerCamera"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import {
  Alert,
  Dimensions,
  Linking,
  NativeModules,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Route,
  ScrollView,
  View,
  ViewProperties,
} from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { BottomAlignedButton } from "../Components/BottomAlignedButton"
import ImageSelection, { ImageData } from "../Components/ImageSelection"
import { ConsignmentSetup } from "../index"

const { ARCocoaConstantsModule, ARTakeCameraPhotoModule } = NativeModules

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
  setup: ConsignmentSetup
  updateWithPhotos: (photos: string[]) => void
}

interface State {
  cameraImages: ImageData[]
  lastCursor: string
  loadingMore: boolean
  noMorePhotos: boolean
  selection: string[]
}

export default class SelectFromPhotoLibrary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const hasPhotos = props.setup && props.setup.photos
    this.state = {
      cameraImages: [],
      loadingMore: false,
      lastCursor: "",
      noMorePhotos: false,
      // @ts-ignore STRICTNESS_MIGRATION
      selection: hasPhotos ? props.setup.photos.map(p => p.file) : [],
    }
  }

  componentDidMount() {
    this.tryPhotoLoad()
  }

  tryPhotoLoad() {
    if (!this.state.loadingMore) {
      this.setState({ loadingMore: true }, () => {
        this.loadPhotos()
      })
    }
  }

  async loadPhotos() {
    const fetchParams: CameraRoll.GetPhotosParams = {
      first: 20,
      assetType: "Photos",
      groupTypes: "All",
    }

    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor
    }

    // This isn't optimal, but CameraRoll isn't provided in
    // the React Native mock from Jest. This means that it
    // can't be tested, and it will be undefined.
    const inTesting = typeof jest !== "undefined"
    if (inTesting) {
      return
    }

    try {
      this.appendAssets(await CameraRoll.getPhotos(fetchParams))
    } catch (_) {
      setTimeout(() => {
        Alert.alert("Grant access in settings", "To upload photos, give Artsy access in your device settings.", [
          { text: "Cancel" },
          {
            text: "Go to settings",
            onPress: () => {
              Linking.openURL("app-settings:")
            },
          },
        ])
      }, 300)
    }
  }

  appendAssets(data: CameraRoll.PhotoIdentifiersPage) {
    const assets = data.edges

    if (assets.length === 0) {
      this.setState({
        loadingMore: false,
        noMorePhotos: !data.page_info.has_next_page,
      })
    } else {
      this.setState({
        loadingMore: false,
        noMorePhotos: !data.page_info.has_next_page,
        // @ts-ignore STRICTNESS_MIGRATION
        lastCursor: data.page_info.end_cursor,
        cameraImages: this.state.cameraImages.concat(assets.map(a => a.node)),
      })
    }
  }

  onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const windowHeight = Dimensions.get("window").height
    const height = e.nativeEvent.contentSize.height
    const offset = e.nativeEvent.contentOffset.y

    if (windowHeight + offset >= height) {
      this.tryPhotoLoad()
    }
  }

  doneTapped = () => {
    this.props.updateWithPhotos([...this.state.selection.values()])
    this.props.navigator.pop()
  }

  onPressNewPhoto = async () => {
    try {
      const success = await triggerCamera(this)
      if (success) {
        // Grab the most recent photo
        // and add it to the top

        const fetchParams: any = {
          first: 1,
          assetType: "Photos",
          groupTypes: "All",
        }

        const photos = await CameraRoll.getPhotos(fetchParams)
        if (!photos.edges || photos.edges.length === 0) {
          console.error("SelectFromLibrary: Got no photos when looking for most recent")
        } else {
          const photo = photos.edges.map(e => e.node)[0]

          // Update selection
          this.setState({
            selection: [...this.state.selection, photo.image.uri],
            // An item in cameraImage is a subset of the photo that we pass in,
            // so we `as any` to avoid a compiler error
            cameraImages: [photo].concat(this.state.cameraImages as any),
          })
        }
      } else {
        console.log("SelectFromLibrary: Did not receive a photo from call to getPhotos")
      }
    } catch (error) {
      const errors = ARTakeCameraPhotoModule.errorCodes
      switch (error.code) {
        case errors.cameraNotAvailable:
        case errors.imageMediaNotAvailable:
          Alert.alert(error.message)
          break

        case errors.cameraAccessDenied:
          Alert.alert(
            error.message,
            "Please enable camera access from Settings to be able to take photos of your artwork.",
            [
              { text: "Cancel" },
              {
                text: "Settings",
                onPress: () => Linking.openURL(ARCocoaConstantsModule.UIApplicationOpenSettingsURLString),
              },
            ]
          )
          break

        case errors.saveFailed:
          const underlyingError = error.userInfo && error.userInfo.NSUnderlyingError
          Alert.alert(error.message, underlyingError && `${underlyingError.message} (${underlyingError.code})`)
          break

        default:
          console.error(error)
      }
    }
  }

  onNewSelectionState = (selection: string[]) => this.setState({ selection })

  render() {
    return (
      <Theme>
        <ProvideScreenDimensions>
          <BottomAlignedButton onPress={this.doneTapped} buttonText="Done">
            <ScrollView style={{ flex: 1 }} scrollsToTop={true} onScroll={this.onScroll} scrollEventThrottle={50}>
              <View style={{ paddingTop: 40 }}>
                <Box px={2}>
                  <Serif size="4" style={{ textAlign: "center" }}>
                    Please add photos of the work. We suggest including the front and back as well as the signature.
                  </Serif>
                </Box>
                <Spacer mb={2} />
                <ImageSelection
                  data={this.state.cameraImages}
                  onPressNewPhoto={this.onPressNewPhoto}
                  onUpdateSelectedStates={this.onNewSelectionState}
                  selected={this.state.selection}
                />
              </View>
            </ScrollView>
          </BottomAlignedButton>
        </ProvideScreenDimensions>
      </Theme>
    )
  }
}
