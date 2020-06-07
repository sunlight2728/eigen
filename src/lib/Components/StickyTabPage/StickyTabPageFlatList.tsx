import { space } from "@artsy/palette"
import React, { useContext, useRef, useState } from "react"
import { FlatList, FlatListProps } from "react-native"
import Animated from "react-native-reanimated"
import { useAnimatedValue } from "./reanimatedHelpers"
import { useStickyTabPageContext } from "./StickyTabPage"
import { TAB_BAR_HEIGHT } from "./StickyTabPageTabBar"

interface FlatListRequiredContext {
  tabIsActive: Animated.Node<number>
}

const MOCK_CONTEXT: () => FlatListRequiredContext = () => ({
  tabIsActive: new Animated.Value(1),
})

export const StickyTabPageFlatListContext = React.createContext<FlatListRequiredContext>(
  __TEST__ ? MOCK_CONTEXT() : (null as any)
)

const AnimatedFlatList: typeof FlatList = Animated.createAnimatedComponent(FlatList)

export interface StickyTabSection {
  /* key must be unique per-tab */
  key: string
  content: JSX.Element
}
export interface StickyTabFlatListProps
  extends Omit<FlatListProps<any>, "onScroll" | "data" | "scrollEventThrottle" | "ListHeaderComponent" | "renderItem"> {
  data: StickyTabSection[]
}

export const StickyTabPageFlatList: React.FC<StickyTabFlatListProps> = props => {
  const { staticHeaderHeight: headerHeight, headerOffsetY } = useStickyTabPageContext()
  if (!headerHeight) {
    throw new Error("invalid state, mounted flat list before headerHeight was determined")
  }
  const { tabIsActive } = useContext(StickyTabPageFlatListContext)

  const contentHeight = useAnimatedValue(0)
  const layoutHeight = useAnimatedValue(0)
  const scrollOffsetY = useAnimatedValue(0)

  const { lockHeaderPosition } = useStickyHeaderPositioning({
    headerOffsetY,
    contentHeight,
    layoutHeight,
    headerHeight,
    scrollOffsetY,
  })

  const flatListRef = useRef<{ getNode(): FlatList<any> }>()

  const lastIsActive = useAnimatedValue(-1)

  // prevent this tab from manipulating the header position when it is not active
  Animated.useCode(
    () =>
      // when the active state changes
      Animated.cond(Animated.neq(lastIsActive, tabIsActive), [
        Animated.set(lastIsActive, tabIsActive),
        Animated.cond(
          tabIsActive,
          [
            // the tab just became active so we might need to adjust the scroll offset to avoid unwanted
            // white space before allowing the scroll offset to affect the header position
            Animated.cond(
              Animated.greaterThan(Animated.multiply(-1, headerOffsetY), scrollOffsetY),
              Animated.call([headerOffsetY], ([y]) => {
                if (!flatListRef.current) {
                  throw new Error(
                    "Please make sure that tab content is wrapped with a StickyTabPageFlatList or a StickyTabPageScrollView"
                  )
                }
                flatListRef.current.getNode().scrollToOffset({ offset: -y, animated: false })
                lockHeaderPosition.setValue(0)
              }),
              Animated.set(lockHeaderPosition, 0)
            ),
          ],
          Animated.set(lockHeaderPosition, 1)
        ),
      ]),
    []
  )

  // We need to wait for the header to mount before showing the rest of the content
  // to avoid jumping content in situations where certain items have fixed height.
  // This doesn't make a lot of sense but sometimes you just go with what works ¯\_(ツ)_/¯
  const [headerDidMount, setHeaderDidMount] = useState(__TEST__)
  const { data, style, ...otherProps } = props

  return (
    <AnimatedFlatList
      style={[
        {
          flex: 1,
          // standard h padding, might want to override in future?
          paddingHorizontal: space(2),
        },
        style,
      ]}
      showsVerticalScrollIndicator={false}
      ref={flatListRef as any}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { y: scrollOffsetY },
              contentSize: { height: contentHeight },
              layoutMeasurement: { height: layoutHeight },
            },
          },
        ],
        {
          useNativeDriver: true,
        }
      )}
      // we want every frame to trigger an update on the native side
      scrollEventThrottle={0.0000000001}
      ListHeaderComponent={
        <Animated.View
          onLayout={() => setHeaderDidMount(true)}
          style={{
            flex: 1,
            height: Animated.add(headerHeight, TAB_BAR_HEIGHT),
          }}
        />
      }
      renderItem={({ item }) => <>{item.content}</>}
      data={headerDidMount ? data : []}
      {...otherProps}
    />
  )
}

