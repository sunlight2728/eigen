// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import * as React from "react"
import { Text, View } from "react-native"

class Component extends React.Component {
  state = {
    data: "Loading",
  }

  componentDidMount() {
    this.setState(
      {
        data: "Loading",
      },
      () =>
        setImmediate(() => {
          this.setState({ data: "ohai" })
        })
    )
  }

  render() {
    return (
      <View>
        <Text>{this.state.data}</Text>
        {this.state.data !== "Loading" && this.props.children}
      </View>
    )
  }
}

describe("renderUntil", () => {
  describe("as an enzyme API extension", () => {
    it("yields an enzyme wrapper to the `until` block until it returns true", async () => {
      // @ts-ignore STRICTNESS_MIGRATION
      const states = []
      // @ts-ignore STRICTNESS_MIGRATION
      await mount(<Component />).renderUntil(tree => {
        const text = tree.find(Text).text()
        states.push(text)
        return text !== "Loading"
      })
      // @ts-ignore STRICTNESS_MIGRATION
      expect(states).toEqual(["Loading", "ohai"])
    })

    it("resolves the promise with an enzyme wrapper with the final state", async () => {
      // @ts-ignore STRICTNESS_MIGRATION
      const wrapper = await mount(<Component />).renderUntil(tree => tree.find(Text).text() !== "Loading")
      expect(wrapper.find(Text).text()).toEqual("ohai")
    })
  })
})
