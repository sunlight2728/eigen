import { extractText } from "lib/tests/extractText"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import React, { MutableRefObject } from "react"
import { Text, View } from "react-native"
import { act, create, ReactTestRenderer } from "react-test-renderer"
import { ProvideRecentSearches, RecentSearch, useRecentSearches } from "../RecentSearches"

const TestItem: React.FC<{ href: string; onPress(): void }> = ({ href }) => {
  return <Text>{href}</Text>
}

type TestRef = MutableRefObject<{
  deleteRecentSearch(searchProps: RecentSearch["props"]): Promise<void>
  notifyRecentSearch(search: RecentSearch): Promise<void>
}>
const _TestPage: React.FC<{ testRef: TestRef; numItems?: number }> = ({
  testRef = { current: null },
  numItems = 10,
}) => {
  const { recentSearches, notifyRecentSearch, deleteRecentSearch } = useRecentSearches({ numSearches: numItems })
  testRef.current = { notifyRecentSearch, deleteRecentSearch }
  return (
    <View>
      {recentSearches.map(({ props }) => (
        <TestItem
          href={props.href! /* STRICTNESS_MIGRATION */}
          onPress={() => notifyRecentSearch({ type: "AUTOSUGGEST_RESULT_TAPPED", props })}
        />
      ))}
    </View>
  )
}

const TestPage: typeof _TestPage = props => {
  return (
    <ProvideRecentSearches>
      <_TestPage {...props} />
    </ProvideRecentSearches>
  )
}

const banksy: RecentSearch = {
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: "Banksy",
    displayType: "Artist",
    href: "https://artsy.com/artist/banksy",
    imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
  },
}
const andyWarhol: RecentSearch = {
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: "Andy Warhol",
    displayType: "Artist",
    href: "https://artsy.com/artist/andy-warhol",
    imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
  },
}

describe(useRecentSearches, () => {
  // @ts-ignore STRICTNESS_MIGRATION
  let testRef: TestRef = { current: null }
  // @ts-ignore STRICTNESS_MIGRATION
  let tree: ReactTestRenderer = null

  async function remountTree(jsx?: JSX.Element) {
    if (tree) {
      tree.unmount()
    }
    act(() => {
      tree = create(jsx || <TestPage testRef={testRef} />)
    })
    await flushPromiseQueue()
  }

  beforeEach(async () => {
    // @ts-ignore STRICTNESS_MIGRATION
    testRef = { current: null }
    require("@react-native-community/async-storage").__resetState()
    await remountTree()
  })

  it("starts out with an empty array", () => {
    expect(tree.root.findAllByType(TestItem)).toHaveLength(0)
  })

  it("has items if you notify of recent searches", async () => {
    await testRef.current.notifyRecentSearch(banksy)

    // should still be length 0 because local state doesn't update
    expect(tree.root.findAllByType(TestItem)).toHaveLength(1)
    expect(tree.root.findAllByType(TestItem)[0].props.href).toBe(banksy.props.href)
  })

  it("puts the most recent items at the top", async () => {
    await testRef.current.notifyRecentSearch(banksy)
    await testRef.current.notifyRecentSearch(andyWarhol)

    // trigger re-mount
    await remountTree()

    expect(tree.root.findAllByType(TestItem)).toHaveLength(2)
    expect(tree.root.findAllByType(TestItem)[0].props.href).toBe(andyWarhol.props.href)
    expect(tree.root.findAllByType(TestItem)[1].props.href).toBe(banksy.props.href)
  })

  it("reorders items if they get reused", async () => {
    await testRef.current.notifyRecentSearch(banksy)
    await testRef.current.notifyRecentSearch(andyWarhol)

    // reorder
    await testRef.current.notifyRecentSearch(banksy)

    await remountTree()

    expect(tree.root.findAllByType(TestItem)).toHaveLength(2)
    expect(tree.root.findAllByType(TestItem)[0].props.href).toBe(banksy.props.href)
    expect(tree.root.findAllByType(TestItem)[1].props.href).toBe(andyWarhol.props.href)

    // reorder again
    await tree.root.findAllByType(TestItem)[1].props.onPress()

    // trigger re-mount
    await remountTree()

    expect(tree.root.findAllByType(TestItem)[0].props.href).toBe(andyWarhol.props.href)
    expect(tree.root.findAllByType(TestItem)[1].props.href).toBe(banksy.props.href)
  })

  it(`keeps a max of 100 items`, async () => {
    for (let i = 0; i < 1000; i++) {
      await testRef.current.notifyRecentSearch({
        type: "AUTOSUGGEST_RESULT_TAPPED",
        props: {
          href: `https://example.com/${i}`,
          imageUrl: "",
          displayLabel: "",
          displayType: "",
        },
      })
    }

    await remountTree(<TestPage testRef={testRef} numItems={1000} />)

    expect(tree.root.findAllByType(TestItem)).toHaveLength(100)
    expect(tree.root.findAllByType(TestItem)[0].props.href).toBe("https://example.com/999")
  })

  it(`only shows the requested number`, async () => {
    for (let i = 0; i < 1000; i++) {
      await testRef.current.notifyRecentSearch({
        type: "AUTOSUGGEST_RESULT_TAPPED",
        props: {
          href: `https://example.com/${i}`,
          imageUrl: "",
          displayLabel: "",
          displayType: "",
        },
      })
    }

    await remountTree(<TestPage testRef={testRef} numItems={5} key={0} />)

    expect(tree.root.findAllByType(TestItem)).toHaveLength(5)

    await remountTree(<TestPage testRef={testRef} numItems={51} key={1} />)

    expect(tree.root.findAllByType(TestItem)).toHaveLength(51)
  })

  it(`allows deleting things`, async () => {
    await testRef.current.notifyRecentSearch(banksy)
    await testRef.current.notifyRecentSearch(andyWarhol)

    await remountTree(<TestPage testRef={testRef} key={0} />)

    expect(tree.root.findAllByType(TestItem)).toHaveLength(2)

    expect(extractText(tree.root)).toContain("andy-warhol")
    await testRef.current.deleteRecentSearch(andyWarhol.props)

    expect(tree.root.findAllByType(TestItem)).toHaveLength(1)
    expect(extractText(tree.root)).not.toContain("andy-warhol")
  })
})