function useStickyHeaderPositioning({
  headerHeight,
  scrollOffsetY,
  headerOffsetY,
  contentHeight,
  layoutHeight,
}: {
  headerHeight: Animated.Node<number>
  scrollOffsetY: Animated.Node<number>
  headerOffsetY: Animated.Value<number>
  contentHeight: Animated.Node<number>
  layoutHeight: Animated.Node<number>
}) {
  const lockHeaderPosition = useAnimatedValue(1)

  Animated.useCode(() => {
    // scrollDiff is the amount the header has scrolled since last time this code ran
    const scrollDiff = Animated.diff(scrollOffsetY)

    const headerIsNotFullyUp = Animated.neq(headerOffsetY, negative(headerHeight))

    const nearTheTop = Animated.lessOrEq(scrollOffsetY, headerHeight)

    const amountScrolledUpward = new Animated.Value(0)
    const upwardScrollThresholdBreached = Animated.greaterOrEq(amountScrolledUpward, 400)

    // this is the code which actually performs the update to headerOffsetY, according to which direction
    // the scrolling is going
    const updateHeaderOffset = Animated.cond(
      Animated.greaterThan(scrollDiff, 0),
      [
        // y offset got bigger so scrolling down (content travels up the screen)
        // move the header up (hide it) unconditionally
        Animated.set(amountScrolledUpward, 0),
        Animated.set(headerOffsetY, Animated.max(negative(headerHeight), Animated.sub(headerOffsetY, scrollDiff))),
      ],
      [
        // y offset got smaller so scrolling up (content travels down the screen)
        // if velocity is high enough or we're already moving the header up or we're near the top of the scroll view
        // then move the header down (show it)
        Animated.set(amountScrolledUpward, Animated.add(amountScrolledUpward, Animated.abs(scrollDiff))),
        Animated.cond(Animated.or(upwardScrollThresholdBreached, headerIsNotFullyUp, nearTheTop), [
          Animated.set(headerOffsetY, Animated.min(0, Animated.sub(headerOffsetY, scrollDiff))),
        ]),
      ]
    )

    // we don't want to manipulate the header position while bouncing at the top or the bottom of the scroll view
    // cause it feels weeeird
    const notBouncingAtTheTop = Animated.greaterThan(scrollOffsetY, 0)
    const notBouncingAtTheBottom = Animated.lessThan(scrollOffsetY, Animated.sub(contentHeight, layoutHeight))

    const updateHeaderOffsetWhenNotBouncing = Animated.cond(
      Animated.and(notBouncingAtTheTop, notBouncingAtTheBottom),
      updateHeaderOffset,
      [
        Animated.cond(
          notBouncingAtTheTop,
          [
            // bouncing at the bottom,
            // normally the header will be fully up at this point but sometimes
            // the content is not tall enough to cause that, so we still need to
            // update the header position just like above. The only difference is that
            // when the bounce snaps back, we don't want to trigger opening the header
            // like we do when the user explicitly scrolls back upward.
            Animated.cond(
              Animated.greaterThan(scrollDiff, 0),
              [
                // y offset got bigger so scrolling down (content travels up the screen)
                Animated.set(
                  headerOffsetY,
                  Animated.max(negative(headerHeight), Animated.sub(headerOffsetY, scrollDiff))
                ),
              ],
              [
                // y offset got smaller so scrolling up (content travels down the screen)
                Animated.cond(Animated.or(headerIsNotFullyUp, nearTheTop), [
                  Animated.set(headerOffsetY, Animated.min(0, Animated.sub(headerOffsetY, scrollDiff))),
                ]),
              ]
            ),
          ],
          [
            // bouncing at the top, keep the header fully open
            Animated.set(headerOffsetY, 0),
            // deref scroll diff to prevent diff buildup when ignoring changes
            scrollDiff,
          ]
        ),
      ]
    )

    const updateHeaderOffsetWhenNotLocked = Animated.cond(
      Animated.not(lockHeaderPosition),
      updateHeaderOffsetWhenNotBouncing,
      // scroll diff to prevent diff buildup when ignoring changes
      scrollDiff
    )

    // on first eval (when the component mounts) the scroll values will be nonsensical so ignore
    const firstEval = new Animated.Value(1)
    return Animated.cond(
      firstEval,
      [
        Animated.set(firstEval, 0),
        // again, deref scrollDiff to prevent buildup
        scrollDiff,
      ],
      updateHeaderOffsetWhenNotLocked
    )
  }, [headerHeight])

  return { lockHeaderPosition }
}

const negative = (node: Animated.Node<number>) => Animated.multiply(-1, node)
