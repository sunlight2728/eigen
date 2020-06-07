import { HomeHeroTestsQuery } from "__generated__/HomeHeroTestsQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractText } from "lib/tests/extractText"
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { create } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { HomeHeroContainer } from "../HomeHero"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

jest.unmock("react-relay")
describe("HomeHero", () => {
  let environment = createMockEnvironment()
  beforeEach(() => {
    environment = createMockEnvironment()
  })
  const TestRenderer = () => (
    <QueryRenderer<HomeHeroTestsQuery>
      query={graphql`
        query HomeHeroTestsQuery {
          homePage {
            ...HomeHero_homePage
          }
        }
      `}
      render={({ props }) => (props?.homePage ? <HomeHeroContainer homePage={props.homePage} /> : null)}
      variables={{}}
      environment={environment}
    />
  )
  it(`renders all the things`, () => {
    const tree = create(<TestRenderer />)
    environment.mock.resolveMostRecentOperation(op =>
      MockPayloadGenerator.generate(op, {
        HomePageHeroUnit() {
          return {
            title: "Art Keeps Going",
            subtitle: "Art in the time of pandemic",
            linkText: "Learn More",
            creditLine: "Andy Warhol, 1973",
          }
        },
      })
    )

    expect(tree.root.findAllByType(Image)).toHaveLength(1)
    expect(extractText(tree.root)).toMatchInlineSnapshot(`"Art Keeps GoingArt in the time of pandemicLearn More"`)
  })

  it(`only shows the credit line after the image has loaded`, () => {
    const tree = create(<TestRenderer />)
    environment.mock.resolveMostRecentOperation(op =>
      MockPayloadGenerator.generate(op, {
        HomePageHeroUnit() {
          return {
            title: "Art Keeps Going",
            subtitle: "Art in the time of pandemic",
            linkText: "Learn More",
            creditLine: "Andy Warhol, 1973",
          }
        },
      })
    )

    expect(extractText(tree.root)).not.toContain("Warhol")
    tree.root.findByType(Image).props.onLoad()
    expect(extractText(tree.root)).toContain("Warhol")
  })

  it("is tappable", () => {
    const tree = create(<TestRenderer />)
    environment.mock.resolveMostRecentOperation(op =>
      MockPayloadGenerator.generate(op, {
        HomePageHeroUnit() {
          return {
            href: "/my-special-href",
          }
        },
      })
    )

    expect(SwitchBoard.presentNavigationViewController).not.toHaveBeenCalled()
    tree.root.findByType(TouchableOpacity).props.onPress()
    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), "/my-special-href")
  })
})
